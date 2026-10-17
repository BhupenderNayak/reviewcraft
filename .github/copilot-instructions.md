# ReviewCraft Project Instructions

## Business Context
- **Brand Name:** ReviewCraft
- **Service:** Authentic B2B customer review & reputation management via a real human network (Google Maps reviews, SEO-optimized, location-targeted, gradual manual drip).
- **Future Services (Coming Soon section):** AI Ad Generation, Web Support, Complete Local SEO.
- **Primary CTA:** Redirect users to WhatsApp Business chat with pre-filled dynamic messages.

## Design System
- **Vibe:** High-trust corporate (Stripe / Trustpilot aesthetic). Clean light mode (`#F8FAFC`), Deep Navy (`#0F172A`), Emerald Trust Green (`#10B981`), Gold (`#F59E0B`).
- **Fonts:** 'Plus Jakarta Sans' for headings, 'Inter' for body text.
- **Styling:** Tailwind CSS (via CDN) + custom rules in `css/styles.css`.
- **Responsiveness:** Mobile-first, fully responsive across mobile, tablet, and desktop.

## Architecture Rules (Strict Separation of Concerns)
1. Never dump all code into `index.html`.
2. Keep all configurable content (WhatsApp number, Pricing tiers, Testimonials with Name/Business/Address/Quote, and Promotional Posters) inside `js/data.js`.
3. Keep all DOM manipulation, interactive calculators, and dynamic rendering inside `js/app.js`.
4. Keep custom utility classes and keyframe animations inside `css/styles.css`.