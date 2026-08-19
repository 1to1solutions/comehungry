# Wiring the "starting a table" form

The form works with no setup — it hands the request to the person's email app
addressed to hello@comehungry.org. Nothing is lost. To store submissions instead:

## 1. Make the table in Supabase (SQL editor)

```sql
create table public.starting_a_table (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  place text not null,
  note text
);

alter table public.starting_a_table enable row level security;

-- anonymous visitors may INSERT and nothing else.
-- nobody can read the list with the public key, including if it leaks.
create policy "anyone may ask for a hand"
  on public.starting_a_table for insert to anon with check (true);
```

## 2. Put your two values in index.html

Search for `===== CONFIG` and fill in:

```js
var SUPABASE_URL = 'https://YOURPROJECT.supabase.co';
var SUPABASE_KEY = 'your anon / public key';
```

The anon key is designed to be public. With the policy above it can only add
rows, never read them. Read the list from the Supabase dashboard.

## 3. What you promised on that page

The page tells people their name and email are used to write back and to send
the safety guide, are never sold, rented, mailed to, or handed on, and will be
deleted on request. Those are commitments, not copy. Keep them.

If the insert ever fails, the form falls back to email so no one who asked for
help is dropped.
