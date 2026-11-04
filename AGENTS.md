<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- CRM tables are guarded by RLS `is_dtm_owner()` (admin role + authorized email); the `_authenticated` route gate is UX only — why: security must hold at the database.
- Public visitors only write leads through SECURITY DEFINER RPCs (`receive_contact_lead`) with rate limiting; never grant anon table access — why: visitors must not read client data.
- Business rules (prices, stages, 15-day alert, authorized email) live in `src/lib/crm.ts` with tests in `src/test/crm-rules.test.ts`.
