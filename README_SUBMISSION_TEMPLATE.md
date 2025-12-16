# Submission README — Frontend Assessment

Use this template for your assessment submission. Replace bracketed fields and keep sections concise.

---

## Project
- **Project Name:** Blog Admin Dashboard
- **Candidate Name:** [Your full name]
- **Email:** [your.email@example.com]
- **Location:** [City, Country]
- **GitHub Repo:** [https://github.com/your-username/repo]
- **Live Demo:** [https://your-deployment-link]
- **Demo Video (Loom/YouTube):** [https://loom.link/your-video]

---

## Overview (1–2 lines)
Brief summary of the project, what it implements, and any important decisions.

Example: "A responsive Blog Admin dashboard built with React + Vite + Tailwind. Supports full CRUD, client-side persistence (localStorage), image upload/validation, pagination, filters, and a soft-delete + auto-purge brain task." 

---

## Assessment Choices
- **Brain Task chosen:** [e.g. Soft Delete + Auto Purge]
- **Why chosen:** [Short rationale — complexity, relevance]
- **Quick Logic Task chosen:** [e.g. Disable Save unless form changed]

---

## How to run (local)
1. Clone the repo
```bash
git clone https://github.com/your-username/repo.git
cd repo
npm install
npm run dev
```
2. App will be available at `http://localhost:8081` (or the port Vite chooses).

To build for production:
```bash
npm run build
npm run preview
```

---

## Architecture & Key Files
- `src/` — main source
  - `components/` — UI components and pages
  - `hooks/` — custom hooks (`useBlogs`, `useFormChange`, `useSidebar`, `use-toast`)
  - `contexts/` — global context (BlogProvider)
  - `pages/` — route pages (`BlogList`, `BlogEditor`, `Trash`)

- Important files:
  - `src/components/blog/ImageUpload.tsx` — image validation & preview
  - `src/components/blog/BlogForm.tsx` — form handling and validation
  - `src/hooks/useBlogs.ts` — CRUD + persistence (localStorage)
  - `src/components/layout/Sidebar.tsx` — navigation UI

---

## Features Implemented (checklist)
- [ ] Responsive Admin Layout (Sidebar + Navbar + Content)
- [ ] Create / Read / Update / Delete blogs
- [ ] Blog fields: Title, Description, Category, Author, Image, Publish Date, Status
- [ ] Pagination (client-side, 5 / 10 per page)
- [ ] Search & Filters (Title/Author, Category, Status)
- [ ] Image validation (JPG/PNG, <= 1MB) and preview
- [ ] Persistence (localStorage)
- [ ] Soft Delete + Auto Purge (Brain Task)
- [ ] Disable save unless form changed (Quick Logic Task)
- [ ] Basic accessibility improvements (aria labels, keyboard) — optional

---

## Notes on Implementation
- Image validation: uses `file.size` compared to `1 * 1024 * 1024` bytes; MIME type and extension checked before reading file.
- Persistence: data stored in `localStorage` under key `blogs_v1` (see `useBlogs.ts`).
- Soft delete: deleted items are flagged with `deletedAt` and moved to Trash; an auto-purge runs on app load to remove items older than X days.

---

## Tests
- Unit tests: [list tests included — if none, write "None included"]
- Suggested tests to add: image validation, form save blocking, CRUD flow, pagination state persistence.

---

## Deployment
- Live app hosted at: [https://your-deployment-link]
- Deployment steps (if not automated): build and upload `dist` to Vercel/Netlify/Firebase.

---

## Known Limitations & Future Work
- Briefly list any known bugs or missing features (e.g., server-side pagination, more robust a11y, tests).

---

## Submission Checklist (for candidate)
- [ ] README updated (this file)
- [ ] Demo video linked and uploaded (3–5 min)
- [ ] Live deployment link provided
- [ ] Mark which brain and quick logic tasks implemented
- [ ] Run through acceptance checklist locally

---

## Contact
If you have questions about this submission please contact: [your.email@example.com]
