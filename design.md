# Design System Inspired by Mumbul Arena

## 1. Visual Theme & Atmosphere

Mumbul Arena's design system embodies a **premium, high-energy sports complex identity** with a sophisticated dark atmosphere enhanced by vibrant accent colors. The visual personality combines modern athleticism with welcoming energy, targeting sports enthusiasts, gamers, and fitness professionals. Deep charcoal backgrounds create contrast for bold orange and cyan accents, while geometric precision and substantial whitespace convey professionalism and premium positioning. The overall mood is confident, dynamic, and aspirational—reflecting world-class facilities in a contemporary, digital-first environment.

**Key Characteristics**

- Dark, premium backdrop (near-black backgrounds with subtle depth)
- Bold orange accent for primary CTAs and brand emphasis
- Cyan/sky blue for secondary interactive states and facility highlights
- High contrast text for accessibility and impact
- Clean, modern geometric spacing with generous whitespace
- Energetic yet professional tone in messaging and layout
- Sports-focused imagery integrated seamlessly with UI
- Responsive, touch-friendly interactive elements

## 2. Color Palette & Roles

### Primary

- **Primary CTA** (`#F97316`): Orange accent used for primary call-to-action buttons ("Book Now", "Book Your Slot"), high-visibility elements, and brand highlights. Primary action driver across all interfaces.
- **Primary Brand** (`#0EA5E9`): Sky blue for secondary CTAs ("Explore Facilities"), informational elements, and facility highlights. Creates visual hierarchy with orange.

### Accent Colors

- **Success State** (`#22C55E`): Bright green for status indicators, availability badges ("Available", "Right Now"), and positive confirmations. High visibility for affirmative states.
- **Accent Muted** (`#4ADE80`): Lighter green for supporting success states, tags, and secondary success indicators. Used for "Futsal" and sports category badges.
- **Tertiary Brand** (`#0C4A6E`): Deep navy blue for text, headers, and brand reinforcement. Premium, sophisticated dark blue tone.

### Interactive

- **Error/Alert** (`#EF4444`): Vibrant red for error states, warnings, and destructive actions. Reserved for critical user feedback.
- **Error Muted** (`#F87171`): Lighter red for secondary error indicators and hover states on error elements.

### Neutral Scale

- **Text Primary** (`#FFFFFF`): Pure white for primary body text and headlines on dark backgrounds. Maximum contrast and readability.
- **Text Secondary** (`#9CA3AF`): Medium gray for secondary text, metadata, and subtle informational content. Reduced emphasis.
- **Text Tertiary** (`#6B7280`): Darker gray for captions, helper text, and de-emphasized labels.
- **Text Muted** (`#D1D5DB`): Light gray-white for disabled states, placeholders, and low-priority information.

### Surface & Borders

- **Surface Dark** (`#161616`): Near-black background for cards, inputs, and elevated surfaces. Primary container color throughout UI.
- **Surface Darker** (`#0C0C0C`): Deep black for base page background, creating depth and hierarchy.
- **Border Subtle** (`#E5E7EB`): Light gray for input borders and subtle dividers (used with opacity for glass-morphism effects).
- **Border Light** (`#F8FAFC`): Off-white for fine borders and negative space indicators.

### Semantic / Status

- **Availability** (`#22C55E`): Green checkmark and badge indicating immediate availability ("Right Now", "Available").
- **Disabled** (`#737373`): Dark gray for disabled or unavailable actions and placeholder text.

## 3. Typography Rules

### Font Family

**Primary: Space Grotesk** (sans-serif, geometric)
Fallback: `'Space Grotesk', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif`
Usage: Display, headings, brand-forward messaging

**Secondary: DM Sans** (sans-serif, humanist)
Fallback: `'DM Sans', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif`
Usage: Body text, buttons, navigation, inputs, fine typography

### Hierarchy

| Role         | Font          | Size | Weight | Line Height | Letter Spacing | Notes                                 |
| ------------ | ------------- | ---- | ------ | ----------- | -------------- | ------------------------------------- |
| Display/H1   | Space Grotesk | 72px | 400    | 72px        | 0px            | Hero headlines, page titles           |
| Heading/H2   | Space Grotesk | 60px | 700    | 60px        | 0px            | Major section headings                |
| Heading/H3   | Space Grotesk | 24px | 700    | 32px        | 0px            | Subsection headings, cards            |
| Heading/H4   | Space Grotesk | 18px | 700    | 28px        | 0px            | Small headings, labels                |
| Stat/Accent  | Space Grotesk | 20px | 700    | 28px        | 0px            | Large stats, feature numbers          |
| Body Text    | DM Sans       | 14px | 400    | 20px        | 0px            | Primary body copy, descriptive text   |
| Link/Action  | DM Sans       | 16px | 400    | 24px        | 0px            | Navigation links, inline actions      |
| Button/Label | DM Sans       | 14px | 700    | 20px        | 0px            | Button text, bold labels              |
| Caption      | DM Sans       | 14px | 400    | 20px        | 0px            | Supporting text, metadata, timestamps |
| Small Text   | DM Sans       | 12px | 500    | 16px        | 0px            | Helper text, minor UI labels          |

### Principles

- **Contrast-first**: All text achieves WCAG AA contrast (minimum 4.5:1) against backgrounds.
- **Weight hierarchy**: Use 400/500 for body, 700 for emphasis and interactive elements.
- **Spacing consistency**: Line height proportional to size (typically 1.0–1.5x); letter spacing remains 0 for modern geometric feel.
- **Display scale**: Large headings (60–72px) establish hierarchy; use sparingly for impact.
- **Geometric sans throughout**: Space Grotesk for brand moments; DM Sans for utility and accessibility.

## 4. Component Stylings

### Buttons

#### Primary Button

- **Background**: `#F97316` (Orange)
- **Text Color**: `#FFFFFF`
- **Font**: DM Sans, 14px, 700 weight
- **Padding**: `12px 28px`
- **Border Radius**: `12px`
- **Border**: None
- **Line Height**: `20px`
- **Height**: `44px`
- **Hover State**: `background-color: #EA580C` (darker orange), `box-shadow: 0px 4px 12px rgba(249, 115, 22, 0.3)`
- **Active State**: `background-color: #DC4C04`
- **Disabled State**: `background-color: #6B7280`, `cursor: not-allowed`, `opacity: 0.5`

#### Secondary Button

- **Background**: `#0EA5E9` (Cyan)
- **Text Color**: `#FFFFFF`
- **Font**: DM Sans, 14px, 700 weight
- **Padding**: `12px 28px`
- **Border Radius**: `12px`
- **Border**: None
- **Line Height**: `20px`
- **Height**: `44px`
- **Hover State**: `background-color: #0284C7`, `box-shadow: 0px 4px 12px rgba(14, 165, 233, 0.3)`
- **Active State**: `background-color: #0369A1`
- **Disabled State**: `background-color: #6B7280`, `opacity: 0.5`

#### Ghost Button

- **Background**: `transparent`
- **Text Color**: `#D1D5DB` (Light Gray)
- **Font**: DM Sans, 16px, 400 weight
- **Padding**: `8px 8px`
- **Border Radius**: `0px`
- **Border**: None
- **Line Height**: `24px`
- **Hover State**: `color: #FFFFFF`, `background-color: rgba(255, 255, 255, 0.1)`
- **Active State**: `color: #F97316`

### Cards & Containers

#### Facility Card

- **Background**: `#161616` (Dark Surface)
- **Text Color**: `#9CA3AF` (Secondary Gray)
- **Font**: DM Sans, 16px, 400 weight
- **Padding**: `0px`
- **Border Radius**: `16px`
- **Border**: None
- **Line Height**: `24px`
- **Box Shadow**: `0px 25px 50px -12px rgba(0, 0, 0, 0.25)`
- **Image Overlay**: Rounded corners with facility badge (e.g., "2 Courts", "1 Studio") positioned top-right in bold text
- **Hover State**: `transform: translateY(-4px)`, `box-shadow: 0px 30px 60px -12px rgba(0, 0, 0, 0.4)`

#### Pricing Card

- **Background**: `#161616`
- **Text Color**: `#FFFFFF` (Primary text), `#9CA3AF` (Secondary text)
- **Border Radius**: `12px`
- **Padding**: `24px`
- **Box Shadow**: `0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)`
- **Price Font**: Space Grotesk, 20px, 700 weight, `#FFFFFF`
- **Label Font**: DM Sans, 14px, 400 weight, `#9CA3AF`
- **Badge**: `#F97316` background, white text, `12px` padding, `8px` border-radius for "Starting from" labels

#### Quick Availability Card (Right-side Widget)

- **Background**: `#161616` with subtle border `1px solid rgba(255, 255, 255, 0.1)`
- **Border Radius**: `16px`
- **Padding**: `24px`
- **Title Font**: Space Grotesk, 24px, 700 weight, `#FFFFFF`
- **Description Font**: DM Sans, 14px, 400 weight, `#9CA3AF`
- **Status Badge**: Green background `#22C55E`, white text, `12px` padding, `8px` border-radius
- **Sport Tags**: Outline style with border `1px solid rgba(255, 255, 255, 0.2)`, text `#F97316` or `#0EA5E9`, `12px` padding, `8px` border-radius

### Inputs & Forms

#### Text Input

- **Background**: `#161616`
- **Text Color**: `#FFFFFF`
- **Font**: DM Sans, 16px, 400 weight
- **Padding**: `12px 16px`
- **Border Radius**: `12px`
- **Border**: `1px solid rgba(255, 255, 255, 0.1)`
- **Line Height**: `24px`
- **Placeholder Color**: `#737373`
- **Focus State**: `border-color: #0EA5E9`, `box-shadow: 0px 0px 0px 3px rgba(14, 165, 233, 0.1)`
- **Error State**: `border-color: #EF4444`, `box-shadow: 0px 0px 0px 3px rgba(239, 68, 68, 0.1)`

#### Select / Dropdown

- **Background**: `#161616`
- **Text Color**: `#FFFFFF`
- **Font**: DM Sans, 16px, 400 weight
- **Padding**: `12px 16px`
- **Border Radius**: `12px`
- **Border**: `1px solid rgba(255, 255, 255, 0.1)`
- **Line Height**: `24px`
- **Arrow Icon**: `#9CA3AF`, right-aligned
- **Focus State**: `border-color: #0EA5E9`, `box-shadow: 0px 0px 0px 3px rgba(14, 165, 233, 0.1)`

#### Checkbox / Radio

- **Size**: `20px × 20px`
- **Border Radius**: Checkbox `4px`, Radio `50%`
- **Border**: `2px solid rgba(255, 255, 255, 0.2)`
- **Background (Unchecked)**: Transparent
- **Background (Checked)**: `#22C55E`
- **Checkmark Color**: `#FFFFFF`
- **Focus State**: `box-shadow: 0px 0px 0px 3px rgba(14, 165, 233, 0.2)`

### Navigation

#### Header Navigation

- **Background**: `rgba(0, 0, 0, 0.95)` (Near-black with transparency)
- **Height**: `80px`
- **Padding**: `0px 48px`
- **Box Shadow**: `0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)`
- **Logo Font**: Space Grotesk, 18px, 700 weight, `#FFFFFF`
- **Logo Subtitle**: DM Sans, 12px, 400 weight, `#F97316`
- **Nav Link Font**: DM Sans, 16px, 400 weight, `#F8FAFC`
- **Nav Link Hover**: `color: #F97316`, `border-bottom: 2px solid #F97316`
- **Active Link**: `color: #F97316`, `border-bottom: 2px solid #F97316`
- **Language Selector Font**: DM Sans, 14px, 500 weight, `#D1D5DB`
- **CTA Button**: See Primary Button styling above

#### Badge / Tag (Sport Category)

- **Background**: Transparent or `rgba(255, 255, 255, 0.05)`
- **Border**: `1px solid rgba(255, 255, 255, 0.2)`
- **Text Color**: `#F97316` (Futsal, Basketball) or `#22C55E` (Badminton)
- **Font**: DM Sans, 14px, 500 weight
- **Padding**: `8px 16px`
- **Border Radius**: `8px`
- **Hover State**: `border-color: rgba(255, 255, 255, 0.4)`, `background-color: rgba(255, 255, 255, 0.08)`

## 5. Layout Principles

### Spacing System

**Base Unit**: `4px`

**Scale**:

- `4px` — Minimal internal gaps, micro-interactions
- `8px` — Tight component spacing
- `12px` — Padding within small components, input padding (horizontal)
- `16px` — Standard gap, form field spacing
- `20px` — Card internal padding
- `24px` — Section padding, moderate spacing
- `28px` — Button padding (horizontal)
- `32px` — Large component padding
- `40px` — Section gap
- `56px` — Vertical rhythm, feature section spacing
- `64px` — Major section spacing
- `80px` — Hero spacing, full-screen sections

**Usage Context**:

- Micro interactions (ripples, micro-spacing): `4–8px`
- Form inputs and tight layouts: `12–16px`
- Card and component internals: `20–24px`
- Section and layout spacing: `40–80px`

### Grid & Container

- **Max Width**: `1440px` (full container width)
- **Column Strategy**: 12-column grid for large screens; 6-column for tablet; 4-column for mobile
- **Gutter**: `16px` on each side, `16px` between columns
- **Margin**: `48px` horizontal padding for large screens; `24px` for tablet; `16px` for mobile
- **Section Pattern**: Hero (full-width), Content Section (max-width container), Feature Grid (responsive columns)
- **Container Breakpoint Shifts**: Max-width 1200px at 1024px, 100% with margin at 768px and below

### Whitespace Philosophy

Generous whitespace establishes premium positioning and clarity. Spacing increases vertically for breathing room between major sections. Asymmetric spacing is used strategically (e.g., tighter top padding on cards, wider bottom margin before next section). Text-heavy areas receive extra spacing for legibility. Interactive elements maintain 44px minimum touch targets with adequate margin around them.

### Border Radius Scale

- **`8px`** — Small tags, badges, secondary UI elements
- **`12px`** — Buttons, inputs, small cards, modals
- **`16px`** — Medium cards, facility cards, component containers
- **`24px`** — Large cards, hero image containers, prominent sections
- **`0px`** — Navigation bar, full-width sections, dividers

## 6. Depth & Elevation

| Level          | Treatment                                                                     | Use                                                    |
| -------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------ |
| Flat (0)       | No shadow, solid background                                                   | Base surfaces, dividers, disabled elements             |
| Raised (sm)    | `0px 25px 50px -12px rgba(0, 0, 0, 0.25)`                                     | Facility cards, content cards floating over background |
| Elevated (md)  | `0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)` | Navigation header, modals, sticky elements             |
| Prominent (lg) | `0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)`  | Hover states on cards, dropdown menus, tooltips        |

**Shadow Philosophy**: Subtle shadows create visual hierarchy without overwhelming dark backgrounds. Shadows increase on interaction (hover/active states), signaling responsiveness. Elevation levels are restrained—only 3–4 distinct levels across the system. Shadows use black with varied opacity rather than custom colors, maintaining consistency and accessibility.

**Transparency Layer**: Surfaces use subtle transparency (`rgba(0, 0, 0, 0.95)`) for glass-morphism effects, particularly in navigation and modals, creating depth without additional shadows.

## 7. Do's and Don'ts

### Do

- **Use orange (`#F97316`) for all primary CTAs** — "Book Now", "Book Your Slot", main conversion actions. Ensures visual consistency.
- **Maintain minimum `44px` touch targets** on all interactive elements (buttons, links, form inputs) for mobile accessibility.
- **Apply generous spacing between sections** (`40–80px`) to create breathing room and premium feel.
- **Stack colors with purpose**: Orange + White for maximum impact; Cyan for secondary; Green for success states only.
- **Use Space Grotesk for headlines and stat blocks** to reinforce brand and draw attention to key information.
- **Combine dark backgrounds with high-contrast text** (`#FFFFFF` or `#F97316`) for accessibility and clarity.
- **Leverage whitespace in hero sections** to make headlines and CTAs command attention.
- **Test all interactive hover and focus states** — ensure visual feedback is clear and accessible.
- **Use semantic colors consistently**: Green = available/success, Red = error/alert, Cyan = secondary info.

### Don't

- **Don't use low-contrast text combinations** — avoid dark gray text on dark backgrounds or light text on light surfaces.
- **Don't mix competing accent colors** — stick to orange/cyan/green hierarchy; avoid random color variations.
- **Don't apply shadows heavily** — excessive shadows muddy the dark aesthetic; use sparingly for depth only.
- **Don't break the `44px` minimum touch target** — all buttons and clickable elements must meet WCAG AAA standards.
- **Don't use more than 3 font weights in a section** — 400 (regular), 700 (bold) are sufficient; avoid 500, 600 unless necessary.
- **Don't ignore padding balance** — maintain symmetrical padding in cards and containers unless asymmetry is intentional.
- **Don't override border-radius globally** — use the defined scale (`8px`, `12px`, `16px`, `24px`) to maintain consistency.
- **Don't apply gradients or complex overlays** — solid colors and subtle transparency preserve clarity and modern aesthetic.
- **Don't forget loading and error states** — every interactive element must communicate feedback clearly.

## 8. Responsive Behavior

### Breakpoints

| Name             | Width        | Key Changes                                                            |
| ---------------- | ------------ | ---------------------------------------------------------------------- |
| Large (Desktop)  | 1440px+      | Full 12-column grid, `48px` margins, max-width containers              |
| Medium (Tablet)  | 768px–1023px | 6-column grid, `24px` margins, reduced spacing                         |
| Small (Mobile)   | 320px–767px  | 4-column grid, `16px` margins, stacked layouts, `24px` section spacing |
| Extra Large (4K) | 1920px+      | Centered max-width container, increased whitespace                     |

### Touch Targets

- **Minimum Size**: `44px × 44px` for all interactive elements (buttons, links, form inputs, clickable cards)
- **Recommended Size**: `48px × 48px` for primary CTAs and frequent actions
- **Spacing**: Minimum `8px` margin between adjacent touch targets to prevent accidental selection
- **Mobile Optimization**: Buttons scale to `48–56px` on small screens; navigation items receive full-height touch zones

### Collapsing Strategy

**Large Screens (1440px+)**:

- Header: Horizontal navigation with language selector and CTA visible
- Hero: Full-width image with text overlay on left, stats row visible below
- Cards: 3-column grid for facilities
- Sidebar: Right-aligned availability widget

**Tablet (768px–1023px)**:

- Header: Hamburger menu, logo centered, CTA button visible
- Hero: Text and CTA stack over image, stats move below CTA
- Cards: 2-column grid; facility images scale proportionally
- Sidebar: Widget moves below main content or stays right with reduced width
- Spacing: `24px` section gaps, `20px` padding in containers

**Mobile (320px–767px)**:

- Header: Full-width hamburger menu, logo and CTA visible
- Hero: Full-width image background, text stacked, CTA full-width below text
- Cards: Single-column stack; facility images full-width with badges
- Sidebar: Widget full-width below facility grid
- Spacing: `16px` section gaps, `12px` padding, no horizontal margins except container
- Typography: H1 reduces to `48px`, H2 to `36px`, body remains `14px`
- Buttons: Full-width on mobile, `40px` min-height

**Sticky Navigation**: Header remains sticky at top on all breakpoints; `80px` on large, `64px` on mobile with reduced padding.

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA**: Orange (`#F97316`) — all "Book Now" and conversion buttons
- **Secondary Action**: Cyan (`#0EA5E9`) — "Explore Facilities" and secondary CTAs
- **Success / Availability**: Green (`#22C55E`) — availability badges, checkmarks
- **Background (Base)**: Near-black (`#0C0C0C`) — page background
- **Surface (Cards)**: Dark charcoal (`#161616`) — card and input backgrounds
- **Text (Primary)**: White (`#FFFFFF`) — main headlines and body on dark
- **Text (Secondary)**: Medium gray (`#9CA3AF`) — supporting text, metadata
- **Border / Input Border**: Light border (`rgba(255, 255, 255, 0.1)`) — form fields
- **Error**: Red (`#EF4444`) — error states and alerts
- **Accent Navy**: Deep blue (`#0C4A6E`) — brand reinforcement, premium tone

### Iteration Guide

1. **Always use `#F97316` for primary CTAs** — all conversion buttons and high-priority actions must use orange to maintain visual hierarchy.

2. **Maintain `44px` minimum height on all buttons and interactive elements** — ensure WCAG AAA touch target compliance across all breakpoints.

3. **Apply dark surface (`#161616`) to all cards and input backgrounds** — ensures consistent visual depth and contrast against page background.

4. **Use Space Grotesk exclusively for H1, H2, H3 headlines and stat numbers** — DM Sans for all body copy, buttons, links, and form labels.

5. **Set heading line heights equal to font size** — H1 `72px/72px`, H2 `60px/60px`, H3 `24px/32px` for tight, modern spacing.

6. **Apply box-shadow only on hover for cards and elevated elements** — use `0px 25px 50px -12px rgba(0, 0, 0, 0.25)` for baseline, increase to `0px 30px 60px -12px rgba(0, 0, 0, 0.4)` on hover.

7. **Use `16px` border-radius for facility cards and major containers** — `12px` for buttons and inputs, `8px` for tags and badges.

8. **Set section gap spacing to `40–64px` vertically** — creates premium breathing room and rhythm across pages.

9. **Combine high-contrast text with dark backgrounds** — white text on `#161616`/`#0C0C0C` achieves 12:1+ contrast ratio; use `#9CA3AF` only for secondary/metadata.

10. **Implement full-width mobile layouts with `16px` horizontal margins** — collapse 2–3 column grids to single column below `768px` breakpoint; reflow cards and widgets vertically.

11. **Default input border to `1px solid rgba(255, 255, 255, 0.1)` with focus state to `#0EA5E9`** — maintains subtle glass effect while providing clear interactive feedback.

12. **Use green (`#22C55E`) exclusively for success states and availability indicators** — never use for primary actions or general branding.
