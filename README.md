# BotZone

Persian bot and digital-item marketplace with a secure Supabase-backed administration panel.

## Security model

- No administrator password is stored in the repository or browser bundle.
- Supabase Auth handles email/password verification and password hashing.
- PostgreSQL Row Level Security (RLS) blocks product writes unless the authenticated user is present in `admin_users`.
- Public visitors can read only active products.
- The catalog starts empty.

No application is literally “unhackable.” Keep dependencies updated, enable MFA for the Supabase and GitHub owner accounts, and never expose a Supabase `service_role` key.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/202608160001_secure_catalog.sql` in its SQL editor.
3. In **Authentication → Users**, create the administrator with a private email and a new strong password.
4. Copy that user's UUID and run this in the SQL editor:

   ```sql
   insert into public.admin_users (user_id)
   values ('YOUR_AUTH_USER_UUID');
   ```

5. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and add:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`

   Use only the public publishable/anon key. Never add the `service_role` key.

6. Open **Settings → Pages → Source** and choose **GitHub Actions**. Run the `Deploy secure storefront` workflow.

The panel is available at `/BotZone/admin/` after deployment.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

- Storefront: `http://localhost:5173/BotZone/`
- Admin: `http://localhost:5173/BotZone/admin/`

## Validation

```bash
npm run build
npm audit
```
