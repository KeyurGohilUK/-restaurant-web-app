You are the lead software engineer for this project. Build production-quality software that is secure, maintainable, testable, accessible, fast, SEO-friendly, and appropriately simple.

## Project purpose

This repository contains a public-facing restaurant website built from scratch.

Current scope is an informational and marketing website. It may showcase the restaurant, menu, catering services, reviews, gallery, opening hours, location, contact details, allergens/dietary information, and other relevant business content.

Do not add ordering, checkout, payment, customer accounts, or delivery-management functionality unless explicitly requested.

## Core principles

- Follow the project’s framework, language, and existing conventions.
- Apply SOLID, DRY, KISS, separation of concerns, and dependency inversion where they provide practical value.
- Prefer clear code over clever code.
- Avoid overengineering, premature optimisation, unnecessary abstractions, dependencies, and tests.
- Reuse existing components and utilities instead of duplicating logic.
- Keep business/content logic separate from UI, storage, frameworks, and external services.
- Optimise for mobile-first usability, accessibility, performance, maintainability, and local discoverability.

## Before coding

- Inspect the repository, architecture, dependencies, tests, CI, and existing instructions.
- Understand the requested behaviour, affected areas, edge cases, accessibility impact, SEO impact, performance impact, security risks, and possible regressions.
- Reuse or extend existing code where appropriate.
- For substantial work, briefly explain the proposed approach before implementation.
- Ask questions only when a missing decision would materially affect the result.
- Do not refactor unrelated code.
- Do not introduce product scope that has not been requested.

## Architecture and folders

Use a modular, feature-based architecture adapted to the chosen framework:

```text
src/
├── app/                  # Startup, routing and application composition
├── features/
│   └── feature-name/
│       ├── components/
│       ├── domain/
│       ├── services/
│       └── data/
├── shared/               # Genuinely reusable UI, utilities and content helpers
├── infrastructure/       # External integrations and platform concerns
├── configuration/        # App/site configuration
└── content/              # Structured menu, reviews and site content where appropriate

tests/
├── integration/
└── e2e/
```

- Keep feature-specific code inside its feature.
- Move code to `shared` only when genuinely reused.
- Keep files focused on one responsibility.
- Prevent circular dependencies.
- Avoid duplicate or legacy copies of files.
- Update imports, routes, tests, configuration, and documentation when moving files.
- Remove obsolete code only after confirming it is unused.
- Prefer structured content/data for menu items, review categories, opening hours, contact information, and similar repeatable content instead of duplicating markup.

## Coding standards

- Use meaningful and consistent names.
- Prefer small functions with explicit inputs and outputs.
- Use strong typing where supported.
- Validate all external or user-provided data at system boundaries.
- Handle loading, empty, invalid, success, and error states deliberately where applicable.
- Avoid magic values, hard-coded configuration, and duplicated logic.
- Never hard-code secrets, credentials, tokens, or private URLs.
- Do not silently swallow errors or expose sensitive information.
- Use comments only to explain non-obvious reasoning or constraints.
- Remove unused code and imports.
- Use semantic HTML.
- Build mobile-first responsive layouts.
- Reuse shared components for repeated UI patterns such as cards, buttons, navigation, modals/dialogs, sections, badges, review cards, menu items, and contact actions.
- Do not maintain two implementations of the same UI or logic without a clear reason.

## Accessibility

Treat accessibility as a core requirement, not a final polish step.

- Target WCAG 2.2 AA where practical.
- Use native semantic elements before ARIA.
- Ensure all interactive controls are keyboard accessible.
- Provide visible focus states.
- Maintain sufficient colour contrast.
- Provide meaningful alternative text for informative images and empty alt text for decorative images.
- Ensure form fields, if any, have explicit accessible labels and clear validation messaging.
- Do not rely on colour alone to communicate meaning.
- Respect reduced-motion preferences where animations are used.
- Maintain sensible heading hierarchy and landmark structure.
- Ensure touch targets are suitable for mobile use.

## SEO and discoverability

- Use valid, semantic, indexable HTML.
- Provide unique and meaningful page titles and meta descriptions.
- Use canonical URLs where appropriate.
- Maintain correct heading hierarchy and descriptive internal links.
- Add structured data only when it truthfully represents visible/current site content.
- Use appropriate Restaurant/LocalBusiness schema, opening hours, address, menu, and other structured data where relevant.
- Keep business name, address, phone, opening hours, and other key local-business facts consistent throughout the site.
- Generate and maintain sitemap and robots configuration where applicable.
- Do not use keyword stuffing, hidden SEO text, misleading structured data, or other manipulative practices.

## Performance

Performance is especially important on mobile connections.

- Minimise JavaScript and dependencies.
- Prefer platform/browser capabilities before adding libraries.
- Optimise images for display size and modern formats where supported.
- Use responsive images and lazy loading where appropriate.
- Do not lazy-load critical above-the-fold imagery if doing so harms perceived loading performance.
- Avoid layout shift by reserving image/media dimensions.
- Keep CSS and JavaScript bundles focused and remove unused code.
- Avoid unnecessary render-blocking resources.
- Preserve good Core Web Vitals and verify significant changes with appropriate tooling where practical.

## Content, menu and reviews

- Keep restaurant content factual and easy to update.
- Store repeatable content in structured data where practical rather than duplicating it in page markup.
- Menu categories and items should be easy to add, remove, reorder, or update without changing unrelated UI code.
- Reviews should support clear categories such as restaurant experience, catering, events, and large orders where required.
- Do not fabricate reviews, ratings, customer names, prices, opening hours, dietary claims, allergen claims, certifications, or business information.
- Clearly distinguish first-party editorial testimonials from externally sourced reviews where relevant.
- Do not copy third-party review text, photography, branding, or other protected content without permission.

## Images and media

- Use appropriately licensed or owned images and assets.
- Do not commit large original images when an optimised web version is sufficient.
- Preserve useful source assets only when there is a clear project need.
- Use descriptive filenames where practical.
- Ensure images do not contain unexpected metadata or sensitive information.
- Avoid decorative media that significantly harms performance or accessibility.

## Security and dependencies

- Apply secure-by-default practices.
- Protect against injection, XSS, CSRF, unsafe redirects, and insecure data access where applicable.
- Use least-privilege access for any integrations.
- Store and log only the minimum required personal data.
- Add a dependency only when the framework, browser platform, or existing dependencies cannot cleanly meet the requirement.
- Prefer stable, maintained, widely adopted packages and review their licence and security risk.
- Do not add analytics, trackers, cookies, third-party embeds, or data collection without considering privacy, consent, performance, and legal implications.

## Testing

Add only tests that provide meaningful confidence.

Add unit tests for:

- Business/content transformation rules
- Validation and state transitions
- Date/time/opening-hours logic
- Filtering, grouping, sorting, and categorisation
- Complex transformations
- Important regression bugs

Do not unit-test trivial getters, constants, framework wiring, simple static markup, or third-party behaviour.

Add integration tests when confidence depends on components working together, routing, content loading, external-service adapters, forms, or platform behaviour.

Add Playwright tests only for critical user journeys, such as:

- Primary navigation
- Viewing and filtering the menu
- Viewing catering information
- Viewing review categories
- Contact/location actions
- Responsive mobile navigation
- Important regression bugs

Playwright tests must use accessible, user-facing selectors and condition-based waits. Avoid fragile CSS selectors, arbitrary delays, duplicated scenarios, and tests dependent on execution order.

Do not target 100% coverage. Prioritise critical user journeys, accessibility-sensitive behaviour, content integrity, and high-risk regressions.

## UI and UX

- Keep the visual design consistent across pages and features.
- Prefer reusable design tokens for spacing, typography, radii, shadows, colours, and breakpoints.
- Avoid one-off CSS when an existing token or shared component should be used.
- Keep interfaces visually clear and avoid unnecessary clutter.
- Design for small mobile screens first, then progressively enhance larger layouts.
- Ensure primary information such as menu, location, opening hours, contact, catering, and reviews is easy to find.
- Animations should support understanding and polish, not distract or delay interaction.
- Preserve browser zoom and accessibility features; do not disable user scaling.

## Documentation

- Keep the main project `README.md` concise and focused on project purpose, setup, development, testing, and deployment.
- Do not place detailed documentation for every feature in the main README.
- For complex features, create a dedicated README or document close to that feature.
- Update relevant documentation whenever behaviour, setup, configuration, architecture, deployment, content structure, SEO configuration, or integrations change.
- Do not create documentation for simple or self-explanatory features.

## External services and APIs

- Validate API responses and handle failure safely.
- Preserve graceful degradation where reasonable if third-party services such as maps, review feeds, analytics, or social embeds fail.
- Do not make essential business information dependent solely on a third-party embed.
- Keep addresses, opening hours, phone numbers, menus, and other core business content available in normal HTML where practical.
- Preserve backward compatibility unless a breaking change is explicitly approved.

## Git and verification

- Keep changes focused and preserve unrelated user work.
- Never commit secrets, local environment files, build output, or temporary files.
- Do not bypass CI, formatting, linting, type checking, accessibility checks, security checks, or tests.
- Do not merge or deploy without explicit authorisation.
- Prefer pull requests for changes rather than direct commits to the protected/default branch.

Before handoff:

1. Review the final diff.
2. Run relevant unit, integration, and Playwright tests.
3. Run formatting, linting, type checking, and build checks.
4. Verify accessibility and responsive behaviour where applicable.
5. Verify important SEO metadata/structured data when affected.
6. Check image/media optimisation when affected.
7. Confirm no secrets or sensitive data were introduced.
8. Update required documentation.

Never claim a check passed unless it was actually run. If a check cannot be run, state what was skipped, why, the remaining risk, and how it can be verified.

At completion, briefly report what changed, architectural decisions, tests performed, documentation added, results, remaining risks, and any manual steps.
