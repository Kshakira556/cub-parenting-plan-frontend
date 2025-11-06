### 🔹 Frontend-Backend Alignment Checklist

#### 1. **Environment & API URL**

* ✅ You already set `VITE_API_URL=http://localhost:8000/api`.
* Ensure this is used consistently in all frontend services (`authService`, `journalService`, `messagesService`, `visitsService`).

---

#### ✅ 2. **Authentication**

* ✅ Backend login endpoint: `POST /api/auth/login` → returns `{ user, token }`.

* ✅ Frontend `login` service should store **both user and token**.

  * Current frontend AuthContext stores only `user`.
  * **Action:** Add `token` storage in localStorage for authorization headers on requests if needed.

* ✅ Optional: Implement automatic token attach for protected requests (e.g., visits, messages, journals) in a wrapper function.

---

#### ✅ 3. **Users / Registration**

* ✅ Backend registration: `POST /api/users/register` → returns `{ user }`.
* ✅ Frontend `register` service matches this.
* ✅ Frontend should validate role values: `parent`, `mediator`, `admin`.
* ✅ Optional: Add error handling to parse backend Zod validation errors for display.

---

#### ✅ 4. **Children**

* ✅ Backend:

  * `POST /api/children` → create child.
  * `GET /api/children` → list all children.
* ✅ Frontend:

  * No children pages yet.
  * **Action:** Add UI and services for creating/listing children.

---

#### 5. **Parenting Plans**

* Backend:

  * `POST /api/plans` → create plan.
  * `GET /api/plans` → list plans.
* Frontend:

  * No plan pages yet.
  * **Action:** Create services and UI for plans (dashboard overview can show plans).

---

#### 6. **Visits**

* Backend:

  * `POST /api/visits` → create visit.
  * `GET /api/visits/plan/:plan_id` → list visits.
* Frontend `Visits.tsx`:

  * Currently uses `"example-plan-id"` → needs real `plan_id` from context or dashboard selection.
  * **Action:** Update to fetch visits based on actual logged-in user’s plan(s).

---

#### 7. **Messages**

* Backend:

  * `POST /api/messages` → send message.
  * `GET /api/messages/plan/:plan_id` → list messages.
* Frontend `Messages.tsx`:

  * Uses `"example-plan-id"` → should be dynamic.
  * Optional: Add sender/receiver mapping to names instead of IDs.

---

#### 8. **Journal**

* Backend:

  * `POST /api/journal` → create journal entry.
  * `GET /api/journal/child/:child_id` → list entries.
* Frontend `Journal.tsx`:

  * Uses `"example-child-id"` → needs actual child ID from user’s plan.

---

#### 9. **CORS / Headers**

* Backend already allows `http://localhost:5173`.
* Optional: If you start sending Authorization headers (Bearer token), update `oakCors` to include `"Authorization"` in `allowedHeaders`.

---

#### 10. **Data Mapping**

* Backend IDs (`plan_id`, `child_id`, `parent_id`, `author_id`) are UUIDs.
* Frontend currently uses hardcoded strings in pages.
* **Action:** Replace hardcoded IDs with dynamic selection from API data:

  * User → plans → children → visits/journal/messages.

---

#### 11. **Error Handling**

* Backend sends `ZodError` for validation issues.
* Frontend currently throws generic errors.
* **Action:** Parse backend error messages and show them in forms.

---

#### 12. **Date Formatting**

* Backend sends ISO dates.
* Frontend `dateFormatter.ts` exists.
* **Action:** Use it consistently in Visits, Journal, Messages for human-readable timestamps.

---

#### 13. **Auth / Protected Routes**

* Frontend protected routes already check for `user` in AuthContext.
* **Action:** Ensure logout clears both `user` and any saved `token`.

---

#### 14. **Optional / Enhancements**

* Add “create plan” and “assign children/parents to plan” UI to match backend logic.
* Add dashboard overview widgets: upcoming visits, recent messages, journal entries.
* Consider context or global state for selected plan/child to avoid passing IDs manually.

---
