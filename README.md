# This is my tRPC + Clerk + Expo Template App!

Uses Discord as an out of the box OAuth provider.

It uses [Turborepo](https://turborepo.org/) and contains:

## Code Layout

```
.vscode
  └─ Recommended extensions and settings
apps
  ├─ expo
  └─ next.js
      ├─ Next.js 13
      ├─ React 18
      └─ E2E Typesafe API Server & Client
packages
 ├─ api
 |   └─ tRPC v10 router definition
 └─ db
     └─ typesafe db-calls using Prisma
```

## Quick Start

To get it running, follow the steps below:

### Setup dependencies

```diff
# Install dependencies
pnpm i

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Generate prisma client and optionally push prisma schema
pnpm db-generate
pnpm db-push
```

### Configure Expo app

Expo doesn't use the a .env for the publishable key, so you will need to go to `apps/expo/app.config.ts` and add it there.

```
const CLERK_PUBLISHABLE_KEY = "clerk-publishable-key";
```

### Configure Expo `dev`-script

> **Note:** If you want to use your iPhone with Expo Go, just run `pnpm dev` and scan the QR-code.

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools [installed](https://docs.expo.dev/workflow/ios-simulator/).
2. Change the `dev` script at `apps/expo/package.json` to open the iOS simulator.

```diff
+  "dev": "expo start --ios",
```

3. Run `pnpm dev` at the project root folder.

## Deployment

### Next.js

> Note if you are building locally you will need to insert your env correctly, for example using `pnpm with-env next build`

#### Deploy to Vercel

1. Select the `apps/nextjs` folder as the root directory and apply the following build settings:

<img width="927" alt="Vercel deployment settings" src="https://user-images.githubusercontent.com/11340449/201974887-b6403a32-5570-4ce6-b146-c486c0dbd244.png">

> The install command filters out the expo package and saves a few seconds (and cache size) of dependency installation. The build command makes us build the application using Turbo.

2. Add `DATABASE_URL`,`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` env vars.

3. Done. Assign your domain and use that instead of `localhost` for the `url` in the Expo app so that your Expo app can communicate with your backend when you are not in development.

### Expo

1. [EAS Build](https://docs.expo.dev/build/introduction/). The build service helps to create builds without requiring a full native development setup.

   ```bash
   // Install the EAS CLI
   $ pnpm add -g eas-cli

   // Log in with your Expo account
   $ eas login
   ```

2. After the initial setup, you can create your first build. You can build for Android and iOS platforms and use different [**eas.json** build profiles](https://docs.expo.dev/build-reference/eas-json/) to create production builds or development, or test builds. Example of a development build for iOS (eas.json that I created assumes we are creating a simulator build. Drag and drop the .app from the .tar.gz into the simulator to install):

   ```
   $ eas build -p ios --profile development
   ```

   > If you don't specify the `--profile` flag, EAS uses the `production` profile by default.

3. [EAS Submit](https://docs.expo.dev/submit/introduction/) can help you send the build to the stores.

   ```
   $ eas submit --platform ios --latest
   ```

   > You can also combine build and submit in a single command, using `eas build ... --auto-submit`.

4. OAuth social providers with Clerk: whitelist the OAuth redirect URL for the Expo application in the Clerk Dashboard.

   In `apps/expo/app.config.ts`, add a `scheme` that will be used to identify your standalone app.

   ```ts
   import { ExpoConfig, ConfigContext } from "@expo/config";

   const CLERK_PUBLISHABLE_KEY = "";

   const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
      name: "expo",
      slug: "expo",
      scheme: "your-app-scheme",
      // ...
   });
   ```

   Then, in the [Clerk Dashboard](https://dashboard.clerk.dev/), go to **User & Authentication > Social Connections > Settings** and add your app's scheme and redirect URL to the **Redirect URLs** field:

   ```txt
   your-app-scheme://oauth-native-callback
   ```

   Here, `your-app-scheme` corresponds to the `scheme` defined in `app.config.ts`, and `oauth-native-callback` corresponds to the redirect URL defined when authenticating with social providers. See [SignInWithOAuth.tsx](/apps/expo/src/components/SignInWithOAuth.tsx) for reference.

   > You can find more information about this in the [Expo documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/#redirecting-to-your-app).

   You should now be able to sign in with your social providers in the TestFlight application build.

5. Let's say you spotted a small typo; you'll have to create a new build, submit it to the stores, and wait for approval before you can resolve this issue. In these cases, use EAS Update to quickly send a small bugfix to your users without going through this long process. Let's start by setting up EAS Update.

   The steps below summarize the [Getting started with EAS Update](https://docs.expo.dev/eas-update/getting-started/#configure-your-project) guide.

   ```bash
   // Add the `expo-updates` library to your Expo app
   $ cd apps/expo
   $ pnpm expo install expo-updates

   // Configure EAS Update
   $ eas update:configure
   ```

6. Before we can send out updates to your app, you have to create a new build and submit it to the app stores. For every change that includes native APIs, you have to rebuild the app and submit the update to the app stores. See steps 2 and 3.

7. Now that everything is ready for updates, let's create a new update for `production` builds. With the `--auto` flag, EAS Update uses your current git branch name and commit message for this update. See [How EAS Update works](https://docs.expo.dev/eas-update/how-eas-update-works/#publishing-an-update) for more information.

   ```bash
   $ cd apps/expo
   $ eas update --auto
   ```
