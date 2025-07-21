

# 🗂️ Todo List App

**The To-Do App** is designed to help you stay organized, productive, and on top of your daily responsibilities. Whether you’re managing personal tasks, work projects, or a busy schedule, this app has everything you need to succeed.

---

## 🚀 Tech Stack

* **Framework:** Next.js
* **Runtime:** Node.js
* **ORM:** Prisma
* **Database:** PostgreSQL
* **Styling:** CSS / MUI (Material UI)

---

## ✨ Features

* Create, read, update, and delete tasks
* Filter tasks by status (completed, incomplete)
* Calendar view for tasks by date
* Sidebar navigation
* Global loading indicator for async operations
* Task details view

---

## 🔧 Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/todo_list_app.git
   cd todo_list_app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env` file in the project root and add the following (adjust as needed):

   ```env
   DATABASE_URL="postgresql://postgres:{PASSWORD}@localhost:5432/todo_app"
   ```

4. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

5. **Seed your database**

   ```bash
   npm run seed
   ```

6. **Run migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

7. **Start the development server**

   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```
/todo_list_app
├─ public/
│  └─ template Upload Todo List.xlsx
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.js
├─ lib/
│  └─ db.js
├─ src/
│  ├─ components/
│  │  ├─ AddTask.js
│  │  ├─ CompletedTask.js
│  │  ├─ DeleteTask.js
│  │  ├─ EditTask.js
│  │  ├─ GlobalLoading.js
│  │  ├─ IncompletedTask.js
│  │  ├─ Sidebar.js
│  │  ├─ TaskDetails.js
│  │  └─ TaskFilters.js
│  ├─ pages/
│  │  ├─ api/
│  │  │  └─ tasks/
│  │  │     ├─ task_calendar.js
│  │  │     └─ task_list.js
│  │  ├─ _app.js
│  │  ├─ home.js
│  │  └─ index.js
│  └─ styles/
│     ├─ globals.css
│     └─ task_calendar.css
└─ README.md
```

---

## ⚙️ Environment Variables

| Key            | Description                  |
| -------------- | ---------------------------- |
| `DATABASE_URL` | PostgreSQL connection string |

---

## 📝 Scripts

| Script                               | Description                      |
| ------------------------------------ | -------------------------------- |
| `npm run dev`                        | Start Next.js development server |
| `npm run build`                      | Build for production             |
| `npm run start`                      | Start production server          |
| `npm run seed`                       | Seed the database (Prisma)       |
| `npx prisma generate`                | Generate Prisma client           |
| `npx prisma migrate dev --name init` | Run migrations                   |

---

