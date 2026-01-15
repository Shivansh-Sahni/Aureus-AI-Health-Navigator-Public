# Aureus: AI Health Equity Navigator

A production-ready full-stack web application that helps veterans, rural populations, and disabled individuals find verified healthcare resources through an AI-powered chat interface.

## Features

- **AI-Powered Chat**: Conversational interface with "Sam the Owl" persona
- **RAG (Retrieval-Augmented Generation)**: Semantic search over verified healthcare resources
- **Emergency Detection**: Automatic detection of crisis keywords with emergency banner
- **Accessibility**: ARIA labels, keyboard navigation, high contrast
- **Feedback System**: Thumbs up/down on responses for quality improvement
- **Citation Enforcement**: Every resource includes verified source links

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL with pgvector
- **AI**: OpenAI GPT-4o-mini + text-embedding-3-small
- **Auth**: Supabase Auth (anonymous sessions)

## Environment Variables

Create a `.env.local` file with:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_api_key
ADMIN_SECRET=your_admin_secret_for_csv_upload
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
bun install
```

### 2. Set Up Database

The database schema is already configured in Supabase with:

- `verified_resources` table with vector embeddings
- `user_feedback` table for response feedback
- Row Level Security (RLS) enabled on all tables
- `match_resources` function for semantic search

### 3. Load Sample Data

Upload the included `sample_resources.csv` file:

```bash
curl -X POST http://localhost:3000/api/admin/upload \
  -H "Authorization: Bearer your_admin_secret" \
  -F "file=@sample_resources.csv"
```

### 4. Run Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.
Navigate to [http://localhost:3000/chat](http://localhost:3000/chat) for the chat interface.

## API Endpoints

### POST /api/chat

Main chat endpoint for RAG workflow.

**Request:**
```json
{
  "message": "I need mental health services in California",
  "history": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
}
```

**Response:**
```json
{
  "message": "Based on your request, here are verified mental health resources...",
  "isEmergency": false,
  "resourcesFound": 3
}
```

### POST /api/feedback

Submit feedback on assistant responses.

**Request:**
```json
{
  "sessionId": "session_123",
  "messageId": "assistant_456",
  "helpful": true
}
```

### POST /api/admin/upload

Admin endpoint for CSV data ingestion. Requires `Authorization: Bearer ADMIN_SECRET` header.

**Request:** Multipart form with `file` field containing CSV.

**CSV Format:**
```csv
resource_name,service_type,physical_address,city,state,zip_code,eligibility_criteria,contact_phone,website_url,source_url,keywords
```

## Database Schema

### verified_resources

| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| resource_name | text | Name of the resource |
| service_type | text | e.g., Mental Health, Primary Care, VA Benefits |
| physical_address | text | Street address |
| city | text | City |
| state | text | State abbreviation |
| zip_code | text | ZIP code |
| eligibility_criteria | text | Who can access this resource |
| contact_phone | text | Phone number |
| website_url | text | Website |
| source_url | text | Verification source (required) |
| last_verified_date | date | When data was verified |
| keywords | text | Search keywords |
| embedding | vector(1536) | OpenAI embedding |

### user_feedback

| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| session_id | text | User session identifier |
| message_id | text | Message being rated |
| helpful | boolean | Was the response helpful? |
| timestamp | timestamptz | When feedback was submitted |

## Verifying RLS Configuration

To verify Row Level Security is correctly configured:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public';
```

Expected output:
- Both tables should have `rowsecurity = true`
- Policies should show `service_role` for SELECT on `verified_resources`
- Policies should show `service_role` for INSERT on `user_feedback`

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Other Platforms

Ensure the platform supports:
- Node.js 18+
- Environment variables
- Serverless functions or long-running processes

## Security Notes

- **Never expose** `SUPABASE_SERVICE_ROLE_KEY` or `OPENAI_API_KEY` to the client
- All database operations go through server-side API routes
- RLS ensures clients cannot directly query tables
- Admin upload endpoint requires secret authentication

## Sam the Owl Guardrails

The AI assistant follows strict rules:
1. Only discusses healthcare resource finding
2. Never provides medical advice or diagnoses
3. Only references resources from the verified database
4. Includes source citations for every resource
5. Asks clarifying questions when information is insufficient
6. Detects emergency keywords and triggers alert banner

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Main RAG endpoint
│   │   ├── feedback/route.ts  # Feedback submission
│   │   └── admin/upload/route.ts  # CSV ingestion
│   ├── chat/page.tsx          # Chat interface
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── openai.ts              # OpenAI client + helpers
└── components/ui/             # shadcn/ui components
```

## License

MIT
