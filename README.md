# Test Shop

Mini React Native shopping app built with Expo. The app lets a user browse a large product list, add products to a cart, choose order options, send analytics events on every cart change, and confirm an order before submitting it.

## Features

- Product catalog with 1000 generated products.
- Infinite loading: first 20 products, then 20 more on scroll.
- Add and remove products from the cart.
- Fixed order options with horizontal scroll.
- Analytics event is sent after every cart or option change.
- Analytics status is saved and shown in the UI.
- Order confirmation dialog with products, options, and total amount.
- Minimum order amount: `1000 ₽`.
- Fake backend with simulated server errors.
- Unit tests for cart logic and fake backend behavior.

## Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- MobX
- TanStack Query
- React Native Paper
- Lucide React Native
- Vitest

## Architecture

The project follows a Feature-Sliced Design inspired structure:

```text
app/                 Expo Router routes
src/screens/         screen-level composition
src/features/        user actions and feature logic
src/entities/        business entities and domain models
src/shared/          shared API, UI, providers, and helpers
```

Main screen:

```text
src/screens/shop-screen/
```

Shared UI public API:

```ts
import { AppDialog, ScreenState } from "@/shared/ui";
```

## State Management

MobX is used for client/domain state:

- cart items;
- selected order options;
- cart total;
- checkout availability;
- analytics delivery log.

Main store:

```text
src/entities/cart/model/cart-store.ts
```

TanStack Query is used for async/server-like state:

- infinite product loading;
- analytics event mutation;
- order submit mutation.

## Fake Backend

There is no real backend in this test task. Backend behavior is simulated in:

```text
src/shared/api/fake-backend.ts
```

It supports:

- paginated product loading;
- analytics events;
- order submission;
- simulated errors:
  - service unavailable;
  - out of stock;
  - minimum order amount not reached.

## Getting Started

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Run on iOS:

```bash
npm run ios
```

Run on Android:

```bash
npm run android
```

Run on web:

```bash
npm run web
```

## Checks

Run TypeScript check:

```bash
npm run typecheck
```

Run tests:

```bash
npm test
```

Check Expo dependency compatibility:

```bash
npx expo install --check
```

## Tests

Cart tests:

```text
src/entities/cart/model/cart-store.test.ts
```

Cover:

- adding the same product;
- removing products;
- analytics snapshot;
- minimum order validation.

Fake backend tests:

```text
src/shared/api/fake-backend.test.ts
```

Cover:

- product pagination by 20 items;
- minimum order error;
- service unavailable error;
- analytics event payload.

## Notes

- The app uses fake data and fake network delays.
- Product images are represented by lightweight colored placeholders and icons.
- Local project documentation can be kept in `local-docs/`; this folder is ignored by git.
