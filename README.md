# 🚀 LetsConnect

A collaborative project management tool built with Next.js, Prisma, PostgreSQL, and Auth0 authentication. LetsConnect is designed to help teams and individuals efficiently manage projects, track tasks, and collaborate seamlessly.

✨ Features

✅ User Authentication (Auth0, GitHub, Custom OAuth)

🏗 Project & Task Management (Kanban boards, team collaboration)

🔔 Real-time Notifications

📂 Cloudinary Integration for File Uploads

📊 Analytics & Insights

⚡ Fast & Optimized (Built with Next.js & Prisma)


## 🛠️ Setup Guide for Contributors

Follow these steps to set up the development environment and start contributing.

---

## 1️⃣ Clone the Repository

```sh
git clone https://github.com/CodeWithInferno/LetsConnect.git
cd letsconnect
```

## 2️⃣ Install Dependencies

Ensure you have Node.js and npm installed. Then, install dependencies:

```sh
npm install
```



## 3️⃣ Set Up PostgreSQL Database

Option 1: Using Local PostgreSQL \
If you have PostgreSQL installed locally, create a database:

```sh
psql -U postgres
```

Inside psql, run:

```sh
CREATE DATABASE letsconnect OWNER postgres;
```
To Exit 
```sh
\q
```

## Option 2: Using Docker
If you prefer Docker, run:

```sh
docker run --name letsconnect-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=letsconnect -p 5432:5432 -d postgres
```


## 4️⃣ Configure Environment Variables
Copy the example environment file:

```sh
cp .env.example .env
```
Then edit .env and update the database URL:

```sh
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/letsconnect"
```

Other required fields:

```sh
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
NEXT_PUBLIC_UNSPLASH_API_KEY=
NEXT_PUBLIC_UNSPLASH_API_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_GITHUB_CALLBACK_URL=

```

---
## 5️⃣ Apply Prisma Migrations
After setting up the database, run:

```sh
npx prisma migrate dev --name init
```

This will apply database migrations and create the necessary tables.
To view the database in Prisma Studio, run:

```sh
npx prisma studio
```

## 6️⃣ Start the Development Server
Now, start the development server:

```sh
npm run dev
```
The app will be running at:
🔗 http://localhost:3000

## 7️⃣ Verify Your Setup
Check the database:

```sh
psql -U postgres -d letsconnect -c "\dt"
```
If you see the tables (User, Project, Organization, etc.), everything is set up correctly!


| Command | Description |
| -------- | ------- |
| npm run dev | Start the development server |
|npm run build |	Build for production |
|npx prisma migrate dev | Apply database migrations |
|npx prisma studio | Open Prisma database viewer
|npm run lint | Run ESLint checks



# ❓ Troubleshooting
## 1️⃣ Database Connection Issues
If you see FATAL: password authentication failed, ensure PostgreSQL is running and your .env credentials are correct.

Check running PostgreSQL services:

```sh
brew services list
brew services restart postgresql
```

Or for Docker:

```sh
docker start letsconnect-db
```

2️⃣ Prisma Migration Issues \
If migrations fail, reset the database:

```sh
npx prisma migrate reset
```

3️⃣ Authentication Issues \
Ensure Auth0 credentials in .env match your Auth0 setup.


# 🤝 Contributing
Want to contribute? Follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-branch`
3. Commit changes: `git commit -m "Added a new feature"`
4. ush to your fork: `git push origin feature-branch`
5. Open a Pull Request 🚀



# 📜 License
This project is MIT licensed. Feel free to use and contribute!


# 🎯 Summary
- PostgreSQL Setup ✅
- Prisma Migrations ✅
- Auth0 Authentication ✅
- Docker Support ✅
- Step-by-Step Guide ✅

---


---

### **🔹 What This README Covers**
✅ **Cloning & Installation**  
✅ **PostgreSQL Setup (Local & Docker)**  
✅ **Environment Variables**  
✅ **Prisma Migrations & Commands**  
✅ **Common Troubleshooting Issues**  
✅ **Contribution Guidelines**  

This README will **help contributors set up everything quickly**! 🚀 Let me know if you want any modifications.
