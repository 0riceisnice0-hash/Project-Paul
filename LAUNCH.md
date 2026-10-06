# Launch readiness: UK business, international users

Prepared 6 October 2026. This is a scoping checklist for the business and its UK solicitor, not a finding that the proposed service is lawful. The published version is a non-explicit static simulation with no real accounts, uploads, payments or payouts.

## 1. Decide exactly what the service permits

Define permitted videos and requests, who sees proof, and whether any pornography will be published or shared. Catalogue approval must come from a documented review of real products and permitted activities; fictional badges and a keyword list provide no safety certification. Separate consent to participate, record, review and publish. Establish creator withdrawal, evidence access, dispute, refund, reporting, takedown and appeal procedures. Review illegal-content duties and service classification under the [Online Safety Act](https://www.legislation.gov.uk/ukpga/2023/50).

## 2. Replace the demo age checkbox before adult media goes live

Ofcom distinguishes user-to-user services from provider-published pornography. Its guidance requires highly effective age assurance for provider pornography, before access to that content; user-to-user services need the applicable access/risk assessments and protections. Self-declared age is not a highly effective method. Obtain an assessment of the proposed service and integrate a suitable age-assurance system, with creator identity/age checks and server enforcement on media routes. The current self-attestation is only a demo notice. [Ofcom age assurance guidance](https://www.ofcom.org.uk/online-safety/protecting-children/age-assurance).

## 3. Protect identity and private evidence

Sex-life information can be special category personal data. Processing requires both an Article 6 lawful basis and a relevant Article 9 condition; high-risk processing requires a DPIA. Review international transfers and processor contracts, as well as the privacy notice, retention periods and data rights. Use minimal verification results, restricted evidence access, private object storage, short-lived signed media URLs, audit logs and deletion procedures. Do not collect IDs or intimate evidence through this prototype. [ICO special category requirements](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-are-the-rules-on-special-category-data/).

## 4. Contract with a provider for this exact payment model

Obtain written confirmation that the provider accepts the business's actual content and marketplace model, supported countries, currencies/tokens, creator payouts and any delayed release of funds. Agree responsibility for customer checks, sanctions screening, fraud, refunds, disputes, transaction finality, fees and insolvency. Have counsel assess the platform's role in custody, exchange, arranging transactions and any qualifying crypto promotions. Accepting a crypto payment should not simply be assumed to have the same regulatory treatment as running an exchange. The FCA describes distinct registration, financial-promotion and future-regime requirements; a provider's status is not blanket clearance for its customer platform. [FCA cryptoasset information](https://www.fca.org.uk/firms/cryptoassets).

Implementation should use provider-hosted onboarding/payment flows and authenticated webhooks. Verify signatures, reject replays, enforce idempotency and keep a server ledger. Release payout only after documented approval or dispute resolution. Never store private wallet keys in browser code. The demo's local balances must not be reused as a payment ledger.

## 5. Start with a reviewed country list

Worldwide access is not one permission. Review each intended market and enable only approved countries, with provider coverage and restrictions. EU services may face [Digital Services Act obligations](https://digital-strategy.ec.europa.eu/en/factpages/tackling-illegal-content-online-digital-services-act). If sexually explicit productions reach relevant US scope, assess applicable performer-record and labelling rules with counsel; the [US DOJ explains sections 2257/2257A](https://www.justice.gov/criminal-ceos/18-usc-2257-2257a-certifications). Also review consumer terms, tax/VAT, business registration, insurance and hosting/media-provider terms for the final model.

## Practical release gates

- A reviewed content/country policy and legally reviewed terms.
- Contracted age, identity and payment providers that support the exact model.
- Server accounts, role-based moderation, private evidence storage and consent records.
- Working reports, takedowns, appeals, refunds and operational support.
- Security/privacy review and an audited payment/submission lifecycle.

Until these gates are met, keep the current non-explicit, no-money demo mode.
