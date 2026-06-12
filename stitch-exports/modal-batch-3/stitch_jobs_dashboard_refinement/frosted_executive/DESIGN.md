---
name: Frosted Executive
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
  on-surface-variant: '#45474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e71'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#141b2c'
  on-primary-container: '#7c8498'
  inverse-primary: '#bfc6dc'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0d1c2d'
  on-tertiary-container: '#768599'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe2f9'
  primary-fixed-dim: '#bfc6dc'
  on-primary-fixed: '#141b2c'
  on-primary-fixed-variant: '#3f4759'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#d4e4fa'
  tertiary-fixed-dim: '#b9c8de'
  on-tertiary-fixed: '#0d1c2d'
  on-tertiary-fixed-variant: '#39485a'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: -0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 40px
  gutter: 24px
  section-padding: 64px
  element-gap: 16px
---

## Brand & Style
The design system is engineered for high-stakes executive environments where clarity, prestige, and focus are paramount. It adopts a **Luminous Glassmorphism** style, drawing inspiration from high-end aerospace interfaces and premium OS system sheets. 

The aesthetic is characterized by extreme translucency, heavy backdrop blurs, and a "light-from-within" quality. It avoids traditional solid containers in favor of layered crystalline surfaces that maintain a sense of depth and spatial awareness. The emotional response is one of calm authority—a workspace that feels both technologically advanced and physically tangible.

## Colors
The palette is rooted in a sophisticated silver-grey foundation (#F2F4F7) that mimics the finish of brushed aluminum. 

- **Primary:** A deep charcoal (#101828) used sparingly for high-contrast elements and primary actions to anchor the ethereal interface.
- **Surface:** The "Crystal White" glass effect is achieved using semi-transparent white with a 20px to 40px backdrop blur, ensuring legibility over dynamic backgrounds.
- **Accents:** Soft Indigo and Silver-Blue are used as "luminous highlights"—appearing more like light leaks or glows rather than flat fills.
- **Borders:** 1px hairline strokes using `rgba(255, 255, 255, 0.4)` on the top/left edges and `rgba(16, 24, 40, 0.05)` on the bottom/right to simulate physical beveling.

## Typography
The system utilizes **Inter** exclusively, leaning on its precision and variable weight capabilities. To achieve the "Executive" look, tracking (letter-spacing) is tightened on large displays to feel more cohesive and slightly expanded on small labels for crystalline clarity.

Hierarchy is established through weight shifts rather than drastic size changes. Body text maintains a generous line height (1.6) to ensure the interface feels airy. Label styles often utilize uppercase with slight letter spacing to act as structural markers within the layout.

## Layout & Spacing
This design system employs a **Fixed-Fluid Hybrid** layout. The core content container follows a 12-column grid with wide 40px margins to prevent "edge-crowding" on large monitors. 

Spacing is based on a 4px baseline, but emphasizes large, "breathable" gaps between sections (64px+) to reinforce the luxury positioning. Elements within glass cards are grouped tightly (16px) to maintain their relationship as a single "sheet" or "object." On mobile, margins compress to 20px, and vertical stacking is strictly enforced with increased guttering to prevent tactile errors.

## Elevation & Depth
Depth is the defining characteristic of this design system. It moves away from simple drop shadows in favor of **Multi-layered Diffusion Shadows**:
1.  **Ambient Layer:** A very large, 10% opacity shadow with a 60px blur to ground the element.
2.  **Object Layer:** A tighter, 5% opacity shadow to define the physical edges.
3.  **Backdrop Blur:** A constant `backdrop-filter: blur(25px)` applied to all elevated surfaces.

Surfaces do not just sit "on top" of each other; they filter the layers beneath them. Higher elevation levels (e.g., modals) increase the blur intensity and surface opacity to 80% to create a distinct visual "step" toward the user.

## Shapes
The shape language is refined and consistent. A **roundedness level of 2 (0.5rem)** is the standard for base components like input fields and small cards. Larger container sheets and primary modals scale up to `rounded-xl` (1.5rem) to evoke the soft, machined corners of premium hardware.

Avoid sharp 90-degree corners entirely, as they break the organic "frosted" metaphor. Icons should follow a similar radius pattern, using "Medium" corner smoothing where possible.

## Components
- **Buttons:** 
  - *Primary:* Dark Charcoal (#101828) with a subtle 1px white inner-top border (0.1 opacity) to create a "glint." 
  - *Secondary:* High-gloss white (0.9 opacity) with a 1px silver border and charcoal text.
- **Input Fields:** These are "recessed" into the glass surfaces. Use a subtle `inset` shadow and a background color slightly darker than the parent surface. The focus state should illuminate the border with a soft indigo glow.
- **Glass Chips:** Small, highly translucent badges with a 1px border. No fill, only a blur effect and 70% opacity text.
- **Cards:** The primary organizational unit. Must have the 1px white hairline border and a 20px backdrop blur. 
- **System Sheets:** For side panels or drawers, use a full-height glass panel that slides in from the right, intensifying the blur of the content beneath it to focus the user's attention.
- **Progress Indicators:** Use thin, glowing indigo lines rather than thick bars to maintain the sophisticated aesthetic.