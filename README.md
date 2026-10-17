# ⭐ ReviewCraft — B2B Reputation & Review Growth Platform

**ReviewCraft** is a high-conversion B2B web platform and client analytics suite built for authentic Google Maps reputation management. It connects businesses with a verified human network to deliver gradual, SEO-optimized, and location-targeted reviews.

---

## 🚀 Key Features

* **Interactive Price & Order Calculator:** Real-time slider allowing clients to calculate bulk order costs across Starter (₹25), Growth (₹27), and Premium (₹30) tiers before ordering.
* **Dynamic WhatsApp Order Engine:** Every CTA and pricing card generates a pre-filled WhatsApp Business message containing the exact package, review count, and estimated total.
* **6-Card Interactive Testimonial Carousel:** Touch-enabled horizontal slider with arrow navigation,pagination dots, and expandable service verification details.
* **Data-Driven Modular Architecture:** Complete separation of concerns—all pricing, testimonials, promotional posters, and social links live inside a single configuration file (`js/data.js`).
* **PIN-Protected Client Analytics Dashboard (`analytics.html`):** Executive stats page powered by Chart.js displaying total visits, WhatsApp lead clicks, conversion rates, package demand breakdown, and CSV export.
* **100% Responsive Design:** Mobile-first layout styled with Tailwind CSS, Plus Jakarta Sans typography, and custom glassmorphism utilities.

---

## 📂 Project Architecture

```text
reviewcraft/
├── .github/
│   └── copilot-instructions.md   # Project rules & context for GitHub Copilot
├── assets/
│   ├── logo/                     # Brand logos & favicons
│   ├── posters/                  # Promotional offer banners
│   └── proofs/                   # Client avatars & verification assets
├── css/
│   └── styles.css                # Custom animations, range sliders & carousel styles
├── js/
│   ├── data.js                   # Single source of truth (Pricing, Testimonials, WhatsApp, PIN)
│   ├── app.js                    # Landing page rendering, calculator & event tracking
│   └── analytics.js              # Chart.js rendering & PIN authentication for dashboard
├── index.html                    # Main public-facing landing page
├── analytics.html                # Private client analytics & KPI dashboard
└── README.md                     # Project documentation 