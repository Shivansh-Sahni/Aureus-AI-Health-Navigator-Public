import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, VerifiedResource } from '@/lib/supabase';
import { openai, generateEmbedding, detectEmergency, SAM_SYSTEM_PROMPT } from '@/lib/openai';

function extractLocationAndService(message: string): { zipCode?: string; city?: string; state?: string; serviceType?: string } {
  const result: { zipCode?: string; city?: string; state?: string; serviceType?: string } = {};
  
  const zipMatch = message.match(/\b\d{5}(-\d{4})?\b/);
  if (zipMatch) {
    result.zipCode = zipMatch[0].slice(0, 5);
  }
  
  const stateAbbrs = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
  const statePattern = new RegExp(`\\b(${stateAbbrs.join('|')})\\b`, 'i');
  const stateMatch = message.match(statePattern);
  if (stateMatch) {
    result.state = stateMatch[1].toUpperCase();
  }
  
  const serviceTypes = [
    { keywords: ['mental health', 'counseling', 'therapy', 'ptsd', 'depression', 'anxiety', 'psychiatr'], type: 'Mental Health' },
    { keywords: ['primary care', 'general doctor', 'family doctor', 'checkup', 'physical'], type: 'Primary Care' },
    { keywords: ['va benefit', 'veteran benefit', 'gi bill', 'disability claim', 'va claim'], type: 'VA Benefits' },
    { keywords: ['dental', 'dentist', 'teeth'], type: 'Dental' },
    { keywords: ['vision', 'eye', 'optometr', 'ophthalmolog'], type: 'Vision' },
    { keywords: ['emergency', 'urgent care', 'er '], type: 'Emergency' },
    { keywords: ['substance', 'addiction', 'rehab', 'drug', 'alcohol'], type: 'Substance Abuse' },
    { keywords: ['housing', 'homeless', 'shelter'], type: 'Housing Assistance' },
    { keywords: ['food', 'nutrition', 'meal'], type: 'Food Assistance' },
    { keywords: ['transportation', 'ride', 'travel'], type: 'Transportation' }
  ];
  
  const lowerMessage = message.toLowerCase();
  for (const service of serviceTypes) {
    if (service.keywords.some(kw => lowerMessage.includes(kw))) {
      result.serviceType = service.type;
      break;
    }
  }
  
  return result;
}

async function searchResources(
  queryEmbedding: number[],
  filters: { serviceType?: string; state?: string; zipCode?: string },
  limit: number = 5
): Promise<VerifiedResource[]> {
  const query = supabaseAdmin.rpc('match_resources', {
    query_embedding: queryEmbedding,
    match_threshold: 0.3,
    match_count: limit * 2
  });
  
  const { data: rpcData, error: rpcError } = await query;
  
  if (rpcError) {
    let baseQuery = supabaseAdmin
      .from('verified_resources')
      .select('*');
    
    if (filters.serviceType) {
      baseQuery = baseQuery.ilike('service_type', `%${filters.serviceType}%`);
    }
    if (filters.state) {
      baseQuery = baseQuery.ilike('state', filters.state);
    }
    if (filters.zipCode) {
      baseQuery = baseQuery.eq('zip_code', filters.zipCode);
    }
    
    const { data, error } = await baseQuery.limit(limit);
    
    if (error || !data) return [];
    return data as VerifiedResource[];
  }
  
  let results = rpcData as VerifiedResource[];
  
  if (filters.serviceType) {
    const filtered = results.filter(r => 
      r.service_type.toLowerCase().includes(filters.serviceType!.toLowerCase())
    );
    if (filtered.length > 0) results = filtered;
  }
  if (filters.state) {
    const filtered = results.filter(r => 
      r.state?.toUpperCase() === filters.state!.toUpperCase()
    );
    if (filtered.length > 0) results = filtered;
  }
  if (filters.zipCode) {
    const filtered = results.filter(r => r.zip_code === filters.zipCode);
    if (filtered.length > 0) results = filtered;
  }
  
  return results.slice(0, limit);
}

function formatResourcesForLLM(resources: VerifiedResource[]): string {
  if (resources.length === 0) {
    return 'No matching resources found in the database.';
  }
  
  return resources.map((r, i) => `
RESOURCE ${i + 1}:
- Name: ${r.resource_name}
- Service Type: ${r.service_type}
- Address: ${r.physical_address || 'Not available'}
- City: ${r.city || 'Not available'}, State: ${r.state || 'Not available'}, ZIP: ${r.zip_code || 'Not available'}
- Phone: ${r.contact_phone || 'Not available'}
- Website: ${r.website_url || 'Not available'}
- Eligibility: ${r.eligibility_criteria || 'Contact for eligibility information'}
- Source URL: ${r.source_url}
- Source Name: ${new URL(r.source_url).hostname.replace('www.', '')}
`).join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    const isEmergency = detectEmergency(message);
    
    const extracted = extractLocationAndService(message);
    
    const queryEmbedding = await generateEmbedding(message);
    
    const resources = await searchResources(queryEmbedding, {
      serviceType: extracted.serviceType,
      state: extracted.state,
      zipCode: extracted.zipCode
    });
    
    const resourceContext = formatResourcesForLLM(resources);
    
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SAM_SYSTEM_PROMPT },
      { role: 'system', content: `AVAILABLE VERIFIED RESOURCES:\n${resourceContext}\n\nYou must ONLY reference these resources. Do not make up any other resources.` }
    ];
    
    for (const msg of history.slice(-10)) {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      });
    }
    
    messages.push({ role: 'user', content: message });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });
    
    const assistantMessage = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
    
    return NextResponse.json({
      message: assistantMessage,
      isEmergency,
      resourcesFound: resources.length
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
