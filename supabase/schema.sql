-- SwasthAI — Postgres schema for Supabase
--
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query),
-- or via `psql "$DATABASE_URL" -f supabase/schema.sql`.
--
-- Two conventions carried over from the SQLite original, both deliberate:
--
--   Identifiers are left UNQUOTED, so Postgres folds them to lower case
--   ("passwordHash" becomes passwordhash). Every query in server.ts is
--   unquoted too and folds the same way, so they still match. The driver in
--   database.ts maps result columns back to camelCase on the way out, which is
--   why 75 call sites did not have to change.
--
--   Columns that held 0/1 in SQLite stay integer rather than becoming boolean.
--   The application compares them numerically in a lot of places, and a silent
--   true/1 mismatch is far more expensive than an unfashionable column type.
--
-- JSON-bearing columns (specialties, categories, prescriptionJson, itemsJson)
-- stay text: the application JSON.stringify/parse's them itself, and jsonb would
-- hand back parsed objects that the existing code would try to parse again.

begin;

-- ---------------------------------------------------------------------------
-- 1. users — the application profile, one row per Supabase auth account
-- ---------------------------------------------------------------------------
-- Credentials are NOT stored here any more. Supabase Auth owns email, password
-- and email verification in auth.users; this table holds only the clinical
-- profile. The uid is the auth user's id, and the cascade means deleting an
-- account through Supabase Auth cleans up the profile with it.

create table if not exists users (
  uid          uuid primary key references auth.users(id) on delete cascade,
  name         text not null,
  email        text unique not null,
  phone        text,
  role         text not null default 'PATIENT'
               check (role in ('PATIENT', 'DOCTOR', 'HOSPITAL', 'ADMIN')),
  age          integer default 34,
  gender       text default 'Male',
  bloodGroup   text default 'O+',
  policyNo     text,
  createdAt    text,
  updatedAt    text,
  -- Links a DOCTOR account to its row in doctors. Record access is scoped
  -- through this, so a DOCTOR with a null doctorId is linked to no patients
  -- and correctly sees none. The foreign key is added further down, once
  -- doctors exists — this table is created before it.
  doctorId     text
);

-- ---------------------------------------------------------------------------
-- 2. hospitals
-- ---------------------------------------------------------------------------
create table if not exists hospitals (
  id                    text primary key,
  name                  text not null,
  address               text not null,
  totalBeds             integer default 0,
  availableBeds         integer default 0,
  icuBeds               integer default 0,
  icuAvailable          integer default 0,
  emergencyOccupancy    double precision default 0,
  lat                   double precision default 0,
  lng                   double precision default 0,
  phone                 text,
  rating                double precision default 0,
  specialties           text,           -- JSON array
  categories            text,           -- JSON array
  hasAmbulanceSupport   integer default 1,
  ambulanceSupportCount integer default 0,
  isGovernment          integer default 0,
  hasTelemedicine       integer default 1,
  hasOpdBooking         integer default 1,
  email                 text,
  doctorsAvailableCount integer default 0
);

-- ---------------------------------------------------------------------------
-- 3. doctors
-- ---------------------------------------------------------------------------
create table if not exists doctors (
  id              text primary key,
  name            text not null,
  specialty       text not null,
  rating          double precision default 0,
  experience      integer default 0,
  patientsServed  integer default 0,
  online          integer default 0,
  queueCount      integer default 0,
  hospitalName    text,
  waitTimeMin     integer default 0,
  imageUrl        text
);

-- users.doctorId could not carry its foreign key inline, because users is
-- defined above doctors. Added here now that the target exists.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_doctorid_fkey'
  ) then
    alter table users
      add constraint users_doctorid_fkey
      foreign key (doctorId) references doctors(id) on delete set null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 4. appointments
-- ---------------------------------------------------------------------------
create table if not exists appointments (
  id               text primary key,
  patientId        uuid not null references users(uid) on delete cascade,
  patientName      text,
  doctorId         text not null references doctors(id),
  doctorName       text,
  specialty        text,
  date             text not null,
  time             text not null,
  status           text default 'PENDING',
  symptoms         text,
  type             text default 'VIRTUAL',
  prescriptionJson text            -- JSON object
);

-- ---------------------------------------------------------------------------
-- 5. queue_tokens — OPD tokens, e.g. CAR-101
-- ---------------------------------------------------------------------------
create table if not exists queue_tokens (
  id                   text primary key,
  tokenNumber          text not null,
  patientId            uuid references users(uid) on delete cascade,
  patientName          text,
  doctorId             text not null references doctors(id),
  doctorName           text,
  estimatedWaitTimeMin integer default 0,
  status               text default 'WAITING',
  checkpointTime       text
);

-- ---------------------------------------------------------------------------
-- 6. medical_records
-- ---------------------------------------------------------------------------
create table if not exists medical_records (
  id              text primary key,
  patientId       uuid not null references users(uid) on delete cascade,
  date            text not null,
  title           text not null,
  doctorName      text,
  diagnoseSummary text,
  attachmentName  text
);

-- ---------------------------------------------------------------------------
-- 7. medicines
-- ---------------------------------------------------------------------------
create table if not exists medicines (
  id                   text primary key,
  name                 text not null,
  category             text not null,
  price                double precision not null,
  stock                integer default 0,
  description          text,
  requiresPrescription integer default 0,
  dosageForm           text,
  imageUrl             text,
  pillsColor           text,
  pillsShape           text,
  pillsMarkings        text
);

-- ---------------------------------------------------------------------------
-- 8. medicine_orders
-- ---------------------------------------------------------------------------
create table if not exists medicine_orders (
  id                   text primary key,
  patientId            uuid not null references users(uid) on delete cascade,
  patientName          text,
  itemsJson            text not null,  -- JSON array
  totalAmount          double precision not null,
  status               text default 'PENDING',
  prescriptionAttached integer default 0,
  prescriptionName     text,
  deliveryAddress      text,
  createdAt            text
);

-- ---------------------------------------------------------------------------
-- 9. emergency_alerts
-- ---------------------------------------------------------------------------
create table if not exists emergency_alerts (
  id                   text primary key,
  patientId            uuid references users(uid) on delete set null,
  patientName          text,
  patientPhone         text not null,
  lat                  double precision not null,
  lng                  double precision not null,
  address              text,
  type                 text not null,
  status               text default 'REPORTED',
  timestamp            text not null,
  assignedAmbulanceRef text,
  hospitalName         text
);

-- ---------------------------------------------------------------------------
-- 10. chat_messages
-- ---------------------------------------------------------------------------
create table if not exists chat_messages (
  id            text primary key,
  appointmentId text not null references appointments(id) on delete cascade,
  sender        text not null,
  text          text not null,
  timestamp     text not null
);

-- ---------------------------------------------------------------------------
-- Indexes for the ownership-scoped reads the API does on every request
-- ---------------------------------------------------------------------------
create index if not exists idx_appointments_patient   on appointments(patientId);
create index if not exists idx_appointments_doctor    on appointments(doctorId);
create index if not exists idx_records_patient        on medical_records(patientId);
create index if not exists idx_queue_doctor           on queue_tokens(doctorId);
create index if not exists idx_queue_patient          on queue_tokens(patientId);
create index if not exists idx_orders_patient         on medicine_orders(patientId);
create index if not exists idx_chat_appointment       on chat_messages(appointmentId);
create index if not exists idx_users_doctorid         on users(doctorId);

-- ---------------------------------------------------------------------------
-- Profile provisioning
-- ---------------------------------------------------------------------------
-- Supabase Auth creates the account; this trigger creates the matching profile
-- in the same transaction, so there is never an authenticated user without one.
--
-- Role is deliberately NOT read from user metadata. Metadata is client-writable
-- at sign-up, so trusting it would let anyone register themselves as ADMIN —
-- the exact escalation the API refuses today. Every new account starts as
-- PATIENT and is promoted server-side by an existing admin.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (uid, name, email, phone, role, createdAt, updatedAt)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    'PATIENT',
    now()::text,
    now()::text
  )
  on conflict (uid) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- The Express API connects as the database owner and enforces its own RBAC
-- (requireRole plus per-route ownership checks, pinned by 66 tests), so it is
-- unaffected by these policies. RLS is enabled anyway as a second line of
-- defence: Supabase exposes PostgREST on the same database, and without RLS
-- every table would be readable by anyone holding the publicly-shipped anon key.
--
-- Default deny. Add policies deliberately if the browser is ever pointed at
-- PostgREST directly; until then the anon key can reach nothing.

alter table users            enable row level security;
alter table hospitals        enable row level security;
alter table doctors          enable row level security;
alter table appointments     enable row level security;
alter table queue_tokens     enable row level security;
alter table medical_records  enable row level security;
alter table medicines        enable row level security;
alter table medicine_orders  enable row level security;
alter table emergency_alerts enable row level security;
alter table chat_messages    enable row level security;

-- The catalogue endpoints the API serves publicly are safe to expose directly.
drop policy if exists hospitals_public_read on hospitals;
create policy hospitals_public_read on hospitals for select using (true);

drop policy if exists doctors_public_read on doctors;
create policy doctors_public_read on doctors for select using (true);

drop policy if exists medicines_public_read on medicines;
create policy medicines_public_read on medicines for select using (true);

-- A signed-in user may read their own profile through PostgREST.
drop policy if exists users_self_read on users;
create policy users_self_read on users for select using (auth.uid() = uid);

commit;
