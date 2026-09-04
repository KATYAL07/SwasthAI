-- Local testing shim — NOT for a Supabase project.
--
-- supabase/schema.sql references auth.users: a foreign key from the profile
-- table, a trigger on insert, and auth.uid() inside the row-level-security
-- policies. A hosted Supabase project provides all of that. A plain Postgres
-- does not, so schema.sql cannot be applied to one without this first.
--
-- Running this against a real Supabase project would attempt to redefine its
-- auth schema, so every statement is guarded: the table is only created if
-- absent, and auth.uid() is only defined when nothing already provides it.
--
--   psql "$DATABASE_URL" -f supabase/local-test-shim.sql
--   psql "$DATABASE_URL" -f supabase/schema.sql
--
-- What this reproduces is the shape schema.sql depends on, not Supabase Auth.
-- There is no password handling, no email delivery and no token issuing here —
-- a local run mints its own tokens with the same HS256 secret the server
-- verifies against, which is exactly what the server checks in production.

create schema if not exists auth;

-- The columns schema.sql's trigger actually reads, and nothing more.
create table if not exists auth.users (
  id                 uuid primary key default gen_random_uuid(),
  email              text unique not null,
  raw_user_meta_data jsonb default '{}'::jsonb,
  email_confirmed_at timestamptz default now(),
  created_at         timestamptz default now()
);

-- RLS policies call auth.uid() to identify the caller. Requests here arrive
-- through the Express API as the database owner, so nothing is evaluated
-- against it; it exists so the policy definitions parse.
do $$
begin
  if not exists (
    select 1 from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'auth' and p.proname = 'uid'
  ) then
    execute $fn$
      create function auth.uid() returns uuid
      language sql stable
      as 'select nullif(current_setting(''request.jwt.claim.sub'', true), '''')::uuid';
    $fn$;
  end if;
end $$;
