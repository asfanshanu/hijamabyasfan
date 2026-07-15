-- Supabase Init Database Schema for Hijama by Shanu

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Create table: admin_profiles
create table public.admin_profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create table: services
create table public.services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  cta_label text not null,
  display_order integer default 0 not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create table: availability_slots
create table public.availability_slots (
  id uuid default gen_random_uuid() primary key,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status text default 'available'::text not null check (status in ('available', 'reserved', 'booked', 'unavailable')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint start_time_before_end_time check (start_time < end_time),
  constraint unique_slot_time unique (appointment_date, start_time)
);

-- 4. Create table: appointments
create table public.appointments (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  phone_number text not null,
  age integer check (age >= 12 and age <= 100),
  appointment_slot_id uuid references public.availability_slots(id) on delete restrict,
  session_note text,
  status text default 'pending'::text not null check (status in ('pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'declined')),
  admin_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_appointment_slot unique (appointment_slot_id)
);

-- 5. Create table: faqs
create table public.faqs (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  answer text not null,
  display_order integer default 0 not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create table: certifications
create table public.certifications (
  id uuid default gen_random_uuid() primary key,
  certificate_name text not null,
  issuing_organisation text not null,
  certification_year integer not null,
  certificate_image_url text not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Create table: site_settings
create table public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --- Enable Row Level Security (RLS) ---
alter table public.admin_profiles enable row level security;
alter table public.services enable row level security;
alter table public.availability_slots enable row level security;
alter table public.appointments enable row level security;
alter table public.faqs enable row level security;
alter table public.certifications enable row level security;
alter table public.site_settings enable row level security;

-- --- Row Level Security Policies ---

-- admin_profiles Policies
create policy "Allow read access to authenticated profile owner"
  on public.admin_profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Allow edit access to profile owner"
  on public.admin_profiles for update
  to authenticated
  using (auth.uid() = id);

-- services Policies (Public read, admin write)
create policy "Public can read active services"
  on public.services for select
  to public
  using (is_active = true);

create policy "Admin has full access to services"
  on public.services for all
  to authenticated
  using (true);

-- faqs Policies (Public read, admin write)
create policy "Public can read active faqs"
  on public.faqs for select
  to public
  using (is_active = true);

create policy "Admin has full access to faqs"
  on public.faqs for all
  to authenticated
  using (true);

-- certifications Policies (Public read, admin write)
create policy "Public can read active certifications"
  on public.certifications for select
  to public
  using (is_active = true);

create policy "Admin has full access to certifications"
  on public.certifications for all
  to authenticated
  using (true);

-- site_settings Policies (Public read, admin write)
create policy "Public can read site settings"
  on public.site_settings for select
  to public
  using (true);

create policy "Admin has full access to site settings"
  on public.site_settings for all
  to authenticated
  using (true);

-- availability_slots Policies
create policy "Public can read available slots"
  on public.availability_slots for select
  to public
  using (status = 'available');

create policy "Admin has full access to availability slots"
  on public.availability_slots for all
  to authenticated
  using (true);

-- appointments Policies
create policy "Public can create appointment requests"
  on public.appointments for insert
  to public
  with check (true);

create policy "Admin has full access to appointments"
  on public.appointments for all
  to authenticated
  using (true);

-- --- Auto-update updated_at Trigger Functions ---
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers to tables
create trigger set_admin_profiles_updated_at before update on public.admin_profiles for each row execute procedure public.handle_updated_at();
create trigger set_services_updated_at before update on public.services for each row execute procedure public.handle_updated_at();
create trigger set_availability_slots_updated_at before update on public.availability_slots for each row execute procedure public.handle_updated_at();
create trigger set_appointments_updated_at before update on public.appointments for each row execute procedure public.handle_updated_at();
create trigger set_faqs_updated_at before update on public.faqs for each row execute procedure public.handle_updated_at();
create trigger set_certifications_updated_at before update on public.certifications for each row execute procedure public.handle_updated_at();
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute procedure public.handle_updated_at();

-- --- Helper function/trigger: Auto-booked slot status on confirmed appointment ---
create or replace function public.sync_slot_status_on_appointment_confirm()
returns trigger as $$
begin
  if new.status = 'confirmed' then
    update public.availability_slots
    set status = 'booked'
    where id = new.appointment_slot_id;
  elsif new.status in ('declined', 'cancelled') then
    -- When cancelled or declined, release the slot status back to available
    update public.availability_slots
    set status = 'available'
    where id = old.appointment_slot_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger on_appointment_status_update
  after update of status on public.appointments
  for each row
  execute procedure public.sync_slot_status_on_appointment_confirm();
