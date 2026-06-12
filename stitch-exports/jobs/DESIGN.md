---
name: Satin Precision
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
  on-surface-variant: '#46474a'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#76777b'
  outline-variant: '#c7c6ca'
  surface-tint: '#5f5e5f'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1c'
  on-primary-container: '#858384'
  inverse-primary: '#c8c6c7'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e3'
  primary-fixed-dim: '#c8c6c7'
  on-primary-fixed: '#1b1b1c'
  on-primary-fixed-variant: '#474647'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
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
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.2'
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
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  panel-padding: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is defined by a philosophy of "Atmospheric Minimalism." It targets high-end enterprise applications where clarity, prestige, and focus are paramount. The aesthetic moves away from standard flat white dashboards toward a multi-layered, tonal environment that feels physically constructed from premium materials like satin-finished glass and brushed metal.

The visual style is a hybrid of **Minimalism** and **Glassmorphism**, executed with extreme restraint. It evokes an emotional response of calm authority and technological sophistication. Every element is intentional; whitespace is treated as a structural component rather than a void. The "Apple-inspired" influence manifests in the subtle use of light—where surfaces don't just sit on top of each other but interact via translucency and hairline highlights.

## Colors

The palette is anchored in a cool-toned, "Mist Grey" foundation. Instead of pure white backgrounds, the system uses subtle shifts in grey and translucency to create depth.

- **Primary (Ink):** Used for primary actions, high-level headings, and critical focus states. It provides the "weight" to the otherwise airy UI.
- **Accents (Steel & Slate):** These muted blues are used sparingly for interactive cues and secondary information, ensuring the UI remains professional and understated.
- **Surface Strategy:** The background is `#F0F2F5`. Interactive panels use a semi-transparent white with a high-saturation backdrop blur (20px-40px) to create the "Satin Acrylic" effect.
- **State Colors:** Success, warning, and error states should be desaturated. Avoid vibrant "traffic light" colors; instead, use tinted slates and muted cherries to maintain the high-end feel.

## Typography

This design system utilizes **Inter** for its neutral, systematic clarity. The hierarchy is "Editorial," meaning large headings have tight tracking and significant weight, while small labels are uppercase with generous letter-spacing to create a sense of luxury and breathing room.

- **Headlines:** Should be set with slight negative letter-spacing to feel "locked" and precise.
- **Labels:** Use the `label-caps` style for section headers and table headers. The increased letter-spacing is a key differentiator of the premium aesthetic.
- **Body:** Standardized at 14px for density, but 16px for long-form reading. High line-heights are preferred to maintain the feeling of openness.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for core content to maintain a disciplined, "designed" look, while the background mist gradients remain fluid.

- **Desktop:** 12-column grid with wide 48px outer margins. This creates a "frame" around the content, increasing the perceived value.
- **Rhythm:** An 8px linear scale is used for most components, but a 4px "half-step" is permitted for tight technical data or compact metric tiles.
- **Reflow:** On mobile, panels should lose their side margins and span the full width to maximize screen real estate, while maintaining consistent vertical spacing.

## Elevation & Depth

Depth is not communicated through heavy shadows, but through **Tonal Stacking** and **Backdrop Blurs**.

1.  **Level 0 (Base):** Mist grey (`#F0F2F5`) with a very subtle linear gradient from top-left to bottom-right.
2.  **Level 1 (Panels):** Satin acrylic surfaces. Semi-transparent white (`rgba(255,255,255,0.7)`) with a 30px blur. 
3.  **The "Lume" Highlight:** Every panel must have a 1px top-border (inner stroke) of pure white at 40% opacity. This mimics how light hits the edge of a glass sheet.
4.  **Shadows:** Only use shadows for "floating" elements like dropdowns or modals. Use a "Diffuse Ambient" shadow: `0px 20px 40px rgba(0, 0, 0, 0.04)`.

## Shapes

The design system uses "Soft" geometry (`0.25rem` base). This avoids the "bubbly" look of consumer apps while being more approachable than a strictly sharp Brutalist style.

- **Base Radius:** 4px for buttons and small inputs.
- **Large Radius:** 8px (rounded-lg) for main content panels and cards.
- **Interactive Elements:** Maintain consistent corner radii across inputs and buttons to ensure a modular, "machined" appearance.

## Components

- **Glass Panels:** The core container. Must feature the `surface_glass` fill and the "Lume" top-edge highlight. No heavy dropshadows.
- **Buttons:** 
    - *Primary:* Solid Ink (`#1A1A1B`) with white text. 
    - *Secondary:* Ghost style with the hairline border and subtle hover fill.
- **Metric Tiles:** Compact, with the value in `headline-md` and the label in `label-caps` above it. These should be arranged in a tight grid.
- **Row-based Lists:** Minimalist rows separated by `border_hairline`. Interactive states should use a very subtle shift in background opacity (e.g., from 0.7 to 0.8) rather than a color change.
- **Status Pills:** Muted and flat. Use a light slate background with deep slate text. No high-contrast backgrounds for "Success" or "Error"—use subtle icons to convey meaning instead.
- **Inputs:** Ultra-minimal. Only a bottom border or a very light hairline wrap. On focus, the border transitions to the primary Ink color.
- **Icons:** 1.5px stroke weight. Avoid filled icons. Use "Thin Line" variants only.