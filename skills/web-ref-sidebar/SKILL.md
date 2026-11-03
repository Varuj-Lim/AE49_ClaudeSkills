---
name: web-ref-sidebar
description: Canon (web-ref-*) for a hub Sidebar's top row - the logo and the collapse button only, no text beside or under the logo; the logo's size is set once in the shared logo component, never at a call site. Use for the Sidebar header, logo size or word next to the logo; โลโก้ใหญ่ไป, เอาคำว่า Hub ออก, หัว Sidebar.
---

# web-ref-sidebar — the Sidebar's top row

**Owner ruling 2026-11-03** (AWDC_Hub Q7 a, *"ดูดีเลยทำกติกาได้เลยนะ"*; moved to user level the same day:
the rule was first written into the project skill `awdchub-ref-sidebar` by mistake).

## The rule

1. **The top row holds the logo and the collapse button, nothing else.** No product name, no "Hub", no word
   beside or under the logo. A small footer line at the BOTTOM of the Sidebar (e.g. "<Hub> · internal") is not
   the top row and is not covered.
2. **The logo's size lives in ONE place:** the hub's shared logo component (its size presets). A call site
   passes a preset name, never a pixel height or a width class of its own. A size change is made there.
3. **The height is chosen by eye for THIS wordmark, never copied from a sibling hub.** A wide wordmark needs a
   smaller height than a squarer one to look the same size: AWDC's wordmark (about 3.8 : 1) looked too big at the
   sibling hub's 34 px and was ruled at 26 px. The width follows from the artwork's own ratio; never stretch it.
4. **The logo links to the hub's Home**, with an accessible name ("Go to Home").

## Where the facts live

Each hub's own sidebar skill (`<hub>-ref-sidebar`) records the chosen height, the component and preset name,
and the footer wording. This canon holds only the rule; never put a hub's pixel value here.

## Checking it

A project audit's sidebar / nav topic checks: no text node in the Sidebar's header row other than the logo's
alt text and the collapse button's label; the logo rendered through the shared component with a preset; no
`h-[…]` / `w-[…]` on the logo at its call site.
