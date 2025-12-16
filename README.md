# Blog Admin Dashboard



👉 [Watch the demo on Loom](https://www.loom.com/share/3b1dfff6dbe94faaa18d5d67947c5b47)

A production-ready Blog Admin Dashboard built with React, Vite, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── blog/
│   │   ├── BlogCard.tsx         # Blog card component with actions
│   │   ├── BlogFilters.tsx      # Search and filter controls
│   │   ├── BlogForm.tsx         # Create/Edit blog form
│   │   ├── DeletedBlogCard.tsx  # Trash item component
│   │   ├── ImageUpload.tsx      # Image upload with validation
│   │   └── Pagination.tsx       # Pagination controls
│   ├── layout/
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   ├── Navbar.tsx           # Top navigation bar
│   │   └── Sidebar.tsx          # Collapsible sidebar
│   └── ui/                      # Shadcn UI components
├── hooks/
│   ├── useBlogs.ts              # Blog CRUD operations & state
│   ├── useFormChange.ts         # Form change detection
│   ├── useSidebar.ts            # Sidebar collapse state
│   └── use-toast.ts             # Toast notifications
├── lib/
│   ├── types.ts                 # TypeScript interfaces
│   └── utils.ts                 # Utility functions
├── pages/
│   ├── Dashboard.tsx            # Dashboard overview
│   ├── BlogList.tsx             # All blogs page
│   ├── BlogEditor.tsx           # Create/Edit blog page
│   ├── Trash.tsx                # Soft deleted blogs
│   └── Index.tsx                # Home page wrapper
└── App.tsx                      # Main app with routes
```

## ✨ Features

### CRUD Operations
- Create, Read, Update, Delete blog posts
- Fields: Title, Description, Category, Author, Image, Publish Date, Status

### Image Upload Validation
- Accepts only JPG and PNG formats
- Maximum file size: 1MB
- Live image preview
- Clear error messages for invalid files

### Pagination
- Display 5 or 10 blogs per page
- Previous/Next and page number controls
- **Persisted in localStorage** - survives page refresh

### Search & Filters
- Search by Title or Author
- Filter by Category
- Filter by Status (Draft/Published)
- All filters persist in localStorage

### Data Persistence
- All blogs stored in localStorage
- UI state (pagination, filters) persisted
- Data survives browser refresh

## 🧠 Brain Task: Soft Delete with Auto Purge

### Implementation

When a blog is deleted:
1. The `deletedAt` timestamp is set (soft delete)
2. Blog is hidden from the main list
3. Blog appears in the Trash page
4. After **7 days**, the blog is automatically purged

### Code Location
`src/hooks/useBlogs.ts` - The `useEffect` hook checks on every render:

```typescript
// Auto-purge soft deleted blogs after SOFT_DELETE_DAYS
useEffect(() => {
  const now = new Date();
  const purgedBlogs = blogs.filter((blog) => {
    if (!blog.deletedAt) return true;
    const deletedDate = new Date(blog.deletedAt);
    const daysSinceDeleted = Math.floor(
      (now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceDeleted < SOFT_DELETE_DAYS;
  });
  
  if (purgedBlogs.length !== blogs.length) {
    setBlogs(purgedBlogs);
  }
}, [blogs]);
```

### User Experience
- Trash page shows days remaining before permanent deletion
- Users can restore blogs from trash
- Users can permanently delete immediately
- "Empty Trash" button with confirmation dialog

## ⚡ Quick Logic Task: Save Button State

The Save button is disabled unless form data has changed from the original values.

### Implementation
`src/hooks/useFormChange.ts`:

```typescript
const areEqual = (a: BlogFormData, b: BlogFormData): boolean => {
  return (
    a.title === b.title &&
    a.description === b.description &&
    a.category === b.category &&
    a.author === b.author &&
    a.image === b.image &&
    a.publishDate === b.publishDate &&
    a.status === b.status
  );
};

// hasChanges is updated whenever form data changes
useEffect(() => {
  setHasChanges(!areEqual(originalData, currentData));
}, [originalData, currentData]);
```

### Usage in BlogForm
```typescript
const canSave = isEditing ? hasChanges : true;

<Button disabled={!canSave}>
  {isEditing ? 'Save Changes' : 'Create Blog'}
</Button>
```

## 🎨 Design System

- **Primary Color**: Deep blue (#4F6BED)
- **Success**: Green for published status
- **Warning**: Orange for alerts
- **Destructive**: Red for delete actions
- **Dark Sidebar**: Professional contrast

## 📱 Responsive Design

- Desktop: Full sidebar visible
- Tablet: Collapsible sidebar
- Mobile: Hamburger menu with slide-out sidebar

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy the `dist` folder
```

### Netlify
1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `dist`

## 🛠 Technologies

- **React 18** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **TypeScript** - Type Safety
- **React Router** - Navigation
- **Radix UI** - Accessible Components
- **Lucide React** - Icons

## 📄 License

MIT

---

## Submission README (prefilled)

Use the section below to submit your assessment. Replace any placeholder values (bracketed) with your information before sending to HR.

- **Project Name:** Blog Admin Dashboard
- **Candidate Name:** Thirisurya B
- **Email:** thirisurya333@gmail.com
- **Location:** Erode, Tamil Nadu
- **GitHub Repo:** [https://github.com/your-username/repo]
- **Demo Video (Loom/YouTube):** https://www.loom.com/share/3b1dfff6dbe94faaa18d5d67947c5b47

### Assessment Choices
- **Brain Task chosen:** Soft Delete + Auto Purge
- **Why chosen:** Practical for admin apps; demonstrates persistence and lifecycle logic.
- **Quick Logic Task chosen:** Disable Save unless form changed

### How to run (local)
```bash
git clone https://github.com/your-username/repo.git
cd repo
npm install
npm run dev
```

App will be available at `http://localhost:8081` (or the port Vite chooses).

### Run tests

Unit tests (Vitest):
```bash
npm install
npm run test
```

E2E tests (Playwright):
1. Install deps and Playwright browsers:
```bash
npm install
npx playwright install --with-deps
```
2. Start the dev server in one terminal:
```bash
npm run dev
```
3. Run Playwright tests:
```bash
npm run test:e2e
```

---

### Notes to HR / Reviewer
- This repository implements the assessment requirements: responsive layout, CRUD, image validation (JPG/PNG <= 1MB), pagination, filters, persistence in localStorage, soft-delete + auto-purge (brain task), and save-state detection (quick logic task).
- Please confirm the live demo link and demo video in the submission before evaluating.

