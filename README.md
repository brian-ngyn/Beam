 
## Introduction

Beam is a mobile application that enhances personal safety by leveraging real-time sentiment analysis and natural language processing (NLP). It continuously monitors conversations to detect aggression levels, and upon detecting a predefined safe word, it automatically triggers live streaming to a set of emergency contacts.

## Idea

**Does the product address the prompt? Does the product introduce a new/unique approach or perspective?**

Beam addresses the prompt by using technology to promote peace and inclusion in society. It provides access to justice and safety by enabling individuals to call for help in hostile situations discreetly. The unique approach of combining real-time aggression detection with automatic live streaming offers a proactive solution to personal safety challenges.


## Effectiveness

**Does the product function as intended? Does the product execute on its idea in a way that’s effective?**

Yes, the application functions as intended by:

- **Continuous Monitoring:** Always-on detection of conversation sentiment without user intervention.
- **Accurate Detection:** Utilizes advanced NLP models to assess aggression levels from 0 to 1.
- **Immediate Response:** Triggers live streaming to emergency contacts when the safe word is detected.

This seamless integration ensures that users receive timely assistance, effectively executing the core idea.


## Technical Challenge

**How well does the product perform its intended functions? Does the product demonstrate technical proficiency and innovation?**

Beam performs its intended functions efficiently and demonstrates significant technical proficiency:

- **Integration of Multiple Technologies:**
  - **Frontend:** React Native for cross-platform mobile development.
  - **Backend:** T3 stack using TypeScript, tRPC, and Prisma for robust API development.
  - **NLP Processing:** FastAPI handles complex NLP tasks and sentiment analysis.
- **Advanced NLP Implementation:** Real-time processing of audio data to detect aggression.
- **Innovation:** Introduces a novel solution that proactively enhances personal safety through technology.



## Presentation and Marketability

**Is the implementation complex? Does the product feature different parts? Does the product use interesting concepts or technologies?**

Yes, the implementation is complex and multifaceted:

- **Complex Implementation:**
  - Real-time audio capture and processing.
  - Low-latency live streaming integration.
- **Features Different Parts:**
  - User interface, background services, NLP processing, and live streaming.
- **Interesting Technologies:**
  - Uses cutting-edge NLP models for sentiment analysis.
  - Integrates external APIs for speech-to-text conversion and streaming.

These aspects make Beam highly marketable to individuals and organizations focused on personal safety.

---

## Design

**Does the team seem organized in their presentation/demo? Does the presentation engage the judges and have real-world marketability?**

The application's design is:

- **Clean and Visually Appealing:** User-friendly interface with intuitive navigation.
- **Organized Presentation/Demo:**
  - Clearly demonstrates key features and user flows.
  - Engages the audience with real-world scenarios.
- **Real-World Marketability:**
  - Addresses a significant need for personal safety solutions.
  - Potential for partnerships with safety organizations and law enforcement.

---

# This is my tRPC + Clerk + Expo Template App!

Uses Discord as an out of the box OAuth provider.

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


## Team
Brian Nguyen, Abod Abbas, Dimitar Janevski, Dhyey Lalseta



Thank you for considering Beam as a solution to promote peace and inclusion through technology.
