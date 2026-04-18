## Context

The app uses a shared `AppHeader` component across pages, but it currently only shows title/actions and does not provide an in-app back affordance. Since this is a mobile-first Ionic PWA, relying on browser back behavior is not always intuitive. We need a consistent header back button that works with Ionic + React Router hash navigation and does not appear on top-level tab roots.

## Goals / Non-Goals

**Goals:**
- Add a reusable header back button pattern for non-root routes.
- Ensure the back action uses router history and falls back safely when no previous entry exists.
- Keep top-level tab routes (study/quiz/settings) clean without a back button.
- Avoid per-page duplicated back button logic.

**Non-Goals:**
- Redesigning the full app header layout.
- Changing tab bar behavior or introducing nested stacks.
- Implementing breadcrumb-style multi-level navigation.

## Decisions

1. Add optional back-button props to `AppHeader`
- Decision: Extend `AppHeader` with a `showBackButton` toggle and optional `fallbackRoute`.
- Rationale: Keeps behavior centralized and avoids repetitive page-level header markup.
- Alternatives considered:
  - Add individual back buttons in each page: rejected due to duplication.
  - Always show back button globally: rejected because root tabs should not show it.

2. Use React Router history for back navigation
- Decision: On click, call `history.goBack()` when history depth allows; otherwise navigate to configured fallback route.
- Rationale: Preserves expected user flow when coming from internal navigation while keeping deep-link safety.
- Alternatives considered:
  - Always push a fixed route: rejected because it ignores navigation context.

3. Route-aware visibility managed at page level
- Decision: Pages decide whether to show back button via `AppHeader` props (Detail page true; root pages false).
- Rationale: Explicit and predictable for current route model.
- Alternatives considered:
  - Global auto-detection from pathname in header component: deferred to avoid hidden coupling.

## Risks / Trade-offs

- [Risk] Browser history length heuristics can vary across environments → Mitigation: always provide deterministic fallback route.
- [Risk] Incorrect page config may show/hide back button unexpectedly → Mitigation: keep simple explicit usage and add smoke checks on key routes.
- [Risk] Ionic/React Router differences in hash mode may affect back semantics → Mitigation: validate in dev and production-like GitHub Pages build.

## Migration Plan

1. Extend `AppHeader` API with back-button support.
2. Update Detail page and other nested routes to enable back button with fallback.
3. Verify root tabs keep no back button.
4. Smoke test direct deep link behavior and normal in-app navigation.

## Open Questions

- Should future nested settings or quiz subroutes automatically opt-in via a shared route utility?
- Should the fallback default be `/study` globally or route-specific per section?
