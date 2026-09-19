# Feature Roadmap

This file tracks the public-facing restaurant website. The current product is informational only: no online ordering, checkout, payments, delivery management, or customer accounts.

## Phase 1 — Foundation

- [x] Vite + TypeScript application bootstrap
- [x] Mobile-first responsive shell and navigation
- [x] Shared design tokens and reusable presentation patterns
- [x] GitHub Pages-compatible build configuration
- [x] CI for type checking, unit tests, production build, and browser tests
- [x] Automated GitHub Pages deployment from `main`
- [x] Branded static-hosting 404 experience
- [x] Baseline accessibility and keyboard navigation

## Phase 2 — Core visitor experience

### Home
- [x] Hero section with restaurant positioning and primary calls to action
- [x] Short restaurant/food story based on verified public information
- [x] Opening-hours summary
- [x] Location/contact summary
- [x] Review trust signals / external rating summaries
- [x] Catering highlight

### Menu
- [x] Structured, data-driven menu
- [x] Menu categories and category navigation
- [x] Dish name, description and price
- [x] Unverified `Popular` labels removed
- [x] Allergen/dietary guidance linked directly from the menu
- [x] Category filtering for faster browsing
- [x] Easy content maintenance without duplicating markup
- [ ] Dish images only if approved assets are introduced later
- [ ] Item-level vegetarian/vegan/spice/dietary indicators only when verified

### Reviews
- [x] Dedicated reviews section
- [x] Review categories: restaurant experience, catering, events, large orders
- [x] External rating summaries on the main site
- [x] Clear source attribution for externally sourced ratings
- [x] Links to original review platforms where appropriate
- [x] No fabricated or unattributed reviews
- [ ] Verified individual testimonials once approved source text is available

### Catering & Events
- [x] Catering overview/teaser on home page
- [x] Event/use-case types supported
- [x] Flexible catering/menu starting points without unverified package pricing
- [x] Catering planning guidance
- [x] Direct enquiry/contact call to action
- [x] Dietary/allergen confirmation guidance
- [ ] Catering reviews/testimonials once verified source text is available
- [ ] Optional downloadable catering information in a later phase

### About
- [x] Restaurant/food story using verified public information only
- [x] Cuisine and food philosophy
- [x] Values/differentiators expressed through the verified menu proposition
- [ ] Team/founder information when approved source information is available

### Gallery
- Removed from the website by product decision.

### Contact & Location
- [x] Address and directions
- [x] Click-to-call/contact actions
- [x] Opening hours
- [x] Map link with graceful fallback
- [ ] Social links only when verified/approved
- [ ] Venue accessibility information when verified/approved

### Dietary & Allergen Information
- [x] Dedicated dietary/allergen guidance section
- [x] Direct contact action for allergy/dietary questions
- [x] Guidance to reconfirm requirements when choosing food
- [x] No unverified item-level dietary badges
- [x] No allergen-safety guarantees or unsupported claims

## Phase 3 — Discoverability & trust

- [x] Page title and meta description
- [x] Canonical URL for the current GitHub Pages deployment
- [x] Open Graph metadata
- [x] Twitter summary metadata
- [x] Restaurant structured data (JSON-LD)
- [x] Consistent name/address/phone/opening-hours data between page content and structured data
- [x] Sitemap
- [x] robots.txt
- [x] Favicon
- [x] Final keyboard/focus/mobile-overflow accessibility regression coverage
- [x] Performance cleanup of dead featured-dish rendering/data and unsupported popularity badges
- [x] Reduced-motion handling retained
- [ ] App/touch icons if install-like presentation is wanted later
- [ ] Formal external WCAG audit if certification is required

## Privacy / cookies

The current static site does not include analytics, advertising trackers, accounts, forms that submit personal data, or non-essential cookies. A dedicated privacy/cookie consent flow is therefore not part of the current implementation. Reassess this if tracking, forms, accounts, or third-party embeds are introduced.

## Phase 4 — Optional future enhancements

These are not part of the initial release and require explicit approval.

- [ ] PWA/installability
- [ ] Offline access to key information/menu
- [ ] CMS or lightweight content-management workflow
- [ ] Contact/catering enquiry form with backend service
- [ ] Analytics with privacy/consent review
- [ ] Instagram/social content integration
- [ ] Multi-language support
- [ ] Custom domain migration from GitHub Pages (update canonical, sitemap and structured-data URL at the same time)

## Explicitly out of scope

- Online ordering
- Checkout
- Payment processing
- Delivery tracking/management
- Customer accounts
- Loyalty accounts/rewards
- Reservation engine
- Restaurant POS integration
