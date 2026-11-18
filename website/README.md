# Foodway Family Restaurant — Website

> **"The King of Taste"** — Premium dark-luxury themed restaurant website for Foodway Family Restaurant, Bhandup West, Mumbai.

## 🍽️ Overview

A multi-page, responsive restaurant website built with **HTML5 + CSS3 + Vanilla JavaScript (ES6+)**. Features a dark obsidian & champagne gold aesthetic, cinematic food photography, scroll animations, and interactive components.

## 📁 File Structure

```
website/
├── index.html          # Homepage (hero, USP, dishes, about, specials, testimonials, events, newsletter, location)
├── menu.html           # Interactive menu (80+ dishes, search, filter tabs, veg/non-veg toggle)
├── about.html          # Our story, philosophy, team, stats
├── gallery.html        # Photo gallery with lightbox, filter tabs
├── contact.html        # Reservation form, enquiry form, FAQ, Google Maps, hours
├── css/
│   ├── style.css       # Main stylesheet (~4800+ lines) — design system, components, layouts
│   ├── animations.css  # Keyframe animations, scroll reveals, transitions
│   └── responsive.css  # Mobile-first breakpoints (1400/1200/1024/768/576/480/375px)
├── js/
│   ├── navigation.js   # Sticky header, mobile hamburger, active nav, announcement bar
│   ├── animations.js   # AOS init, GSAP ScrollTrigger, counters, parallax, preloader
│   ├── main.js         # Swiper carousels, gallery lightbox, newsletter, back-to-top
│   ├── menu.js         # Menu filter, search, veg/non-veg toggle, URL hash sync
│   └── forms.js        # Form validation, success modal, floating labels, time slots
└── README.md
```

## 🎨 Design System

| Token          | Value                                   |
|----------------|-----------------------------------------|
| Background     | `#0a0a0a` obsidian / `#111111` secondary |
| Accent Gold    | `#c9a96e` champagne                      |
| Heading Font   | Playfair Display (serif)                 |
| Body Font      | Inter (sans-serif)                       |
| Icons          | Font Awesome 6                           |
| Images         | Unsplash (placeholder, free license)     |

## 🛠️ Libraries Used

- [AOS](https://michalsnik.github.io/aos/) — Scroll reveal animations
- [Swiper.js](https://swiperjs.com/) — Touch-enabled carousels
- [GSAP + ScrollTrigger](https://gsap.com/) — Advanced scroll animations

**No frameworks** (React, Vue, Angular, etc.) — pure vanilla HTML/CSS/JS.

## 📍 Restaurant Information

| Field         | Value                                                          |
|---------------|----------------------------------------------------------------|
| **Name**      | Foodway Family Restaurant                                      |
| **Address**   | Shop No. 3, R.R. Singh Chawl, L.B.S. Marg, Opp. Bata Showroom, Sonapur, Bhandup West, Mumbai – 400078 |
| **Phone**     | +91 74002 21190                                                |
| **Cuisines**  | North Indian, Mughlai, Punjabi, Chinese, Seafood               |
| **Hours**     | Mon–Thu, Sat–Sun: 11 AM – 12 Midnight · Friday: 11 AM – 12:30 AM |
| **Google**    | 4.2★ (4,339+ reviews)                                         |
| **Policy**    | No Beef Served · Halal                                         |
| **Delivery**  | Zomato · Swiggy                                                |

## 🚀 Getting Started

1. Open `index.html` in any modern browser
2. An internet connection is required for:
   - Google Fonts (Playfair Display, Inter)
   - Font Awesome icons
   - Unsplash images
   - AOS, Swiper, GSAP libraries (CDN)
   - Google Maps embed

## 📱 Responsive Breakpoints

- **1400px** — Large desktop
- **1200px** — Standard desktop
- **1024px** — Tablet landscape (nav → hamburger)
- **768px** — Tablet portrait (grids → single column)
- **576px** — Large phone
- **480px** — Small phone
- **375px** — Very small phone

## 📄 License

Built for Foodway Family Restaurant. All restaurant content, branding, and information are property of Foodway Family Restaurant. Placeholder images from [Unsplash](https://unsplash.com/) (free license).

