---
name: Lume Executive
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d2e1fa'
  on-secondary-container: '#556379'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#d3e3ff'
  tertiary-fixed-dim: '#b7c7e2'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485e'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
  surface-glass: rgba(255, 255, 255, 0.4)
  surface-glass-dark: rgba(26, 26, 27, 0.8)
  lume-border: rgba(255, 255, 255, 0.4)
  outline-subtle: rgba(199, 198, 202, 0.3)
  success-blue: '#2563eb'
  status-draft: '#b45309'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  panel-padding: 24px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
Lume Executive is a sophisticated, high-end professional design system that blends **Corporate Modernism** with **Glassmorphism**. The brand evokes feelings of precision, transparency, and effortless efficiency. It targets high-performing professionals who require clarity in data-dense environments. 

The aesthetic is defined by "Lume Borders" (subtle top-lit edges), high-quality backdrop blurs, and a monochromatic primary palette accented by functional semantic colors. The interface feels lightweight and ethereal yet structurally grounded through a rigorous grid.

## Colors
The palette is rooted in a "Fidelity" logic, using pure blacks and deep navies against a backdrop of cool-toned whites and greys. 

- **Primary Canvas:** A soft gradient falloff from white to `#f7f9fc` creates a sense of depth.
- **Glass Layers:** Components utilize `surface-glass` (white at 40% opacity) with a `30px` blur to maintain legibility while feeling integrated into the background.
- **Accents:** High-contrast black is used for primary actions and critical text, while secondary information uses slate and muted blue tones.
- **Semantic States:** Soft blue backgrounds for active interviews, slate for standard applications, and amber for drafts.

## Typography
The system relies exclusively on **Inter** to achieve a neutral, systematic, and utilitarian feel. 

Hierarchy is established through extreme weight variance and letter spacing:
- **Headlines:** Use tighter tracking and medium-to-bold weights for authority.
- **Labels:** Small caps with wide tracking (`0.1em`) are used for section headers to provide a structural "metadata" feel.
- **Body:** Standard weights with generous line heights ensure readability in dense lists.
- **Iconography:** Uses Material Symbols Outlined, maintained at a `200` weight for a delicate, custom-designed appearance.

## Layout & Spacing
The system follows a **12-column Fluid Grid** for the main content area, with a fixed sidebar for navigation.

- **Desktop:** 64px wide sidebar, 48px page margins, and 24px gutters.
- **Mobile:** Sidebar collapses to a bottom bar or hamburger menu; margins reduce to 16px.
- **Containers:** Content is grouped into "Glass Panels" that use `panel-padding` (24px) for internal breathing room. 
- **Rhythm:** A 4px baseline grid governs all vertical spacing, with `stack-md` (16px) being the default vertical gap for related items.

## Elevation & Depth
Depth is created through **Stacking and Blurring** rather than traditional heavy drop shadows.

- **Level 0 (Background):** Base gradient layer.
- **Level 1 (Panels):** `surface-glass` with a `1px` white top border (`lume-border`) to simulate light catching the edge of a glass pane.
- **Level 2 (Active States/Modals):** High-diffusion "2xl" shadows (`shadow-black/[0.02]`) applied to panels to lift them slightly during interaction.
- **Level 3 (Navigation):** Fixed headers and sidebars use the highest blur (`backdrop-blur-3xl`) to remain distinct from the scrolling content beneath.

## Shapes
The shape language is "Sophisticated Geometric." 

- **Containers:** Panels and cards use a `1rem` (16px) radius to soften the technical layout.
- **Interactive Elements:** Buttons and input fields use a **Full / Pill** radius to differentiate them from structural panels.
- **Branding/Small UI:** Logos and small icons use a tighter `0.25rem` (4px) radius for a sharper, more professional look.

## Components
- **Buttons:** Primary buttons are either pure black or `surface-glass-dark`. They use a pill shape, uppercase label-caps, and a slight scale-up transition on hover.
- **Glass Cards:** Must include a `1px` translucent border and a `lume-border` on the top edge. 
- **Badges/Chips:** Small, bold, uppercase text inside highly desaturated semantic backgrounds (e.g., 5% opacity blue for "Interview").
- **Application Feed Items:** Horizontal rows with a left-accent border (`4px`) to denote selection. Hover states should include a subtle horizontal translation (`translate-x-1`).
- **Input Fields:** Search bars and text inputs use a translucent background (`white/5`) and pill-shaped borders to blend into the glass header.
- **Vertical Timeline:** Uses a thin `1px` line with `8px` dot markers to represent activity logs without adding visual weight.