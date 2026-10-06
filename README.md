# illstickanythingupmyass.com — Within reason.

A non-graphic prototype of an adults-only catalogue request platform: consenting adults choose a fixed catalogue item, accept or decline, self-record a private submission, and receive a demo reward after review. Online only.

Live preview: https://project-paul-5dh.pages.dev

## Demo features

- Video-first home feed, sidebar navigation, search and category filters.
- Watch-style pages with private record placeholders, related requests, likes, saves and local discussion notes.
- Creator channels, following feed, saved videos and viewing history.
- Predefined adult toy requests: Soft One, Studio Two and Full Circle.
- Four-step request builder with a fixed brief, optional notes, reward and review.
- Request details with acceptance, decline, and withdrawal.
- Private proof placeholder with real uploads disabled.
- Simulated moderation, verification, and payout stages.
- Fictional GBP wallet, demo top-ups, and transaction history.
- Browser-local persistence and reset from the boundaries page.

Creators, listings, verification badges, ratings and money are fictional. Public thumbnails are non-graphic CSS catalogue cards. Watch pages show metadata placeholders, never personal recordings. No crypto transfers, actual uploads or shared accounts are processed. Demo catalogue labels are not real safety certifications. See [ASSETS.md](ASSETS.md).

## Run

```sh
npm ci
npm run dev
npm run test
npm run build
```

## Deploy to Cloudflare Pages

```sh
npm run build
npx wrangler pages deploy dist --project-name project-paul --branch main
```

The existing Pages project is a direct-upload project. The included GitHub Actions workflow can deploy pushes from this repository after `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set as repository secrets. Use a token restricted to this account with Pages edit permission. Build output is `dist`.

## Demo data and boundaries

`src/videos.ts` maps marketplace requests to the feed and contains fixed request templates. Feed cards follow the same request state and demo balance as the request board. `src/data.ts` contains the illustrative catalogue, creators and marketplace state. The builder validates the template, matching catalogue/category, permitted notes and available fictional credits. Client-side keyword filtering is only a demo and cannot enforce a production policy.

Marketplace changes persist under `paul-demo-v2`; video interactions persist under `paul-video-library-v1`. Comments are local to the current browser, never published. Cloudflare serves static assets; Google Fonts supplies typography. The boundaries page resets marketplace progress. There is no server authentication, age verification, payment escrow or protected upload service.

## Before production

See [LAUNCH.md](LAUNCH.md) for a sourced UK business/international launch checklist. A third-party crypto provider does not replace content, privacy, consumer or country-specific review. The current demo is not a production launch or a legal certification.
