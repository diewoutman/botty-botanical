## 1. Project Setup and Infrastructure

- [x] 1.1 Initialize Ionic React project with TypeScript
- [x] 1.2 Configure hash-based routing for GitHub Pages compatibility
- [x] 1.3 Set up GitHub Actions workflow for CI/CD and weekly data updates
- [x] 1.4 Configure PWA manifest and service worker
- [x] 1.5 Set up project folder structure (components, services, data, scripts)
- [x] 1.6 Install dependencies: localForage, react-i18next, sharp (build-time)
- [x] 1.7 Configure TypeScript paths and build settings
- [x] 1.8 Set up linting and formatting (ESLint, Prettier)

## 2. Data Pipeline (Build-Time Script)

- [x] 2.1 Create fetch-popular.js script structure
- [ ] 2.2 Implement Waarneming.nl API integration for Dutch observation data
- [x] 2.3 Implement GBIF API integration for taxonomy and global data
- [ ] 2.4 Implement iNaturalist API integration for observations
- [x] 2.5 Implement Wikipedia API integration for descriptions and page views
- [x] 2.6 Create Dutch-weighted popularity scoring algorithm
- [x] 2.7 Implement multi-source data merging and deduplication
- [x] 2.8 Create manual priority list for iconic Dutch plants
- [x] 2.9 Implement taxonomy enrichment from GBIF
- [x] 2.10 Implement multi-language name extraction from Wikipedia
- [x] 2.11 Create category assignment logic (tree, flower, shrub, etc.)
- [ ] 2.12 Implement image download from Wikimedia Commons
- [ ] 2.13 Create image optimization pipeline (resize 400x400, compress to 6KB)
- [x] 2.14 Implement data splitting: plants-core.json and plants-detail.json
- [x] 2.15 Create search-index.json generation
- [x] 2.16 Add pipeline error handling and logging
- [x] 2.17 Create test run of pipeline with sample data
- [x] 2.18 Document pipeline usage and configuration

## 3. Core Services and Infrastructure

- [x] 3.1 Create IndexedDB wrapper service using localForage
- [x] 3.2 Implement PlantApiService for external plant search and fetching
- [x] 3.3 Implement request throttling for Wikipedia API calls
- [x] 3.4 Create OfflineService for storage management and downloads
- [x] 3.5 Implement network status detection service
- [x] 3.6 Create i18n service with language switching
- [x] 3.7 Set up translation files (en, nl, de, fr, es)
- [x] 3.8 Implement image fetching with fallback strategy
- [x] 3.9 Create error handling and retry logic for API calls
- [x] 3.10 Implement storage usage tracking

## 4. UI Components - Layout and Navigation

- [x] 4.1 Create App shell with tabs/bottom navigation
- [x] 4.2 Implement Header component with language switcher
- [x] 4.3 Create Offline indicator component
- [x] 4.4 Implement Loading spinner and skeleton screens
- [x] 4.5 Create Error boundary and error display components
- [x] 4.6 Implement responsive layout grid system
- [x] 4.7 Create navigation state management
- [x] 4.8 Implement route guards and redirects

## 5. UI Components - Study Page

- [x] 5.1 Create PlantCard component with thumbnail, names, and badges
- [x] 5.2 Implement PlantGrid component with responsive layout
- [x] 5.3 Create SearchBar component with real-time filtering
- [x] 5.4 Implement CategoryFilter component
- [x] 5.5 Create InfiniteScroll wrapper for plant grid
- [x] 5.6 Implement search across all plant names (all languages)
- [x] 5.7 Create "Search Wikipedia" option for external plants
- [x] 5.8 Implement empty state and loading states
- [x] 5.9 Add pull-to-refresh functionality
- [x] 5.10 Create external search results display

## 6. UI Components - Plant Detail Page

- [x] 6.1 Create DetailPage layout with hero image section
- [x] 6.2 Implement plant name display (multi-language + Latin)
- [x] 6.3 Create TabNavigation component (General/Deep tabs)
- [x] 6.4 Implement GeneralTab with description, taxonomy, traits
- [x] 6.5 Implement DeepTab with history, etymology, cultural significance
- [x] 6.6 Create TraitBadge components (sun, water, hardiness, etc.)
- [x] 6.7 Implement ImageGallery with thumbnail grid and lightbox
- [x] 6.8 Create Attribution section with image credits and licenses
- [x] 6.9 Add "View on Wikipedia" external link
- [x] 6.10 Implement "Download for offline" button (external plants)
- [x] 6.11 Create placeholder images for missing photos

## 7. UI Components - Quiz Page

- [x] 7.1 Create QuizStart page with instructions and start button
- [x] 7.2 Implement QuestionDisplay component
- [x] 7.3 Create TypeAQuestion component (image to Latin name)
- [x] 7.4 Create TypeBQuestion component (name to image)
- [x] 7.5 Implement OptionButton components for answers
- [x] 7.6 Create ImageOptionGrid for Type B questions
- [x] 7.7 Implement QuizProgress indicator
- [x] 7.8 Create AnswerFeedback component (correct/incorrect visuals)
- [x] 7.9 Implement QuizResults page with score and statistics
- [x] 7.10 Create QuizReview component for reviewing answers
- [x] 7.11 Implement question randomization and distractor selection
- [x] 7.12 Add high score tracking and display

## 8. UI Components - Settings Page

- [x] 8.1 Create SettingsPage layout
- [x] 8.2 Implement LanguageSelector component
- [x] 8.3 Create StorageUsage display with breakdown
- [x] 8.4 Implement "Download all for offline" button with progress
- [x] 8.5 Create "Clear cached data" button with confirmation
- [x] 8.6 Add PWA install prompt integration
- [x] 8.7 Implement About section with attributions
- [x] 8.8 Create storage warning indicators

## 9. Quiz Engine Implementation

- [x] 9.1 Create QuizService for question generation
- [x] 9.2 Implement random question pool selection (bundled + cached)
- [x] 9.3 Create distractor selection algorithm (random for MVP)
- [x] 9.4 Implement answer validation logic
- [x] 9.5 Create scoring calculation
- [x] 9.6 Implement quiz state management
- [x] 9.7 Add quiz results persistence
- [x] 9.8 Create question prefetching for smooth transitions
- [x] 9.9 Implement Type B image preloading

## 10. Offline and Caching

- [x] 10.1 Implement automatic caching of visited external plants
- [x] 10.2 Create bulk download functionality for all cached plants
- [x] 10.3 Implement download progress tracking
- [x] 10.4 Add cache size limits and LRU eviction
- [x] 10.5 Create storage quota monitoring
- [x] 10.6 Implement cache clearing functionality
- [x] 10.7 Add persistence for quiz scores and user settings
- [ ] 10.8 Test offline functionality thoroughly

## 11. Internationalization (i18n)

- [x] 11.1 Set up react-i18next configuration
- [x] 11.2 Create translation files for all 5 languages
- [x] 11.3 Implement language auto-detection on first launch
- [x] 11.4 Create LanguageContext for state management
- [x] 11.5 Translate all UI strings
- [x] 11.6 Implement fallback to English for missing translations
- [x] 11.7 Add RTL support architecture (future-proofing)
- [ ] 11.8 Test all language switches

## 12. Data Assets and Images

- [x] 12.1 Run data pipeline to generate initial plant dataset
- [x] 12.2 Review and validate generated JSON files
- [ ] 12.3 Optimize and verify thumbnail images
- [ ] 12.4 Create placeholder image templates
- [x] 12.5 Generate search index
- [x] 12.6 Validate data schema and completeness
- [ ] 12.7 Add data validation tests

## 13. Testing

- [ ] 13.1 Set up testing framework (Jest + React Testing Library)
- [ ] 13.2 Write unit tests for services
- [ ] 13.3 Write component tests for UI components
- [ ] 13.4 Create integration tests for user flows
- [ ] 13.5 Test offline functionality
- [ ] 13.6 Test across different browsers
- [ ] 13.7 Test on mobile devices
- [ ] 13.8 Performance testing (bundle size, load times)

## 14. Deployment and Documentation

- [ ] 14.1 Configure GitHub Pages deployment
- [ ] 14.2 Set up custom domain (optional)
- [ ] 14.3 Configure SSL/HTTPS
- [ ] 14.4 Test deployed application
- [x] 14.5 Create README with setup instructions
- [ ] 14.6 Document API integrations and rate limits
- [ ] 14.7 Create user guide/help documentation
- [ ] 14.8 Document data pipeline for future maintainers
- [x] 14.9 Add LICENSE file
- [ ] 14.10 Create CONTRIBUTING guidelines

## 15. Polish and Optimization

- [x] 15.1 Implement lazy loading for images
- [ ] 15.2 Add smooth transitions and animations
- [x] 15.3 Optimize bundle size analysis
- [ ] 15.4 Implement virtual scrolling for large lists
- [ ] 15.5 Add error tracking (Sentry or similar)
- [ ] 15.6 Implement analytics (privacy-friendly, optional)
- [ ] 15.7 Performance audit and optimization
- [x] 15.8 Accessibility audit and fixes
- [ ] 15.9 Final UI/UX polish
- [ ] 15.10 Beta testing with real users
