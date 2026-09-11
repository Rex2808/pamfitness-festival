-- =========================================================
-- PAMFITNESS FESTIVAL PLATFORM
-- Supabase Database Schema
-- =========================================================

-- =========================================================
-- FESTIVALS
-- =========================================================

create table public.festivals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  year bigint not null,
  theme text,
  event_date date not null,
  start_time time not null,
  venue text not null,
  address text,
  city text,
  entry_type text not null default 'FREE',
  vendor_price numeric not null default 0,
  vest_price numeric not null default 0,
  whatsapp text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  hero_image_url text,
  facebook_url text,
  instagram_url text,
  tiktok_url text
);

-- =========================================================
-- ACTIVITIES
-- =========================================================

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  display_order bigint not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- GALLERY
-- =========================================================

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  image_url text not null,
  caption text,
  display_order bigint not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- FAQS
-- =========================================================

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  question text not null,
  answer text not null,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- ATTENDEES
-- =========================================================

create table public.attendees (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text,
  age_range text,
  gender text,
  interests text[],
  source text,
  registered_at timestamptz not null default now(),
  attended boolean not null default false,
  attended_at timestamptz,
  created_at timestamptz not null default now()
);

-- =========================================================
-- VEST ORDERS
-- =========================================================

create table public.vest_orders (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric not null default 10000 check (unit_price >= 0),
  total_amount numeric not null default 10000 check (total_amount >= 0),
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

-- =========================================================
-- VENDORS
-- =========================================================

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  business_name text not null,
  contact_name text not null,
  phone text not null,
  email text,
  category text,
  description text,
  website_or_social text,
  number_of_stands integer not null default 1 check (number_of_stands > 0),
  unit_price numeric not null default 30000 check (unit_price >= 0),
  total_amount numeric not null default 30000 check (total_amount >= 0),
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.festivals enable row level security;
alter table public.activities enable row level security;
alter table public.gallery enable row level security;
alter table public.faqs enable row level security;
alter table public.attendees enable row level security;
alter table public.vest_orders enable row level security;
alter table public.vendors enable row level security;


-- =========================================================
-- PUBLIC READ POLICIES
-- =========================================================

create policy "Public can view active festivals"
on public.festivals
for select
to anon, authenticated
using (is_active = true);


create policy "Public can view visible activities"
on public.activities
for select
to anon, authenticated
using (is_visible = true);


create policy "Public can view visible gallery"
on public.gallery
for select
to anon, authenticated
using (is_visible = true);


create policy "Public can view visible FAQs"
on public.faqs
for select
to anon, authenticated
using (is_visible = true);


-- =========================================================
-- PUBLIC INSERT POLICIES
-- =========================================================

create policy "Public can register for active festivals"
on public.attendees
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.festivals
    where festivals.id = attendees.festival_id
      and festivals.is_active = true
  )
);


create policy "Public can create vest orders for active festivals"
on public.vest_orders
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.festivals
    where festivals.id = vest_orders.festival_id
      and festivals.is_active = true
  )
);


create policy "Public can submit vendor applications for active festivals"
on public.vendors
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.festivals
    where festivals.id = vendors.festival_id
      and festivals.is_active = true
  )
);

-- =========================================================
-- VEST ORDER PRICE PROTECTION
-- =========================================================

create or replace function public.set_vest_order_price()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select vest_price
  into new.unit_price
  from public.festivals
  where id = new.festival_id
    and is_active = true;

  if new.unit_price is null then
    raise exception 'Invalid or inactive festival';
  end if;

  new.total_amount := new.quantity * new.unit_price;

  return new;
end;
$$;


create trigger set_vest_order_price
before insert on public.vest_orders
for each row
execute function public.set_vest_order_price();


-- =========================================================
-- VEST ORDER STATUS PROTECTION
-- =========================================================

create or replace function public.set_vest_order_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.status := 'PENDING';

  return new;
end;
$$;


create trigger set_vest_order_defaults
before insert on public.vest_orders
for each row
execute function public.set_vest_order_defaults();

-- =========================================================
-- VENDOR PRICE & STATUS PROTECTION
-- =========================================================

create or replace function public.set_vendor_order_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select vendor_price
  into new.unit_price
  from public.festivals
  where id = new.festival_id
    and is_active = true;

  if new.unit_price is null then
    raise exception 'Invalid or inactive festival';
  end if;

  new.total_amount := new.number_of_stands * new.unit_price;
  new.status := 'PENDING';

  return new;
end;
$$;


create trigger set_vendor_order_defaults
before insert on public.vendors
for each row
execute function public.set_vendor_order_defaults();

-- =========================================================
-- ADMIN USERS & FESTIVAL AUTHORIZATION
-- =========================================================

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'FESTIVAL_ADMIN'
    check (
      role in (
        'PLATFORM_ADMIN',
        'FESTIVAL_ADMIN',
        'STAFF'
      )
    ),
  festival_id uuid references public.festivals(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;


-- =========================================================
-- ADMIN USER ACCESS
-- =========================================================

create policy "Admins can view their own admin profile"
on public.admin_users
for select
to authenticated
using (
  user_id = auth.uid()
);


-- =========================================================
-- ADMIN AUTHORIZATION HELPERS
-- =========================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;


create or replace function public.is_platform_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and role = 'PLATFORM_ADMIN'
  );
$$;


create or replace function public.is_festival_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and role = 'FESTIVAL_ADMIN'
      and festival_id is not null
  );
$$;


create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and role = 'STAFF'
      and festival_id is not null
  );
$$;


create or replace function public.can_manage_festival(
  target_festival_id uuid
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and (
        role = 'PLATFORM_ADMIN'
        or (
          role in ('FESTIVAL_ADMIN', 'STAFF')
          and festival_id = target_festival_id
        )
      )
  );
$$;