# LARP Badge Generator

A tool for generating printable badges for Vampire: The Masquerade LARP events. Customize your Kindred's name, clan, stats (DA, WD, HP), and two discipline powers (with optional custom image uploads) to create a personalized badge.

## Features
- Character Name Input
- Clan Selection (with descriptions for each clan from V5)
- Stat Adjustment (DA, WD, HP) with +/- buttons
- Power Selection: Choose two disciplines from a list (including custom upload/URL)
- Custom Power Support: Upload an image or provide a URL for a custom power icon
- Theme Toggle: Dark or light print versions
- Live Preview: See your badge update in real time as you adjust settings
- Download: Export your badge as a high-resolution PNG

## How to Use
1. Enter your Kindred's name.
2. Select your clan from the dropdown (clanless and thin-blood options available).
3. Adjust your Defense (DA), Willpower (WD), and Health (HP) using the input fields or the +/- buttons.
4. Choose your primary and secondary disciplines from the list. If you select "Custom Upload / URL...", you can either upload an image file or paste a direct image URL.
5. Toggle between Dark and Light print themes to see how your badge will look.
6. Click "Forge Badge (.PNG)" to download your badge.

## Technology Stack
- React
- Vite
- html-to-image (for converting the badge preview to a PNG)
- CSS Modules / Tailwind-like styling (from the existing classes)

## Getting Started
1. Clone the repository and navigate to the larp-badges directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The app will be available at `http://localhost:5173` (or another port).

## Project Structure
- `src/` – Source code
  - `App.jsx` – Main application component.
  - `BadgeGenerator.jsx` – Contains the badge generation logic, form controls, and preview.
  - `assets/` – Contains the default ATT LARP logo and other static assets.
  - `index.css` – Global styles.
  - `main.jsx` – Entry point.

## Notes
This app is part of the Vampire Platform ecosystem but can be used standalone for generating LARP badges for any Vampire: The Masquerade chronicle. It does not require a backend connection; all generation is done client-side.

The badge design includes space for the character name, clan, stats (DA/WD and HP), two discipline icons, and a footer with the event designator (S1F) and website (attlarp.gr).

## License
Please check the LICENSE file in the repository for licensing information.