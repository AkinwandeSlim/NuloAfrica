# Environment Variables Setup

## Create `.env.local` file in the client folder

```bash
# FastAPI Backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase (Optional - if you want to use Supabase features)
NEXT_PUBLIC_SUPABASE_URL=https://tqmjcygeykmbdjcfdbga.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Steps:

1. Create a file named `.env.local` in the `client` folder
2. Copy the content above
3. Update the values if needed
4. Restart your Next.js dev server

**Note:** The `.env.local` file is gitignored for security.
