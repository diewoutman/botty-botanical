## Why

Users currently cannot navigate back from nested pages using an in-app control in the header, which is especially problematic on mobile/PWA contexts where browser navigation affordances are less obvious. Adding a consistent back button improves usability and reduces navigation friction across Study, Detail, Quiz, and Settings flows.

## What Changes

- Add a reusable in-header back button behavior for pages that are not top-level root tabs.
- Define routing-aware visibility rules so the back button appears only when a valid previous route exists or when on known nested routes.
- Ensure back navigation works consistently with Ionic hash-based routing and does not break tab root navigation.
- Provide safe fallback behavior for direct deep links (e.g., route opened directly with no history stack).

## Capabilities

### New Capabilities
- `in-app-header-back-navigation`: Provides a consistent in-app back button in page headers with route-aware behavior and fallback handling.

### Modified Capabilities
- None.

## Impact

- Affected code: header component(s) and page-level header usage (likely `src/components/layout/AppHeader.tsx` and pages using it).
- Routing behavior: interaction with React Router/Ionic navigation stack for back actions.
- UX impact: improved mobile and PWA navigation discoverability.
