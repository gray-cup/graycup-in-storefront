-- Better Auth + buyer addresses, migrated off Neon Postgres into the shared
-- "graycup-orders" Cloudflare D1 database. storefront_ prefix namespaces them.
-- Apply: wrangler d1 execute graycup-orders --remote --file=drizzle/d1_0001_auth_to_d1.sql

CREATE TABLE IF NOT EXISTS storefront_user (
  id text PRIMARY KEY NOT NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  email_verified integer NOT NULL DEFAULT 0,
  image text,
  created_at integer NOT NULL,
  updated_at integer NOT NULL,
  first_name text NOT NULL DEFAULT '',
  last_name text,
  phone text NOT NULL DEFAULT '',
  role text DEFAULT 'user',
  banned integer DEFAULT 0,
  ban_reason text,
  ban_expires integer
);

CREATE TABLE IF NOT EXISTS storefront_session (
  id text PRIMARY KEY NOT NULL,
  expires_at integer NOT NULL,
  token text NOT NULL UNIQUE,
  created_at integer NOT NULL,
  updated_at integer NOT NULL,
  ip_address text,
  user_agent text,
  user_id text NOT NULL REFERENCES storefront_user(id) ON DELETE CASCADE,
  impersonated_by text
);

CREATE TABLE IF NOT EXISTS storefront_account (
  id text PRIMARY KEY NOT NULL,
  account_id text NOT NULL,
  provider_id text NOT NULL,
  user_id text NOT NULL REFERENCES storefront_user(id) ON DELETE CASCADE,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at integer,
  refresh_token_expires_at integer,
  scope text,
  password text,
  created_at integer NOT NULL,
  updated_at integer NOT NULL
);

CREATE TABLE IF NOT EXISTS storefront_verification (
  id text PRIMARY KEY NOT NULL,
  identifier text NOT NULL,
  value text NOT NULL,
  expires_at integer NOT NULL,
  created_at integer,
  updated_at integer
);

CREATE TABLE IF NOT EXISTS storefront_address (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL REFERENCES storefront_user(id) ON DELETE CASCADE,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  is_default integer NOT NULL DEFAULT 0,
  created_at text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS storefront_session_user_id_idx ON storefront_session(user_id);
CREATE INDEX IF NOT EXISTS storefront_account_user_id_idx ON storefront_account(user_id);
CREATE INDEX IF NOT EXISTS storefront_verification_identifier_idx ON storefront_verification(identifier);
CREATE INDEX IF NOT EXISTS storefront_address_user_id_idx ON storefront_address(user_id);

-- Promote the owner to admin (better-auth admin plugin).
UPDATE storefront_user SET role = 'admin' WHERE email = 'graycup.enterprises@gmail.com';
