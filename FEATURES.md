# Feature Roadmap

This file tracks the planned public-facing restaurant website. The current product is informational only: no online ordering, checkout, payments, delivery management, or customer accounts.

## Phase 1 — Foundation

- [ ] Vite + TypeScript application bootstrap
- [ ] Mobile-first responsive shell and navigation
- [ ] Shared design tokens and reusable components
- [ ] GitHub Pages-compatible build configuration
- [ ] CI for type checking, unit tests, production build, and browser tests
- [ ] Automated GitHub Pages deployment from `main`
- [ ] Error/404 experience suitable for static hosting
- [ ] Baseline accessibility and keyboard navigation

## Phase 2 — Core visitor experience

### Home
- [ ] Hero section with restaurant positioning and primary calls to action
- [ ] Signature dishes / highlights
- [ ] Short restaurant story
- [ ] Opening-hours summary
- [ ] Location/contact summary
- [ ] Featured reviews
- [ ] Catering highlight

### Menu
- [ ] Structured, data-driven menu
- [ ] Menu categories and category navigation
- [ ] Dish name, description, price, image where available
- [ ] Vegetarian/vegan/spice/dietary indicators where verified
- [ ] Allergen-information notice and link
- [ ] Search/filtering only if it improves usability
- [ ] Easy content maintenance without duplicating markup

### Reviews
- [ ] Dedicated reviews page/section
- [ ] Review categories: restaurant experience, catering, events, large orders
- [ ] Featured testimonials on home page
- [ ] Clear source attribution for externally sourced reviews
- [ ] Links to original review platforms where appropriate
- [ ] No fabricated or unattributed reviews

### Catering & Events
- [ ] Catering overview
- [ ] Event types supported
- [ ] Sample catering/menu options where approved
- [ ] Enquiry/contact call to action
- [ ] Catering reviews/testimonials
- [ ] Optional downloadable catering information in a later phase

### About
- [ ] Restaurant/business story
- [ ] Cuisine and food philosophy
- [ ] Team/founder information where approved
- [ ] Values and differentiators

### Gallery
- [ ] Responsive image gallery
- [ ] Food, venue, catering and event categories
- [ ] Optimised responsive images
- [ ] Accessible alt text
- [ ] Optional lightbox only if it remains accessible and lightweight

### Contact & Location
- [ ] Address and directions
- [ ] Click-to-call/contact actions
- [ ] Opening hours
- [ ] Map link/embed with graceful fallback
- [ ] Social links
- [ ] Accessibility information where available

### Dietary & Allergen Information
- [ ] Clear allergen disclaimer
- [ ] Verified dietary labels only
- [ ] Contact guidance for allergen questions
- [ ] Avoid unverified safety claims

## Phase 3 — Discoverability & trust

- [ ] Per-page titles and meta descriptions
- [ ] Canonical URLs
- [ ] Open Graph/social sharing metadata
- [ ] Restaurant/LocalBusiness structured data
- [ ] Consistent name/address/phone/opening-hours data
- [ ] Sitemap
- [ ] robots.txt
- [ ] Favicon/app icons
- [ ] Privacy policy where required
- [ ] Cookie/consent handling only if tracking or non-essential cookies are introduced
- [ ] Performance/Core Web Vitals review
- [ ] Accessibility review targeting WCAG 2.2 AA

## Phase 4 — Optional future enhancements

These are not part of the initial release and require explicit approval.

- [ ] PWA/installability
- [ ] Offline access to key information/menu
- [ ] CMS or lightweight content-management workflow
- [ ] Contact/catering enquiry form with backend service
- [ ] Analytics with privacy/consent review
- [ ] Instagram/social content integration
- [ ] Multi-language support
- [ ] Custom domain migration from GitHub Pages

## Explicitly out of scope for now

- Online ordering
- Checkout
- Payment processing
- Delivery tracking/management
- Customer accounts
- Loyalty accounts/rewards
- Reservation engine
- Restaurant POS integration
