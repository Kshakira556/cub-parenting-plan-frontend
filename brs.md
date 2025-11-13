Perfect! Let’s make a **concrete backend response spec table** so your frontend and backend are fully aligned. I’ll list **each endpoint**, **expected method**, **request body**, and **exact JSON response shape**. This will remove any ambiguity.

---

# **Backend Response Specification for Frontend Alignment**

| Module              | Endpoint                   | Method | Request Body                                                               | Expected Response JSON                                                                                               |
| ------------------- | -------------------------- | ------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Auth / Users**    | `/auth/login`              | POST   | `{ email, password }`                                                      | `{ user: { id, full_name, email, role }, token: string }`                                                            |
|                     | `/users/register`          | POST   | `{ full_name, email, password, role }`                                     | `{ user: { id, full_name, email, role }, token: string }` OR `{ message: string }` on error                          |
| **Children**        | `/children`                | GET    | *none*                                                                     | `{ children: Child[] }`                                                                                              |
|                     | `/children`                | POST   | `{ full_name, date_of_birth, parent_id }`                                  | `{ child: { id, full_name, date_of_birth, parent_id } }`                                                             |
| **Parenting Plans** | `/plans`                   | GET    | *none*                                                                     | `{ plans: ParentingPlan[] }`                                                                                         |
|                     | `/plans`                   | POST   | `{ title, description?, start_date?, end_date?, status?, created_by }`     | `{ plan: { id, title, description?, start_date?, end_date?, status, created_by, created_at, updated_at? } }`         |
| **Visits**          | `/visits/plan/:plan_id`    | GET    | *none*                                                                     | `{ visits: Visit[] }`                                                                                                |
|                     | `/visits`                  | POST   | `{ plan_id, child_id, parent_id, start_time, end_time, location, notes? }` | `{ visit: { id, plan_id, child_id, parent_id, start_time, end_time, location, notes?, created_at, updated_at? } }`   |
| **Journal**         | `/journal/child/:child_id` | GET    | *none*                                                                     | `{ entries: JournalEntry[] }`                                                                                        |
|                     | `/journal`                 | POST   | `{ child_id, author_id, entry_date, content }`                             | `{ entry: { id, child_id, author_id, entry_date, content?, created_at, updated_at? } }`                              |
| **Messages**        | `/messages/plan/:plan_id`  | GET    | *none*                                                                     | `{ messages: Message[] }`                                                                                            |
|                     | `/messages`                | POST   | `{ sender_id, receiver_id, plan_id, content }`                             | `{ message: { id, sender_id, receiver_id, plan_id, content, created_at, is_flagged, flagged_reason?, is_deleted } }` |

---

### ✅ Notes & Recommendations

1. **Consistency is key**: All POST responses return an object containing the **created entity** (`child`, `plan`, `entry`, `visit`, `message`).
2. **Error responses** should always return `{ message: string }` or `{ issues: [{ message: string }] }`. Frontend can parse this safely.
3. **Dates**: Return ISO 8601 strings (`YYYY-MM-DDTHH:mm:ss.sssZ`) for all timestamps (`created_at`, `updated_at`, `entry_date`, `start_time`, `end_time`).
4. **Role & access control**: Backend must validate `parent_id`, `author_id`, `sender_id`, `receiver_id` to prevent unauthorized actions.
5. **Nullable fields**: Optional fields (description, notes, flagged_reason) must always exist in the JSON (even if `null`) for frontend consistency.

---
**frontend “expected type mapping”** 