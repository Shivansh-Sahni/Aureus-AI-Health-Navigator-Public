import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export type VerifiedResource = {
  id: number;
  resource_name: string;
  service_type: string;
  physical_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  eligibility_criteria: string | null;
  contact_phone: string | null;
  website_url: string | null;
  source_url: string;
  last_verified_date: string | null;
  keywords: string | null;
  embedding: number[];
};
