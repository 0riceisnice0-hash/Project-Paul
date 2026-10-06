# anything. — illstickanythingupmyass.com

A non-explicit video-platform demo with predefined creator requests. Within reason.

Live preview: https://project-paul-5dh.pages.dev

## Demo features

- Video-first home feed, sidebar navigation, search and category filters.
- Watch pages with working sample playback, recommendations, likes, saves and local comments.
- Creator channels, following feed, saved videos and viewing history.
- Predefined catalogue overview, creator Q&A and behind-the-scenes video requests.
- Four-step request builder with a fixed brief, optional notes, reward and review.
- Request details with acceptance, decline, and withdrawal.
- Private proof placeholder with real uploads disabled.
- Simulated moderation, verification, and payout stages.
- Fictional GBP wallet, demo top-ups, and transaction history.
- Browser-local persistence and reset from the boundaries page.

Creators, listings, view counts, displayed durations, verification badges, ratings and money are fictional. All watch pages play the same short CC0 flower sample; it is not the video described by the fictional title. Stock thumbnails and media licences are documented in [ASSETS.md](ASSETS.md). No crypto transfers, actual user uploads or shared accounts are processed. Demo catalogue labels are not real safety certifications.

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

`src/videos.ts` contains fictional videos and fixed request templates. `src/data.ts` contains the illustrative catalogue, creators and marketplace state. The builder validates the template, matching catalogue/category, permitted notes and available fictional credits. Client-side keyword filtering is only a demo and cannot enforce a production policy.

Marketplace changes persist under `paul-demo-v2`; video interactions persist under `paul-video-library-v1`. Comments are local to the current browser, never published. Cloudflare serves static assets; Google Fonts supplies typography. The boundaries page resets marketplace progress. There is no server authentication, age verification, payment escrow or protected upload service.

## Before production

See [LAUNCH.md](LAUNCH.md) for a sourced UK business/international launch checklist. A third-party crypto provider does not replace content, privacy, consumer or country-specific review. The current demo is not a production launch or a legal certification.
