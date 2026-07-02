# 13 — UI/UX Design System

The design system defines the visual language and component kit that every screen composes from. It is already partially implemented in `frontend/src`; this doc captures the tokens, components, and standards so the UI stays consistent as modules are built.

## Principles

- **Coordination over clutter.** Screens surface the next action, not every possible control. Empty states guide onboarding.
- **Role-aware, single shell.** One `AppLayout` (sidebar + top bar) adapts content by role rather than forking layouts (see [06 — IA](./06-information-architecture.md)).
- **Tokens first.** Components reference semantic tokens (`bg-canvas`, `text-fg`) so light/dark theming happens in one place.
- **AI is ambient.** Voice and recommendations appear inline where work happens, reachable from the top bar everywhere.

## Design tokens

Tokens are defined once in `src/index.css` (as CSS variables exposed to Tailwind) and mirrored into the MUI theme in `src/app/theme.ts`, so MUI surfaces and Tailwind utilities stay in sync.

### Color — light

| Token | Value | Use |
|-------|-------|-----|
| `canvas` | `#f8fafc` | Page background |
| `surface` | `#ffffff` | Cards, navbar, sidebar |
| `elevated` | `#f1f5f9` | Hover / subtle fills |
| `line` | `#e8ebf2` | Borders |
| `fg` | `#0f172a` | Primary text |
| `muted` | `#64748b` | Secondary text |
| `brand` | `#6c63ff` | Primary |
| `brand-2` | `#8b5cf6` | Secondary |
| `accent` | `#3ddc97` | Success / positive |

### Color — dark

| Token | Value |
|-------|-------|
| `canvas` | `#0c0a14` |
| `surface` | `#15121e` |
| `elevated` | `#1f1b2c` |
| `line` | `#2a2438` |
| `fg` | `#ece9f3` |
| `muted` | `#a59fb5` |
| `brand` | `#8b5cf6` |
| `brand-2` | `#a78bfa` |
| `accent` | `#3ddc97` |

> Dark mode is class-based: toggling `.dark` on `<html>` flips every token. Managed by `ThemeModeProvider`.

### Shape & type

| Token | Value |
|-------|-------|
| Radius | `16px` (`--radius`, MUI `shape.borderRadius`) |
| Font family | Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif |
| Buttons | `text-transform: none`, weight 600 |

## Component kit

Everything imports from `@/components/ui`. **Interactive components wrap MUI** (accessibility + behavior for free); **presentational components are Tailwind-native.**

| Component | Type | Notes |
|-----------|------|-------|
| `Button` (variants, sizes) | Interactive | Primary action element |
| `IconButton` | Interactive | Icon-only action, needs `aria-label` |
| `Input` | Interactive | Text field, integrates with React Hook Form |
| `Textarea` | Interactive | Multiline input |
| `Select` (with `SelectOption`) | Interactive | Dropdown |
| `Checkbox` | Interactive | Boolean input |
| `Switch` | Interactive | Toggle |
| `Avatar` | Presentational | User/entity image or initials |
| `Spinner` | Presentational | Loading state |
| `Tooltip` | Interactive | Hover/focus hint |
| `Modal` | Interactive | Focus-trapped dialog |
| `Card` | Presentational | Surface container |
| `Badge` (tones) | Presentational | Status/labels |
| `PageHeader` | Presentational | Consistent page title + actions |
| `EmptyState` | Presentational | Guided empty/onboarding states |

## Layout patterns

- **App shell:** `AppLayout` = persistent `Sidebar` (module nav) + `TopBar` (search, voice, notifications, profile) + routed content.
- **Page pattern:** every page opens with a `PageHeader` (title + primary actions), then content in `Card`s.
- **Dashboards:** grid of cards; the three dashboards (Admin / Manager / Employee) reuse the same card primitives with different data (see [04](./04-core-features-and-modules.md)).
- **Empty & loading:** `EmptyState` for no-data/onboarding; `Spinner` (and skeletons) for loading; error states use `Badge`/inline messaging.

## Accessibility standards

- **Keyboard:** all interactive elements are reachable and operable by keyboard; `Modal` traps focus and restores it on close.
- **Labels:** every `IconButton` and form control has an accessible name (`aria-label` / associated `<label>`).
- **Contrast:** token pairs (`fg` on `canvas`/`surface`, `brand-fg` on `brand`, `accent-fg` on `accent`) target WCAG AA contrast.
- **Motion:** Framer Motion animations respect `prefers-reduced-motion`.
- **Semantics:** use semantic HTML and MUI's built-in ARIA; don't reinvent behavior that MUI provides.
- **Voice as an alternative modality:** the Voice Assistant complements (never replaces) accessible UI controls.

> Full WCAG conformance requires manual testing with assistive technologies and expert review; these standards are the baseline, not a substitute for that validation.

## Contribution rules

- New UI primitives go in `components/ui` and are exported from its `index.ts`.
- Never hardcode raw colors in components — use tokens (`bg-surface`, `text-muted`, …).
- Prefer wrapping MUI for anything interactive; keep purely visual pieces Tailwind-native.
- Keep the MUI theme (`theme.ts`) and CSS tokens (`index.css`) in sync when adding tokens.

---

*Previous: [12 — API Specifications](./12-api-specifications.md) · Next: [14 — Roadmap](./14-roadmap.md)*
