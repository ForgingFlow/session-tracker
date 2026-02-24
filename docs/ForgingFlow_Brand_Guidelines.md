# ForgingFlow Brand Guidelines

## Overview

ForgingFlow is a movement coaching brand built around the idea of disciplined progression — forging strength and flow through intentional practice. The visual identity is bold, energetic, and direct, with a warm industrial edge.

---

## Logo

The ForgingFlow logo consists of two elements:

1. **The Mark** — A parallelogram/chevron shape with a gradient from deep ember brown (`#993F0F`) to vibrant orange (`#FF6919`), angled forward to suggest momentum and direction.
2. **The Wordmark** — "ForgingFlow" set in a bold, rounded sans-serif typeface in **Flow Orange** (`#FF6919`).

### Logo Usage

- The inline version (mark + wordmark side by side) is the primary lockup.
- Always maintain clear space around the logo equal to the height of the "F" in the wordmark.
- The logo is designed primarily for dark backgrounds. Use the dark background version as the default.
- Do not stretch, recolor, or add effects to the logo.

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|---|---|---|
| **Flow Orange** | `#FF6919` | Primary brand color. CTAs, headlines, accents, logo wordmark. |
| **Ember Drift** | `#993F0F` | Secondary orange. Gradient partner to Flow Orange, hover states, depth. |

### Supporting Colors

| Name | Hex | Usage |
|---|---|---|
| **Flow Blue** | `#1A5F7A` | Accent. Contrast color for callouts, highlights, or secondary actions. |
| **Flow Blue (darker)** | `#123F52` | Deeper blue. Backgrounds, cards, subtle section breaks. |
| **Amber Dusk** | `#201A18` | Dark background. Primary page/slide background. |
| **Amber Dusk (darker)** | `#362D29` | Deeper dark. Cards, panels, secondary backgrounds. |
| **Summit Light** | `#FFFFFF` | Primary text on dark backgrounds. Clean contrast. |

### Primary Gradient

Flow Orange → Ember Drift (`#FF6919` → `#993F0F`), angled 135°. Used in the logo mark and as an accent for hero elements, dividers, or highlighted UI components.

---

## Typography

> **Note:** Add your font files to the project. See section below on how to do this for Claude Code.

### Font Stack (Placeholder — update with actual fonts)

| Role | Font | Weight | Usage |
|---|---|---|---|
| **Display / Headlines** | Clash Display | Medium| Hero text, section titles |
| **Body** | Clash Grotesk| Regular| Paragraphs, descriptions |
| **UI / Labels** | Clash Grotesk| SemiBold | Buttons, nav, captions |

### Type Scale (Suggested)

| Level | Size | Weight |
|---|---|---|
| H1 | 48–64px | Bold |
| H2 | 32–40px | Bold |
| H3 | 24–28px | SemiBold |
| Body | 16–18px | Regular |
| Small / Label | 12–14px | Medium |

---

## Voice & Tone

- **Direct.** No fluff. Get to the point.
- **Energetic but grounded.** Motivating without being loud or salesy.
- **Coach-like.** Authoritative, knowledgeable, encouraging.
- **Active verbs.** "Forge your movement." "Build your practice." "Show up."

---

## Design Principles

1. **Contrast is king.** Dark backgrounds with bright orange and white create instant visual hierarchy and energy.
2. **Motion implied.** The angled logo mark, forward-leaning typography, and diagonal gradients suggest momentum.
3. **Warmth through orange.** The palette avoids cold blues as dominants — warmth and fire are central to the brand feeling.
4. **Space and weight.** Use generous whitespace. Let bold elements breathe.

---

## Do's and Don'ts

### ✅ Do
- Use Flow Orange on dark backgrounds for maximum impact
- Use the gradient for hero/feature elements sparingly to preserve its power
- Keep layouts clean and structured
- Use high-contrast text (white or orange on dark backgrounds)

### ❌ Don't
- Place the orange logo on white or light backgrounds without an approved light-mode variant
- Use more than 2–3 colors in a single composition
- Use low-contrast text combinations
- Stretch or distort the logo mark proportions

---

## Adding Fonts to Your Claude Code Project

To use your custom fonts in a Claude Code project, follow these steps:

### 1. Create a fonts directory

In your project root, create a folder:

```
/your-project
  /public
    /fonts
      YourFont-Regular.woff2
      YourFont-Bold.woff2
      YourFont-Medium.woff2
```

Use `.woff2` format for web (best compression and browser support). If you only have `.otf` or `.ttf` files, you can convert them free at [fontsquirrel.com/tools/webfont-generator](https://www.fontsquirrel.com/tools/webfont-generator) or [cloudconvert.com](https://cloudconvert.com).

### 2. Add `@font-face` declarations to your CSS

Create or update your global CSS file (e.g. `globals.css` or `index.css`):

```css
@font-face {
  font-family: 'YourFont';
  src: url('/fonts/YourFont-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'YourFont';
  src: url('/fonts/YourFont-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### 3. Reference the font in your project

In CSS:
```css
body {
  font-family: 'YourFont', sans-serif;
}
```

In Tailwind (`tailwind.config.js`):
```js
theme: {
  extend: {
    fontFamily: {
      sans: ['YourFont', 'sans-serif'],
    }
  }
}
```

### 4. Tell Claude Code about your fonts

In your conversation with Claude Code, just say something like:

> "I have a custom font called [FontName] loaded in `/public/fonts/`. Use it as the primary typeface throughout the project."

Claude Code will reference it accordingly in all generated components and styles.

---

*Last updated: February 2026*
