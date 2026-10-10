---
name: Neo-Tokyo Cyberpunk Festival System
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393f'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1a1b21'
  surface-container: '#1e1f25'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  on-surface: '#e3e1e9'
  on-surface-variant: '#e9bcb6'
  inverse-surface: '#e3e1e9'
  inverse-on-surface: '#2f3036'
  outline: '#af8782'
  outline-variant: '#5e3f3b'
  surface-tint: '#ffb4aa'
  primary: '#ffb4aa'
  on-primary: '#690003'
  primary-container: '#e50914'
  on-primary-container: '#fff7f6'
  inverse-primary: '#c0000c'
  secondary: '#d3fbff'
  on-secondary: '#00363a'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#ffade6'
  on-tertiary: '#5e0051'
  tertiary-container: '#c62cad'
  on-tertiary-container: '#fff6f8'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930007'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#ffd7ef'
  tertiary-fixed-dim: '#ffade6'
  on-tertiary-fixed: '#3a0032'
  on-tertiary-fixed-variant: '#850074'
  background: '#121318'
  on-background: '#e3e1e9'
  surface-variant: '#34343a'
typography:
  display-xl:
    fontFamily: Anybody
    fontSize: 72px
    fontWeight: '900'
    lineHeight: 76px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Anybody
    fontSize: 44px
    fontWeight: '900'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Anybody
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 46px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Anybody
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Anybody
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Space Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-lg:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.18em
  label-md:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.22em
  label-sm:
    fontFamily: Space Mono
    fontSize: 9px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.25em
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system establishes a high-octane, visceral cyber-athletic visual language directly informed by rain-slicked metropolis skylines, neon luminescence, and competitive esports engineering. The aesthetic marries raw brutalist geometry with high-contrast variable display kinetics, evoking high adrenaline, technological dominance, and cinematic tension.

The design movement blends **Cyberpunk Brutalism** with **Telemetry Display UI**:
- **Zero-Tolerance Geometries**: Zero rounded corners (`radius: 0`), 45-degree chamfer cuts, and precision mechanical framing eliminate decorative softness.
- **Atmospheric High-Contrast**: Void blacks and stormy obsidian surfaces juxtaposed against laser crimson surges and electric cyan back-reflections.
- **Cinematic Urgency**: Wide tracking on technical metadata combined with monumental, hyper-kinetic display titles ensures every viewport functions like a command console or live competitive arena broadcast.

## Colors

The color palette translates the visual tension of neon-soaked midnight rain into structured digital interface tiers:

- **Primary (`#E50914`)**: Laser Crimson. Reserved for high-priority calls to action, active competition states, critical alerts, and kinetic focal titles.
- **Secondary (`#00F0FF`)**: Electric Cyan. Used for counter-glow accents, secondary interactive targets, status indicators, and telemetry data overlays.
- **Tertiary (`#B5179E`)**: Neon Violet. Represents ambient atmospheric shifts, holographic highlights, and subtle gradient underlays.
- **Neutrals**:
  - `Void Black` (`#07080D`): Absolute canvas background representing deep stormy skies.
  - `Obsidian Surface` (`#0B0D14`): Base container background for structural cards.
  - `Sub-Surface Slate` (`#10131D`): Elevated panels, input backgrounds, and structural borders.
  - `Platinum Crisp` (`#FFFFFF` & `#E2E8F0`): Primary and secondary textual readouts for absolute contrast and legibility against deep dark matrices.

## Typography

The typographic hierarchy creates a deliberate tension between hyper-expressive variable headline scaling and rigid, calibrated computational data readouts:

- **Display & Headlines (`Anybody`)**: Rendered in uppercase or tight tracked forms with condensed/extended weight flexibilities. Utilizes heavy weights (700-900) to project athletic power, aggressive slashes, and industrial strength.
- **Body & Telemetry (`Space Mono`)**: Provides strict structural legibility. The fixed-width rhythm enforces an authentic terminal and tournament operations aesthetic. All metadata, technical tags, and timestamps rely on wide tracking (`0.18em` to `0.25em`) and uppercase formatting.

## Layout & Spacing

The layout is built upon a rigid 12-column cybernetic fluid grid on desktop, shifting to a 6-column grid on tablet and a 4-column system on mobile devices.

- **Grid Discipline**: Elements lock directly to hard boundaries. Gaps and gutters remain unsoftened to mimic modular combat hulls and terminal monitors.
- **Rhythm**: Density is deliberate. Telemetry data modules and spec tables utilize dense vertical increments (`space-xs` and `space-sm`), while hero announcements, tournament schedules, and media cards utilize expansive negative space (`space-xl` and `space-2xl`) to evoke cinematic metropolis scale.

## Elevation & Depth

Visual hierarchy does not rely on traditional diffuse drop shadows. Instead, depth is achieved through **Dual-Tone Luminescent Edge Accents and High-Contrast Tonal Stacking**:

1. **Surface Tiers**:
   - Level 0 (Ground Canvas): Deepest storm black `#07080D`.
   - Level 1 (Card Matrix): `#0B0D14` with a 1px border of `#1A2030`.
   - Level 2 (Active/Hover): `#10131D` framed by sharp linear gradient borders transitioning from `#E50914` to `#00F0FF`.
2. **Neon Back-Radiation**: Interactive highlights project intense, tight directional glows (`0 0 16px rgba(229, 9, 20, 0.45)` or `0 0 16px rgba(0, 240, 255, 0.4)`).
3. **Scanline & Reflection Overlays**: Micro-mesh background textures and horizontal linear scanlines at 3% opacity provide tactile screen depth across primary surfaces.

## Shapes

All UI components enforce absolute angular rigidity:
- **Zero Radius (`roundedness: 0`)**: No curved corners are permitted across the system. 
- **Chamfer Angles**: Key display cards, master badges, and primary action buttons utilize CSS clip-path bevels (e.g., 45-degree corner notches measuring `8px` to `12px`) to evoke angular cyber-armor plates and tournament stage rigging.
- **Dividers & Wireframes**: Structural hairline rules (1px) establish modular framing without clutter.

## Components

### Buttons
- **Primary Action**: Sharp rectangular container (`radius: 0`) or 8px chamfered edge. Background `#E50914`, text `#FFFFFF` in uppercase `Space Mono` bold. Hover triggers an inverted state (`#FFFFFF` background, `#07080D` text) with a neon crimson under-glow.
- **Secondary Cyber Action**: Transparent fill with a 1px `#00F0FF` border, text `#00F0FF`. Hover fills the background with `rgba(0, 240, 255, 0.12)` accompanied by subtle cyan terminal tracking.
- **Telemetry Ghost**: Borderless `#10131D` background with razor-thin white technical crosshairs flanking the label.

### Cards & Panels
- **Structure**: Rendered in `#0B0D14` with a 1px solid border in `#181E2E`. 
- **Corner Accents**: Cards feature four-corner target reticles or top-right angled cuts. 
- **Header Badges**: Monospaced status ribbons pinned to the top border with wide-tracked letter spacing.

### Inputs & Form Fields
- Sharp, monolithic text fields with `#07080D` backgrounds and 1px `#1A2030` bounding strokes.
- Active focus transitions the border to `#E50914` with an instantaneous left-aligned vertical indicator bar (3px width). Monospaced placeholder text in `#6B7280`.

### Chips & Badges
- Strict rectangular tags featuring monospace telemetry codes (`SYS:LIVE`, `MATCH:01`, `STAGE:FINALS`).
- State-driven styling: Red neon for active/live matches, cyan neon for upcoming qualifiers, and muted slate for standby modules.

### Checkboxes & Radio Controls
- **Checkbox**: Exact square (16px x 16px) with an obsidian fill and a 1px crisp border. Selected state fills with `#E50914` holding a crisp diagonal crosshair graphic.
- **Radio**: Diamond-rotated square (45-degree angle) instead of circular shapes, filling with `#00F0FF` on active selection to maintain uncompromising geometric edge logic.