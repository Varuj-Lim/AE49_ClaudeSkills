---
name: web-ref-breadcrumb
description: "Canon (web-ref-*) for the breadcrumb on a record's view, edit and add pages: one shared component, every crumb a literal href, last crumb not a link, no back arrow, list pages have none. Use for any breadcrumb, trail or back link; เส้นทางบนหัวหน้า, ปุ่มย้อนกลับ, add a breadcrumb, crumb href, back link on the view page."
---

# Breadcrumb

Each hub keeps its component, tokens and settled trails in `<hub>-ref-breadcrumb`; a rule changes here, once.

## The rule

- **Sub-pages have one, list pages have none.** Every record view, edit and add page shows the shared breadcrumb at the top. A list page is the top of its trail and shows only its title.
- **No back arrow,** no `← Back to X`, no second "where am I" control.
- **Every crumb's href is a literal.** A crumb says where a thing lives, not where the visitor came from, so it opens exactly what its label says. Never `ret ?? "/list"`, never a `?return=` value. Going back to where you came from is the browser's Back button.
- **Only crumbs are literal.** Cancel, Edit and after-save may still return to the filtered list.
- **The last crumb is the current page:** a label, never a link.
- **A crumb naming a grouping with no route** is a label too.
- **Labels are short section names,** matching the sidebar. A long record name truncates in the component, never by hand.
- **Styled only by the shared component:** no size, weight or color at a call site, no inline `<nav>`.

## The shape

`List › Record › Action`, with hrefs per `web-ref-routes`:

```tsx
[{ label: "Library", href: "/library" }, { label: book.title }]                     // view
[{ label: "Library", href: "/library" }, { label: book.title, href: `/library/${id}/view` }, { label: "Edit" }] // edit
[{ label: "Library", href: "/library" }, { label: "New" }]                          // add
```

A record with no view page omits that level.
