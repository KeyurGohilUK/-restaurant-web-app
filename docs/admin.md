# Admin content management

The admin area is deployed at `/restaurant-web-app/admin.html`.

## Supabase setup

1. Create a Supabase project.
2. In Authentication, create one email/password user for the restaurant administrator.
3. Disable public email sign-ups. This project intentionally has no customer accounts.
4. Run `supabase/migrations/20260920_admin_content.sql` in the Supabase SQL editor.
5. Add these build-time variables to the GitHub Pages workflow/environment:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL`
6. Set `VITE_ADMIN_EMAIL` to the administrator email created in step 2.

The password is stored and verified by Supabase Auth. Never put the password in GitHub, source code, a Vite variable, or client-side storage.

## Security model

Anonymous users can only read active public content. Authenticated users can write through RLS policies, so public sign-up must remain disabled and the Supabase project should contain only the intended administrator account. The admin UI additionally checks that the authenticated email matches `VITE_ADMIN_EMAIL`.

## Managed content

The admin area supports menu categories, menu items, opening hours, reviews, restaurant/contact details, homepage copy and image URLs, featured dishes, visibility, ordering, and temporary notices.

The public site continues to use checked-in content if Supabase is not configured or temporarily unavailable, so a backend outage does not remove essential business information.
