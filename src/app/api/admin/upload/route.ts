import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/openai';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'aureus-admin-secret-2024';

function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    records.push(record);
  }
  
  return records;
}

function normalizeRecord(record: Record<string, string>) {
  return {
    resource_name: record.resource_name || record.name || '',
    service_type: record.service_type || record.type || '',
    physical_address: record.physical_address || record.address || null,
    city: record.city || null,
    state: (record.state || '').toUpperCase().slice(0, 2) || null,
    zip_code: (record.zip_code || record.zip || '').slice(0, 5) || null,
    eligibility_criteria: record.eligibility_criteria || record.eligibility || null,
    contact_phone: record.contact_phone || record.phone || null,
    website_url: record.website_url || record.website || null,
    source_url: record.source_url || record.source || '',
    last_verified_date: record.last_verified_date || new Date().toISOString().split('T')[0],
    keywords: record.keywords || null
  };
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'CSV file is required' }, { status: 400 });
    }
    
    const csvText = await file.text();
    const records = parseCSV(csvText);
    
    if (records.length === 0) {
      return NextResponse.json({ error: 'No valid records found in CSV' }, { status: 400 });
    }
    
    const results = {
      total: records.length,
      success: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    for (let i = 0; i < records.length; i++) {
      try {
        const normalized = normalizeRecord(records[i]);
        
        if (!normalized.resource_name || !normalized.service_type || !normalized.source_url) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Missing required fields (resource_name, service_type, source_url)`);
          continue;
        }
        
        const embeddingText = [
          normalized.resource_name,
          normalized.service_type,
          normalized.city,
          normalized.state,
          normalized.eligibility_criteria,
          normalized.keywords
        ].filter(Boolean).join(' ');
        
        const embedding = await generateEmbedding(embeddingText);
        
        const { error } = await supabaseAdmin
          .from('verified_resources')
          .insert({
            ...normalized,
            embedding
          });
        
        if (error) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: ${error.message}`);
        } else {
          results.success++;
        }
        
      } catch (err) {
        results.failed++;
        results.errors.push(`Row ${i + 2}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
    
    return NextResponse.json({
      message: `Processed ${results.total} records: ${results.success} successful, ${results.failed} failed`,
      ...results
    });
    
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the upload' },
      { status: 500 }
    );
  }
}
