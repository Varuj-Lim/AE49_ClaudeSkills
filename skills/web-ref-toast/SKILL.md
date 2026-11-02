---
name: web-ref-toast
description: "Canon (web-ref-*) for the toast: bottom-right, one renderer, success 7 s, error until ×, a new toast replaces the old, Thai text; the 7-second test decides Toast or green box; a failed form save stays in the red box. Use for any success or failure message; กล่องเขียว, ข้อความหายเร็ว, แจ้งเตือนมุมขวาล่าง, show a toast, saved message."
---

# Toast

Each hub keeps its hook, renderer, looks and layers in its form-errors facts skill; a rule changes here, once.

## The rule

| Toast | Stays |
|---|---|
| Success | 7 seconds, then clears itself. One number, in one place |
| Error | until its × is pressed, no timer |

- **Bottom-right, one renderer.** Every page shows it through the hub's one component and hook, never a hand-rendered block.
- **A new toast replaces the shown one** and starts its own rule: a success after an error clears the error; an error after a success cancels that timer.
- **Thai text** per `web-ref-ui-language`; codes, names and column words stay English.
- **It stays above an open popup,** so an error's × can always be pressed (`web-ref-popup`).

## Toast or green box: the 7-second test

**If this message vanished in 7 seconds, would the user lose anything?**

- **No → Toast.** A confirmation that the action just done worked: one sentence, nothing further to read or do.
- **Yes → a green box where the action started,** staying until the user acts. It meets any one of:
  1. more than one line, or per-row detail;
  2. a link or a next step to click;
  3. an instruction to do something outside the screen ("check your mail").

Started on a page, the box is in that page. Started in a popup, it is in that popup or in the result popup that replaces it, closed only by the user, never by a timer. Nothing else decides it, not the page or the module, and a green box saying only "saved" is a defect.

## Toast or the red box

- **A failed save on a form stays in the red box** directly above Save (`web-ref-form-errors`), where the user is looking. A toast may also report it, never instead.
- **A toast is for an action with no form row of its own:** a row or bulk action, an import, a decision in a list.
