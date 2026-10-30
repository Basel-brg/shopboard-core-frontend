---
name: ShopBoard (شوب بورد)
description: The Akari Desk Atelier — warm Washi Ivory, Bamboo Tan ribs, Charcoal Ink, and Vermilion seal craft for pro desk equipment
colors:
  washi-ivory: "#f2eada"
  washi-cream: "#f6efe1"
  paper-ash: "#eae5d8"
  well-ash: "#e5dfd2"
  bamboo-tan: "#ccb693"
  bamboo-border: "#d4be9b"
  rib-shadow: "#c3b5a2"
  charcoal-ink: "#252522"
  charcoal-deep: "#12100f"
  muted-umeboshi: "#686358"
  vermilion-seal: "#c23828"
  bamboo-green: "#2e6f40"
typography:
  display:
    fontFamily: "Readex Pro, IBM Plex Sans Arabic, Tsukimi Rounded, sans-serif"
    fontSize: "45px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Readex Pro, IBM Plex Sans Arabic, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "IBM Plex Sans Arabic, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "IBM Plex Sans Arabic, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Sans Arabic, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.25
  mono:
    fontFamily: "IBM Plex Mono, Doto, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.charcoal-ink}"
    textColor: "{colors.washi-cream}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "46px"
  button-secondary:
    backgroundColor: "{colors.washi-cream}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "41px"
  card-product:
    backgroundColor: "{colors.washi-cream}"
    textColor: "{colors.charcoal-deep}"
    rounded: "{rounded.md}"
    padding: "14px"
---

<!-- impeccable:design-schema 2 -->

## Overview

**Creative North Star:** *The Akari Desk Atelier* (`paper-folds-pleats-deployable-akari-light-sculpture`, seed key `d3214009`).
ShopBoard (شوب بورد) presents professional tech hardware and desk setup equipment as tactile instruments arranged inside a tranquil architectural workshop. Instead of dark gamer chrome or generic marketplace grids, every surface rests on warm Washi Ivory paper (`#f2eada` / `#f6efe1`) partitioned by structural Bamboo Tan rib lines (`#ccb693`), anchored by a vertical right-hand Atelier rail with a Vermilion seal stamp (`#c23828`) and sumi-e Enso brush mark.

## Colors

- **Grounds & Paper Layers:**
  - `washi-ivory` (`#f2eada`) and `washi-cream` (`#f6efe1`): Primary warm paper canvas.
  - `paper-ash` (`#eae5d8`): Secondary architectural surface for the right-hand Atelier rail, controls panel, and footer.
  - `well-ash` (`#e5dfd2`): Recessed product photography wells inside catalog cards.
- **Structural Lines & Accents:**
  - `bamboo-tan` (`#ccb693`) and `bamboo-border` (`#d4be9b`): Structural rib dividers and card frames.
  - `charcoal-ink` (`#252522`) and `charcoal-deep` (`#12100f`): Primary typography and primary pill CTA fill.
  - `vermilion-seal` (`#c23828`): Reserved for the ShopBoard seal stamp (`شوب بورد`), discount tags, focus rings, and inline validation alerts.
  - `bamboo-green` (`#2e6f40`): Free-shipping progress meter and applied coupon confirmation.

## Typography

- **Arabic Display & Headlines (`Readex Pro`, `IBM Plex Sans Arabic`, `Tsukimi Rounded`):** Crisp geometric Arabic forms set at `700` weight with tight line-height (`1.05–1.2`) and dark Charcoal Ink (`#12100f`).
- **Body & Controls (`IBM Plex Sans Arabic`):** Clean RTL legibility across product specs, filter controls, and checkout forms, with `font-variant-numeric: tabular-nums` enforced globally for SAR prices and quantities.
- **Technical & Digits (`IBM Plex Mono`, `Doto`):** Clean monospaced font for product codes (e.g. `SB-KEY-01`), serial stamps, and tabular technical specifications.

## Layout

- **First Viewport (`1376:768` Atelier Rail & Stage on Desktop `min-width: 1024px`):**
  - **Right 20% Vertical Atelier Rail:** Houses the ShopBoard title + Vermilion seal stamp, vertical navigation (`الرئيسية`, `المتجر`, `الإعدادات`, `السلة`), sumi-e Enso ink ring, and featured Brass Desk Organizer card.
  - **Upper-Left 80% Hero Stage:** Full-height oak desk studio photograph on the left blending into Washi Ivory on the right, paired with the Arabic display headline (`ارتقِ بمساحة عملك`), primary/secondary pill CTAs, and 3 bamboo-divided feature badges.
  - **Lower-Left 80% Hardware Strip:** 4-column bordered catalog preview (`لوحة مفاتيح ميكانيكية لاسلكية`, `سماعة استوديو ANC احترافية`, `مصباح مكتب معماري نحاسي`, `ماوس عمودي هندسي مريح`).
- **Mobile-First Progression:** Starts as a single-column vertical flow at `390px`, expanding to 2 columns at `min-width: 640px` and the full 4-column catalog + Atelier rail at `min-width: 1024px`.

## Elevation & Depth

- **Single Elevation Rule:** Elevation is declared exclusively through `1px–2px solid` Bamboo Tan structural borders (`#ccb693` / `#d4be9b`) and tonal Washi paper shifts (`#f2eada` vs `#eae5d8` vs `#e5dfd2`) — never combining borders with drop shadows on cards.

## Shapes

- **Cards & Dialogs:** `6px–10px` crisp architectural corners framed in Bamboo Tan.
- **Buttons & Search Controls:** Full pill geometry (`999px`) contrasting against the rectangular Washi paper frames.
- **Brand Seal:** `42x42px` rounded square (`6px` radius) in Vermilion (`#c23828`).

## Components

- **Atelier Sidebar Rail (`.sidebar-rail-bg`, `.r-sidebar-nav`):** Right-anchored navigation rail with brand seal, vertical icon+label links, Enso emblem, and featured product spotlight.
- **Hardware Catalog Cards (`.product-card`):** Washi cream frame with recessed `#e5dfd2` photo well, Quick View trigger, rating/spec summary, SAR price, and pill Add-to-Cart button.
- **Slide-Over Cart Drawer (`#cart-drawer`):** Left-anchored RTL slide-over drawer with free-shipping progress bar, coupon validator (`SHOP20`, `WELCOME10`), and validated checkout form.
- **Modal Dialogs (`#product-dialog`, `#auth-dialog`, `#order-dialog`):** Native `<dialog>` modals for Quick View, Login/Register tabs, and Order Confirmation receipts.

## Do's and Don'ts

- **Do** use semantic HTML (`<aside>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<dialog>`) and explicit `<label for="...">` on every form control.
- **Do** write mobile-first CSS using only `min-width` media queries and zero `!important` declarations.
- **Don't** place kicker/eyebrow labels above headings or use big-number hero metric templates.
- **Don't** combine borders and drop shadows on the same card or use thick single-side accent borders (`>= 3px`).
