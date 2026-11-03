---
name: web-ref-sidebar
description: Canon (web-ref-*) for a hub Sidebar's top row - the logo and the collapse button only, no text beside or under the logo; the logo fits a 98 x 34 px box, its size set once in the shared logo component, never at a call site. Use for the Sidebar header, logo size or word next to the logo; โลโก้ใหญ่ไป, เอาคำว่า Hub ออก, หัว Sidebar.
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
3. **The logo fits a box of 98 px wide by 34 px tall, keeping its own ratio (owner 2026-11-03 Q8 a).** It is as
   large as the box allows: a wide wordmark reaches 98 px wide first, a squarer one reaches 34 px tall first. Never
   stretch it, never a fixed height alone. Why a box: the two hubs the owner liked were both about 96–98 px wide,
   while their heights differed (AWDC about 3.8 : 1 → 98 × 26; CCP about 2.8 : 1 → 96 × 34); AWDC at a fixed 34 px
   came out about 130 px wide and looked too big.
4. **The logo links to the hub's Home**, with an accessible name ("Go to Home").

## Where the facts live

Each hub's own sidebar skill (`<hub>-ref-sidebar`) records the logo's size inside the box, the component and
preset name, and the footer wording. The hubs named above are the examples behind the box, not their facts.

## Checking it

A project audit's sidebar / nav topic checks: no text node in the Sidebar's header row other than the logo's
alt text and the collapse button's label; the logo rendered through the shared component with a preset, within 98 × 34 px and touching one side of it; no
`h-[…]` / `w-[…]` on the logo at its call site.
