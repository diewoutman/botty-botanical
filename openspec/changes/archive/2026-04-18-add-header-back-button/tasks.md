## 1. Header API Extension

- [x] 1.1 Add back-button props to the shared AppHeader component (`showBackButton`, optional `fallbackRoute`)
- [x] 1.2 Implement header back button rendering using Ionic header button conventions
- [x] 1.3 Implement back button click behavior: goBack when possible, fallback route when not

## 2. Route Integration

- [x] 2.1 Update nested routes (starting with plant detail) to enable header back button
- [x] 2.2 Keep root tab pages (study, quiz, settings) configured without back button
- [x] 2.3 Ensure direct deep-link navigation to nested routes returns to fallback route on back

## 3. Verification

- [x] 3.1 Verify in-app flow: Study -> Detail -> Back returns to Study
- [x] 3.2 Verify deep-link flow: open Detail directly -> Back navigates to fallback route
- [x] 3.3 Run build/typecheck and fix any routing/header regressions