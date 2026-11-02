---
name: web-ref-page-width
description: "Canon (web-ref-*) for page width in every hub: fill-in pages are capped, look-at pages are full width, from one token. Use when creating a page or choosing its wrapper; หน้ากว้างไป, ฟอร์มกว้างไป, จัดกลาง, page too wide, center the form, max-w on a page root, full width."
---

# Page width

Each hub keeps its token file and settled pages in `<hub>-ref-page-width`; a rule changes here, once.

## The rule

**Fill-in pages are capped; look-at pages are full width,** because wide data must not wrap inside a cap.

| Tier | Width | The page |
|---|---|---|
| Capped | `max-w-3xl`, centered | main content is fields the user edits: Add, Edit, a settings form |
| Full | no cap | shows data: record view, list, table, schedule, dashboard, log |

- **A view page stays full** even when it carries action buttons.
- **Unsure → full:** capping data hurts more than an uncapped form.
- **Both tiers come from one token;** never a hand-typed `max-w-*` or `mx-auto` on a page root, and no in-between width.
- **Governs pages in the app's sidebar shell.** A popup's width (`web-ref-popup`), a field's width, and a standalone card outside the shell (login, a public phone page) are other things.
