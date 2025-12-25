# Supabase Admin Client

This directory contains the Supabase admin client configuration that **bypasses Row Level Security (RLS)** policies.

## 🔐 Security Warning

**CRITICAL**: The admin client uses the `SUPABASE_SERVICE_ROLE_KEY` which has **full database access** and bypasses all RLS policies. 

- ✅ **ONLY** use in server-side code (API routes, Server Components, Server Actions)
- ❌ **NEVER** expose to the client-side
- ❌ **NEVER** import in Client Components
- ❌ **NEVER** commit the service role key to version control

## 📦 Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

You can find these in your Supabase Dashboard:
- Go to **Settings** → **API**
- `NEXT_PUBLIC_SUPABASE_URL` is the "Project URL"
- `SUPABASE_SERVICE_ROLE_KEY` is the "service_role" key (under "Project API keys")

### 2. Database Types

The types are defined in `src/types/supabase.ts`. To regenerate them from your actual schema:

```bash
# Using project ID
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts

# Or using local development
npx supabase gen types typescript --local > src/types/supabase.ts
```

## 🚀 Usage

### Basic Usage (Singleton Pattern - Recommended)

```typescript
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
    const admin = getSupabaseAdmin()
    
    // This bypasses RLS - can read all users
    const { data, error } = await admin
        .from('users')
        .select('*')
    
    return Response.json({ data, error })
}
```

### Fresh Instance (When Needed)

```typescript
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function performIsolatedOperation() {
    // Creates a new instance instead of using the singleton
    const admin = createSupabaseAdmin()
    
    const { data, error } = await admin
        .from('users')
        .select('*')
    
    return data
}
```

## 📝 Common Use Cases

### 1. User Management

```typescript
// Create user
const { data } = await admin
    .from('users')
    .insert({ email: 'user@example.com', name: 'John Doe' })
    .select()
    .single()

// Update any user (bypasses RLS)
const { data } = await admin
    .from('users')
    .update({ name: 'Jane Doe' })
    .eq('id', userId)
    .select()
    .single()

// Delete user and related data
await admin.from('sessions').delete().eq('user_id', userId)
await admin.from('accounts').delete().eq('user_id', userId)
await admin.from('users').delete().eq('id', userId)
```

### 2. Batch Operations

```typescript
// Get all users (no RLS restrictions)
const { data } = await admin
    .from('users')
    .select('*')

// Bulk insert
const { data } = await admin
    .from('users')
    .insert([
        { email: 'user1@example.com', name: 'User 1' },
        { email: 'user2@example.com', name: 'User 2' }
    ])
```

### 3. Admin Queries

```typescript
// Complex joins across tables
const { data } = await admin
    .from('users')
    .select(`
        *,
        accounts(*),
        sessions(*)
    `)

// Aggregations
const { count } = await admin
    .from('users')
    .select('*', { count: 'exact', head: true })
```

## 🔄 Differences from Regular Client

| Feature | Regular Client | Admin Client |
|---------|---------------|--------------|
| RLS Policies | ✅ Enforced | ❌ Bypassed |
| Auth Required | ✅ Yes | ❌ No |
| Use Case | Client-side, user operations | Server-side, admin operations |
| Security | User-level access | Full database access |
| Session | Required | Not required |

## ⚙️ Configuration

The admin client is configured with:

```typescript
{
    auth: {
        autoRefreshToken: false,      // No token refresh needed
        persistSession: false,         // Don't persist sessions
        detectSessionInUrl: false      // Don't check URL for session
    },
    db: {
        schema: 'public'              // Use public schema
    }
}
```

## 🎯 Best Practices

1. **Use in API Routes Only**: Keep admin operations in `/app/api` routes
2. **Validate Input**: Always validate and sanitize user input before admin operations
3. **Log Admin Actions**: Log all admin operations for audit trails
4. **Error Handling**: Always handle errors properly
5. **Type Safety**: Use the generated Database types for type safety

## 📚 Example File

See `admin-examples.ts` for comprehensive usage examples.

## 🔗 Related Files

- `admin.ts` - Admin client configuration
- `admin-examples.ts` - Usage examples
- `../types/supabase.ts` - Database type definitions

## 📖 Documentation

- [Supabase Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Service Role Key](https://supabase.com/docs/guides/api/api-keys)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
