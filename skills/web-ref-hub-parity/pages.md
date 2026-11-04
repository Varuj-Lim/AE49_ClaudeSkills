# Pages in scope — and the AE49 paths behind them

Owner 2026-11-04 (AWDC Q6 c, plus Notifications): these pages stay equal across hubs. A page that exists in only some
hubs is still in scope: the run asks whether the others should have it, unless `divergences.md` already says.

| # | Group | Pages (routes under `app/(app)/` unless shown) | AE49 paths (safety-net filter) | หมายเหตุ |
|---|---|---|---|---|
| 1 | Shell | Sidebar, page header + breadcrumb, notification bell, banners | `components/layout/`, `components/ui/` | ส่วนที่ทุกหน้าใช้ร่วมกัน |
| 2 | Home | `home` (AE49 also `dashboard`) | `app/(app)/home/`, `app/(app)/dashboard/`, `components/home/` | |
| 3 | Notifications | `notifications` | `app/(app)/notifications/`, `components/notifications/` | หน้าที่กระดิ่งพาไป |
| 4 | Employees | `directory`, `devices`, `add`, `[id]/view`, `[id]/edit`, `approvals`, `approvals/[id]/view` (AE49 also `organization`, `ranks`) | `app/(app)/employees/`, `components/employees/`, `components/ProfileForm.tsx`, `app/api/admin/`, `app/api/device/`, `app/api/invite/` | |
| 5 | Support | `patch-notes`, `tickets`, `tickets/[id]/view` | `app/(app)/support/`, `components/support/`, `app/api/tickets/` | |
| 6 | Settings | every tab: `account`, `company-profile`, `data-management`, `display-order`, `notifications`, `style-guide`, `system` (AE49 also `holidays`, `human-resources`) | `app/(app)/settings/`, `components/settings/` | |
| 7 | Before sign-in | `app/login`, `app/forgot-password`, `app/reset-password`, `app/onboarding`, `app/invite/[token]/view`, `app/maintenance` (AWDC also `app/privacy`) | `app/login/`, `app/forgot-password/`, `app/reset-password/`, `app/onboarding/`, `app/invite/`, `app/maintenance/`, `components/auth/`, `app/api/forgot-password/` | หน้าก่อนเข้าระบบ |
| 8 | Rules over these pages | — | `firestore.rules`, `storage.rules` — only the hunks over the collections these pages use (users / employees, devices, tickets, patch notes, notifications, invites) | ไฟล์ rules แก้บ่อยจาก module อื่น ให้ดูเฉพาะส่วนของหน้าในรายการ |

A hub whose own paths differ (another component folder, a renamed collection) maps them by concept during its run; this
table holds AE49's paths only.
