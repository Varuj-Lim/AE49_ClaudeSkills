---
name: web-ref-form-errors
description: "Canon (web-ref-*) for form fields and wrong values: one input and label token, required mark, noValidate, no steppers; a wrong field gets a RED FRAME and the box above Save says why, always both. Use for any form, input, validation, setError or editable grid; กรอบแดง, ช่องไหนผิด, ช่องบังคับ, make this field red, show an error."
---

# Form fields and errors: the field, the red frame, the box

Each hub keeps its facts (token files, components, consumers) in its own `<hub>-ref-form-errors`; a rule changes here, once. A summary says
WHAT is wrong, the highlight says WHERE, and either alone makes the reader hunt. Save-time refusals turn fields red too.

## The field

- **One input token.** Every box derives from the hub's one input class, never a hand-typed copy; a copy silently opts out of the next ruling.
- **One label token,** the same way.
- **The red frame is a function** on the input token: it swaps the border and focus colors rather than appending, because two border utilities resolve by stylesheet order. It keeps the box's size and stays red while focused.
- **A required field shows the hub's shared required mark** after its label, never a typed `*`: mark a field when leaving it empty blocks Save, not an optional field or a control holding a valid default.
- **Every `<form>` carries `noValidate`.** No browser bubble and no `required` attribute; every check runs in the app and speaks through the box.
- **No stepper arrows** on a number box, removed once at the token.
- **A custom control** (picker, date button) takes the same frame on its trigger and, since it cannot carry `required`, a check in the submit handler.

## The rule

A wrong field shows BOTH:

1. **A red frame on the field**, from the project's one shared token, never a hand-typed border.
2. **The sentence in the one box directly above the Save row**, in Thai per `web-ref-ui-language`. A row that saves itself (its own Save button inside a bigger form or popup) has its box directly under that row instead.

## When the frame shows

| The field | Red when | Clears when |
|---|---|---|
| Holds a WRONG value (letters in a number box, a bad format, out of range, a duplicate the page already knows) | At once, while the value is wrong. A value that could still become right while it is being typed (a lone `-`) waits until the box is left | The value is right |
| Required and EMPTY | Only after Save was refused on this form. A fresh form never opens red | The field is filled |
| Refused only by the server or a transaction (a clash found at Save) | After that refusal, when the refusal names the field | The field changes |

- **A refused press of the leave popup also paints the page behind it (owner 2026-11-01):** the page's own red frames and its box show once the popup closes. Only a page with a reason of its own paints; a wait for its own write does not.
- **When a wrong value's sentence enters the box (owner 2026-10-31):** on a form, at once, with its frame. On an editable
  grid, at Save, with the sentence on the cell's hover until then: a grid of hundreds of cells must not move the page
  while someone types or pastes.
- **A refusal that involves two fields frames every field involved (owner 2026-10-31 OQ-4 b):** price and fee, both password
  boxes, width and length. A wrong login frames both email and password, and its sentence still does not say which (OQ-3 b).
- **Many required fields are one sentence (owner 2026-10-31):** `ต้องกรอกให้ครบ: Full Name, Nickname, Gender`, never a line per field. The frames say where.
- **When a sentence leaves (owner 2026-10-31):** a field's sentence leaves at once when the field is right. A failed save stays until the next outcome. An editable grid's box keeps the lifetime its project already ruled.
- **An Edit that opens holding a value Save would refuse opens red (owner 2026-10-31).** The frame comes from the same check as the refusal.
- **The leave popup's Save is not disabled either (owner 2026-10-31):** it refuses with the sentence and the popup stays open with the work kept. A page that cannot save from the popup at all shows no Save button, only Cancel and Discard with the sentence (owner Q32 a).
- **Password pages (owner 2026-10-31):** forgot password, reset password and first-login follow this canon, with no change to auth and no hint whether an email exists.
- **Converting an existing app (owner 2026-10-31):** the shared check first, then one pilot page the owner tries, then the page groups.
- A field that went red after being left stays red when it is entered again, until its value is right. A field never left stays plain.
- **The Save click must land the first time (owner 2026-10-31):** a field left because the pointer was pressed shows its frame and sentence when the pointer is released, so the Save row does not move under the click. Leaving by keyboard shows them at once.
- A refusal that belongs to no one field (a failed save, a lost connection) stays in the box alone.
- Save is never disabled to prevent an error: it refuses and explains.
- An Edit that judges only what changed frames only what it would refuse. An untouched stored value stays plain.
- An editable grid frames the cell. The box names the row, and the cell may repeat the sentence on hover.

## Don't

- Don't frame a field that Save would accept, or leave a refused field plain. The frame and the refusal come from
  the same check, so they cannot disagree.
- Don't replace the box with frames alone: a frame cannot say why, and the field may be off screen.
- Don't use the frame for a negative amount or a status. Those are text colors, not errors.

## Pairs with

The required star (`<hub>-ref-required-mark`) says what must be filled before anything goes wrong; `web-ref-table`
covers keys and paste in a grid.

## New and touched work

A form that is new or touched reports a failed save through the hub's one call and box (`<hub>-ref-form-errors` names them); no sweep of untouched forms.
