---
name: web-ref-form-errors
description: The ONE canon for showing a wrong value in a form in every hub project (AE49_Hub, Nuri_Hub, CCP_Hub, AWDC_Hub, future siblings) - a field that is wrong gets a RED FRAME, and the box above the Save row says what is wrong; the two always go together. A wrong value goes red at once, a required field left empty goes red when Save is refused, and the frame clears as soon as the field is right. Use whenever building, editing or reviewing a form, a validation, a setError, a required field, an editable grid or a Save refusal, and on "กรอบแดง", "ช่องไหนผิด", "make this field red", "show an error", "validate the form". Each hub keeps only its token paths, components and consumer list in its own <hub>-ref-form-errors facts skill; the rule changes HERE once.
---

# Form errors: the red frame and the box

**Owner ruling 2026-10-31** (CCP_Hub Q30 a, Q31 a): *"ค่าไหนที่ไม่ถูกควรให้ขึ้นกรอบแดงไว้เลย แล้วก็ต้องกติกากลางระดับ User นะ"*.
It replaces the older rule "Save-time validation does NOT turn fields red". Common practice agrees: a
summary says WHAT is wrong, the highlight says WHERE, and either alone makes the reader hunt.

## The rule

A wrong field shows BOTH:

1. **A red frame on the field**, from the project's one shared token, never a hand-typed border.
2. **The sentence in the one box directly above the Save row**, in Thai per `web-ref-ui-language`.

## When the frame shows

| The field | Red when | Clears when |
|---|---|---|
| Holds a WRONG value (letters in a number box, a bad format, out of range, a duplicate the page already knows) | At once, while the value is wrong. A value that could still become right while it is being typed (a lone `-`) waits until the box is left | The value is right |
| Required and EMPTY | Only after Save was refused on this form. A fresh form never opens red | The field is filled |
| Refused only by the server or a transaction (a clash found at Save) | After that refusal, when the refusal names the field | The field changes |

- A refusal that belongs to no one field (a failed save, a lost connection) stays in the box alone.
- Save is never disabled to prevent an error: it refuses and explains.
- An Edit that judges only what changed frames only what it would refuse. An untouched stored value stays plain.
- A picker, date button or any custom control takes the same frame on its trigger.
- An editable grid frames the cell. The box names the row, and the cell may repeat the sentence on hover.
- The frame keeps the box's size and stays red while focused.

## Don't

- Don't frame a field that Save would accept, or leave a refused field plain. The frame and the refusal come from
  the same check, so they cannot disagree.
- Don't replace the box with frames alone: a frame cannot say why, and the field may be off screen.
- Don't use the frame for a negative amount or a status. Those are text colors, not errors.

## Pairs with

The required star (`<hub>-ref-required-mark`) says what must be filled before anything goes wrong; `web-ref-table`
covers keys and paste in a grid.
