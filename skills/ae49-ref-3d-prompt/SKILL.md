---
name: ae49-ref-3d-prompt
description: "How Main hands the owner image and 3D prompts (Tripo, Nano Banana): ONE change per prompt, ONE prompt per message, wait for the result before the next; what a character image needs to rig and animate. Use when the owner asks for a prompt to edit or make a character or model; ขอ prompt, ทำโมเดล, ปรับสีตัวละคร, ทำ T-pose, Tripo."
---

# 3D prompt — how Main hands the owner a generation prompt

**Why (owner 2026-11-07).** Main gave one prompt that changed five things at once (colour, pose, props, coat, background)
and only afterwards said the edit works better split in rounds. The owner had already pasted the whole block:
*"ครั้งหน้าคุณก็บอกผมทีละครั้งสิ เขียนรวมกันผมก็เอาไปวางหมดเลย"*. The owner pastes exactly what Main hands over, so the
hand-over itself must be the right size.

## 1. One round at a time — the core rule

- **One prompt changes ONE thing** (a colour scheme, a pose, removing props, a garment, the background). An image
  editor keeps the rest of the picture better when it is asked one thing.
- **One message carries ONE prompt.** Then Main stops and waits for the owner's result image. Never "round 1 … round 2 …"
  in one message, never a combined prompt with a note that it could be split.
- **Each prompt says "keep everything else exactly the same"** and names what must stay (colours, pose, style, background).
- **Look at the result before the next round.** Say what came out right, what did not, and whether it matters for the
  3D step. A near-miss that the next stage tolerates is not re-done, but a character that is not in a clear T-pose is
  (§ 4).
- **Advice that changes how to use a prompt goes BEFORE the prompt**, never after it.
- **The prompt goes in the turn's FINAL message, never in text between tool calls (owner 2026-11-07).** Text written
  between tool calls scrolls away or reaches the owner cut short; the prompt got lost that way twice in one day
  (Inspector round 1, Builder round 1). Finish the tool work first, then hand the prompt over last.

## 2. Hand-over format

````markdown
▶️ **พรอมต์รอบ n — Tripo Edit Image:**

```text
<the English prompt>
```

<the same prompt again as plain text, one paragraph>

ได้ผลแล้วส่งภาพมาให้ดูก่อน ค่อยไปรอบต่อไป
````

Prompts are in English (the image models follow it best); everything around them is Thai. The plain-text copy follows
the `~/.claude/CLAUDE.md` § Communication rule for anything the owner pastes.

## 3. Character rounds — the usual order

Run only the rounds the image needs, in this order (each is its own message):

1. **Colours** — main colour, trim colour, which lights stay glowing.
2. **Pose** — full body, strict T-pose (§ 4), facing the camera straight on, legs straight, feet apart, hands empty.
3. **Remove floating things** — holograms, orbs, screens, particles, glow effects, jet flames.
4. **Garments** — remove or shorten long coats, capes, skirts and loose cloth (see § 4).
5. **Background** — plain pure white, no shadow, whole body in frame with margin.

## 4. What a character image must be to rig and animate

- **Humanoid, two arms, two legs** — the auto-rig (Mixamo-style) needs it. A non-humanoid (many legs, a ball body
  with no legs) cannot take that rig: it becomes a single piece that moves whole, or is redrawn as a humanoid. Say so
  before the owner spends credits on it.
- **A clear T-pose, said in EVERY character prompt (owner 2026-11-07).** The pose round asks for it, and every other
  round's "keep the same" names it, so no edit lets the arms drift. The wording, verbatim: *"strict T-pose, facing the
  camera straight on, both arms straight out to the sides, perfectly horizontal at shoulder height, palms facing down,
  legs straight, feet shoulder-width apart"*. Why: asked only once, in a five-change prompt, the arms came back angled
  down with palms up (an A-pose), and the owner wants the T-pose stated plainly every time. A result that is not a clear
  T-pose gets a pose round of its own. An action pose bakes into the mesh and bends wrongly when rigged.
- **No floating or glowing extras.** Image-to-3D turns them into solid lumps; the town adds glow in code instead.
- **Cloth no lower than the knee.** A long coat becomes one stiff sheet that the legs pass through when walking.
  Removing it now and "adding it later" means generating and rigging a NEW model from an image with the coat:
  tell the owner that before they choose.
- **Headgear fixed to the head stays** (a hood, a helmet): it moves with the head bone.
- **One front image, then Tripo's Generate Multi-Views** for the other angles. Never ask the image model for a
  multi-view sheet in one picture: image-to-3D reads the whole picture as one character.

## 5. After the image — the Tripo steps

Edit Image (Nano Banana) → Generate Multi-Views → Generate (model) → Rig → animation clips → Export `.glb`.
For Agent Town: shrink with `agent-town/tools/decimate-glb.cjs` to about 10 MB per file or less, copy into
`agent-town/models/`, and keep the source export only on the machine (gitignored), as `agent-town/README.md` says.
The owner's concept art lives in `agent-town/reference/`.

## Beyond characters

Props, buildings and other assets get their own section here when the first one is made; § 1 and § 2 already apply to them.
