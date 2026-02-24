# ForgingFlow — Project Context for Claude Code

## About This Project

ForgingFlow is a movement coaching brand. This project covers:
- A **marketing / landing site** to attract new clients
- A **client-facing coaching app** for program delivery and session management
- Any **internal tools** needed to support coaching operations

The owner is a movement coach (not a developer), so code should be clean, well-commented, and easy to maintain with AI assistance. Prefer simple, proven solutions over complex ones. Always explain what you're doing and why when making significant decisions.

---

## Brand & Design

**Always refer to `/docs/brand-guidelines.md` for the full brand reference.**

### Core Colors
- **Flow Orange** `#FF6919` — primary accent, CTAs, headlines
- **Ember Drift** `#993F0F` — secondary orange, gradients, hover states
- **Amber Dusk** `#201A18` — primary dark background
- **Amber Dusk Darker** `#362D29` — cards, panels, secondary backgrounds
- **Flow Blue** `#1A5F7A` — accent, callouts
- **Flow Blue Darker** `#123F52` — deeper accent backgrounds
- **Summit Light** `#FFFFFF` — primary text on dark backgrounds

### Primary Gradient
Flow Orange → Ember Drift at 135°: `linear-gradient(135deg, #FF6919, #993F0F)`

### Styling Rules
- Use **Tailwind CSS** for all styling
- Default to **dark backgrounds** (Amber Dusk `#201A18`) — this is a dark-first brand
- High contrast always: white or orange text on dark backgrounds
- Bold, clean layouts with generous whitespace
- The brand feels energetic and direct — avoid anything that looks soft, pastel, or generic

### Typography
- Custom fonts are located in `/public/fonts/`
- Use `@font-face` declarations in the global CSS file
- Apply the custom font as the default `font-family` across the project
- If no custom font is available yet, use `Inter` as a temporary fallback

### Logo
- Logo files are in `/public/images/` or `/public/brand/`
- Always use the logo on dark backgrounds
- Never stretch, recolor, or add effects to the logo

---

## Project Structure

Keep the project organized and predictable:

```
/
  CLAUDE.md               ← this file
  /docs
    brand-guidelines.md   ← full brand reference
  /public
    /fonts                ← custom font files (.woff2)
    /images               ← logo and brand assets
  /src
    /components           ← reusable UI components
    /pages (or /app)      ← page-level files
    /styles               ← global CSS / Tailwind config
```

---

## Code Preferences

- Write clean, readable code with comments explaining non-obvious decisions
- Use **Tailwind CSS** utility classes for styling — avoid writing custom CSS unless necessary
- Build **reusable components** for anything that appears more than once (buttons, cards, nav, etc.)
- Mobile-first responsive design — the site must look great on phones
- Optimize images and keep page load fast
- When in doubt, choose the simpler approach

---

## Key Functionality (High Level)

- **Marketing site:** Hero section, about/coaching philosophy, services/programs, testimonials, contact/booking CTA
- **Coaching app:** Client login, program view, session tracking, progress visibility
- Keep these concerns separated cleanly in the codebase

---

## Working Style

- This project is owner-operated by a non-developer. Explain decisions clearly.
- Ask clarifying questions before building something large or hard to undo
- Suggest improvements proactively, but don't over-engineer
- When multiple approaches exist, briefly explain the tradeoff and recommend one

---

*Last updated: February 2026*
