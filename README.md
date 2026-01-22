# TaskOrderApp
 
Offline-first task management app built with React Native. Users can create, edit, and sync tasks even without internet. Tasks auto-sync when the network is available.
 
## Features
 
- Create and edit tasks with title and amount
- Full offline support with AsyncStorage
- Auto-sync PENDING or FAILED tasks when network comes back
- Manual pull-to-refresh sync
- Track task status: PENDING | SYNCED | FAILED
- Strict validation:
  - Title: must contain letters, no multiple spaces, 1–100 chars
  - Amount: min 0.01, max 999,999,999, max 2 decimals
- Read-only synced tasks: cannot edit once synced
- Auto-fail tasks stuck PENDING >2 minutes
- Retry failed tasks manually
 
## Tech Stack
 
- React Native 0.83.1
- TypeScript
- Redux Toolkit + Redux Saga
- React Navigation
- AsyncStorage
- NetInfo
 
## Project Structure
 
```
TaskOrderApp/
├── src/
│   ├── components/
│   │   └── TaskList/
│   │       ├── TaskItem.tsx
│   │       └── SyncStatusBadge.tsx
│   ├── constants/
│   │   ├── strings.ts
│   │   └── validations.ts
│   ├── hooks/
│   │   └── useNetworkSync.ts
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── routes.ts
│   ├── redux/
│   │   ├── sagas/
│   │   │   ├── index.ts
│   │   │   └── tasksSaga.ts
│   │   ├── slices/
│   │   │   └── tasksSlice.ts
│   │   └── store.ts
│   ├── screens/
│   │   ├── CreateTaskScreen/
│   │   │   ├── CreateTaskScreen.tsx
│   │   │   └── CreateTaskScreen.styles.tsx
│   │   ├── EditTaskScreen/
│   │   │   ├── EditTaskScreen.tsx
│   │   │   └── EditTaskScreen.styles.ts
│   │   └── TaskListScreen/
│   │       ├── TaskListScreen.tsx
│   │       └── TaskListScreen.styles.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── storage.ts
│   └── types/
│       └── Task.ts
├── App.tsx
└── package.json
```
 
## Key Architectural Decisions
 
### Offline-first & Sync
 
- Tasks are stored locally first in AsyncStorage
- `useNetworkSync` hook listens to network changes and auto-dispatches `syncTasksRequest`
- Retry failed tasks: Users can manually retry failed tasks
- Mock API simulates network failures (20% failure rate) for testing
 
### Redux + Saga
 
- **tasksSlice**: Stores tasks array (`items`), loading, error, and `isSyncing` state
- **tasksSaga**: Handles async operations:
  - Load tasks from storage on app start
  - Add/update tasks with auto-sync when online
  - Sync pending/failed tasks with mock API
  - Retry failed tasks
 
### Validation
 
- `validateTask()` handles all business rules:
  - Title: must contain letters, no consecutive spaces, 1-30 chars
  - Amount: min 0.01, max 9999 max 2 decimals, no leading zeros
- `formatAmountInput()` blocks typing more than 2 decimals in real-time
 
 
## Components
 
### Screens
- **TaskListScreen**: Displays all tasks with FAB button, pull-to-refresh, sync status banner, empty state
- **CreateTaskScreen**: Form with validation, creates new tasks (green button)
- **EditTaskScreen**: Form with validation, read-only for synced tasks, warning banner (blue button)
 
### Components
- **TaskItem**: Displays task title, amount, date, status badge, and retry button if failed
- **SyncStatusBadge**: Color-coded badge (Green: SYNCED | Orange: PENDING | Red: FAILED)
 
### Hooks
- **useNetworkSync**: Monitors network connectivity, auto-syncs on reconnection, provides manual sync function
 
## Getting Started
 
### Prerequisites
 
- Node.js v16+
- npm or yarn
- React Native development environment
- iOS: Xcode + CocoaPods (macOS only)
- Android: Android Studio + JDK
 
### Installation & Run
 
```bash
# Install dependencies
npm install
# or
yarn install

# iOS setup
cd ios && pod install && cd ..

# Run iOS
npm run ios
# or
yarn ios

# Run Android
npm run android
# or
yarn android
```
 
## How it Works
 
### Task Creation Flow
1. User fills form → validation checks
2. Task saved to AsyncStorage with `PENDING` status
3. Redux state updated
4. If online, auto-sync triggered → API call → status becomes `SYNCED`
5. If offline, stays `PENDING` until network returns
 
### Task Update Flow
1. User edits task (only if not synced)
2. Task updated in AsyncStorage with `PENDING` status
3. Redux state updated
4. Auto-sync triggered if online
 
### Sync Flow
1. Network change detected by `useNetworkSync`
2. Filters tasks with `PENDING` or `FAILED` status
3. Iterates and calls mock API for each task
4. Updates task status to `SYNCED` on success or `FAILED` on error
5. Saves to AsyncStorage and updates Redux state
 
## Data Flow
 
```
User Action → Redux Action → Saga Intercepts → AsyncStorage Save → API Call → State Update → UI Re-render
```
 
## Validation & Formatting
 
### Title Validation
- Must contain at least one letter
- No consecutive spaces
- Length: 1-100 characters
- Automatically trimmed

### Amount Validation
- Minimum: 0.01
- Maximum: 999,999,999
- Maximum 2 decimal places
- No leading zeros (except 0.xx)
- Real-time formatting prevents invalid input
 
## Features in Detail
 
### Sync Status Indicators
- 🟢 **SYNCED**: Successfully saved to backend (read-only)
- 🟡 **PENDING**: Queued for sync, waiting for network
- 🔴 **FAILED**: Sync failed, retry available
 
### Mock API
- Simulates 1 second network delay
- 20% random failure rate for testing
- Returns synced task with timestamp
 
## Testing Offline Functionality
 
1. **Airplane Mode Test**:
   - Turn off WiFi/Mobile data
   - Create/edit tasks → status becomes `PENDING`
   - Turn network back on → tasks auto-sync to `SYNCED`

2. **Sync Failure Test**:
   - Create tasks until one fails (20% chance)
   - Failed task shows red badge
   - Tap retry button → task becomes `PENDING` → auto-syncs

3. **Edit Synced Task**:
   - Try editing a synced task → shows warning banner
   - Form fields disabled
   - Update button disabled
 
## Code Quality
 
- ✅ TypeScript for type safety
- ✅ Centralized constants (`strings.ts`, `validations.ts`)
- ✅ Clean Redux-Saga patterns
- ✅ Separation of concerns (components, screens, services)
- ✅ Consistent styling with Material Design principles
- ✅ Proper error handling and user feedback
 
## Troubleshooting
 
### iOS Build Issues
```bash
# Clean iOS build
cd ios
rm -rf build Pods Podfile.lock
pod install
cd ..
npm start -- --reset-cache
```

### Android Build Issues
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
```

### Metro Bundler Issues
```bash
# Reset cache
npm start -- --reset-cache

# Kill process on port 8081
lsof -ti:8081 | xargs kill
```
 
## Future Enhancements
 
- [ ] Task deletion
- [ ] Task categories/tags
- [ ] Sort and filter options
- [ ] Search functionality
- [ ] Real backend integration
- [ ] User authentication
- [ ] Dark mode
- [ ] Unit and integration tests
 
## License
 
MIT License

---

Built with ❤️ using React Native
- Read-only and retry logic implemented 
