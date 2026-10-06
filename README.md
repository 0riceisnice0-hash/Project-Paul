# illstickanythingupmyass.com — Within reason.

A non-explicit interactive product demo for an adults-only, catalogue-only request marketplace.

Live preview: https://project-paul-5dh.pages.dev

## Demo features

- Homepage with the full domain branding, fictional request feed, and visible boundaries.
- Browse and filter by catalogue category and request status.
- Four-step request builder: fixed product, permitted category, notes, reward, review.
- Fictional creator profiles and ratings.
- Request details with acceptance, decline, and withdrawal.
- Private proof placeholder with real uploads disabled.
- Simulated moderation, verification, and payout stages.
- Fictional GBP wallet, demo top-ups, and transaction history.
- Browser-local persistence and reset from the boundaries page.

Every product, profile, verification badge, rating, balance, request, submission, and payout is simulated. Demo catalogue labels are not real safety certifications. No crypto transfers, explicit media, or file uploads are processed.

## Run

```sh
npm ci
npm run dev
npm run build
```

## Deploy to Cloudflare Pages

```sh
npm run build
npx wrangler pages deploy dist --project-name project-paul --branch main
```

The existing Pages project is a direct-upload project. The included GitHub Actions workflow can deploy pushes from this repository after `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set as repository secrets. Use a token restricted to this account with Pages edit permission. Build output is `dist`.

## Demo data and boundaries

The catalogue and seed data are in `src/data.ts`. The builder accepts only known catalogue IDs and their fixed category, rejects listed prohibited words in optional notes, and reserves fictional credits. This client-side check is a demonstration, not a production content moderation service.

Demo changes stay in local storage under `paul-demo-v2`. No personal files are sent to a server. Cloudflare serves the static app, and Google Fonts supplies typography. Reset restores the fictional data and balance.

## Before production

Production needs server-enforced account and age verification, a real vetted catalogue, consent and dispute policies, access-controlled evidence storage, moderation roles and audit records, and a reviewed payment provider or escrow integration. The current demo is intentionally disconnected from those services.
