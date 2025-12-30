# 🔐 Login Credentials

## Admin Accounts

### Super Administrator
- **Login URL**: http://localhost:3000/admin/login
- **Email**: `admin@school.com`
- **Password**: `Admin@123`
- **Role**: SUPER_ADMIN
- **Permissions**: Full system access

### Exam Administrator
- **Login URL**: http://localhost:3000/admin/login
- **Email**: `examadmin@school.com`
- **Password**: `Admin@123`
- **Role**: EXAM_ADMIN
- **Permissions**: Exam management access

---

## Student Accounts

**Login URL**: http://localhost:3000/student/login

Students log in using only their **Student ID** (no password required).

### JSS1 Students
- `STU2024001` - Chinedu Okafor (Section A)
- `STU2024002` - Aisha Ibrahim (Section A)
- `STU2024003` - Oluwaseun Adeyemi (Section B)

**Available Exams**: JSS1 First Term Mathematics Exam ✅

### JSS2 Students
- `STU2024004` - Fatima Mohammed (Section A)
- `STU2024005` - Emmanuel Nwosu (Section A)

**Available Exams**: JSS2 Mathematics Mid-Term Test (Scheduled for future) ⏳

### JSS3 Students
- `STU2024006` - Blessing Eze (Section A)
- `STU2024007` - Abdullahi Musa (Section B)

**Available Exams**: None currently scheduled

### SS1 Students
- `STU2024008` - Chioma Okonkwo (Section A)
- `STU2024009` - Ibrahim Bello (Section A)

**Available Exams**: None currently scheduled

### SS3 Students
- `STU2024010` - Funmilayo Adeleke (Section A)
- `STU2024011` - Yusuf Ahmed (Section A)
- `STU2024012` - Ngozi Okoro (Section B)

**Available Exams**: SS3 Final English Language Test ✅

---

## 📝 Sample Exams

### Currently Accessible Exams (Scheduled)

1. **JSS1 First Term Mathematics Exam**
   - Class: JSS1
   - Duration: 45 minutes
   - Questions: 5
   - Pass Mark: 50%
   - Attempts Allowed: 1
   - Status: ✅ Active (Scheduled yesterday)

2. **SS3 Final English Language Test**
   - Class: SS3
   - Duration: 60 minutes
   - Questions: 5
   - Pass Mark: 60%
   - Attempts Allowed: 2
   - Status: ✅ Active (Scheduled now)

### Future Exams (Not Yet Accessible)

3. **JSS2 Mathematics Mid-Term Test**
   - Class: JSS2
   - Duration: 40 minutes
   - Pass Mark: 50%
   - Attempts Allowed: 1
   - Status: ⏳ Scheduled for 7 days from now

---

## 🎯 Important Notes

### For Students:
- **You can only see exams that are**:
  - Published by admin ✅
  - Scheduled for your class level ✅
  - Already past their scheduled date/time ✅

- **If you don't see any exams**, it means:
  - No exams have been scheduled for your class level yet
  - Exams are scheduled for a future date
  - Exams have not been published by the admin

### For Admins:
- Log in at `/admin/login` using email and password
- You can create, edit, publish/unpublish exams
- Set the `scheduledAt` date to control when students can access exams
- Students will only see published exams that are scheduled for now or in the past

---

## 🔄 How to Seed the Database

To populate your database with these demo accounts and exams:

```bash
npm run seed
```

This will create:
- 2 admin accounts
- 12 student accounts across all class levels
- 10 sample questions (5 Math + 5 English)
- 3 sample exams (2 accessible now, 1 scheduled for future)

---

## 🌐 Access URLs

- **Home Page**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Student Login**: http://localhost:3000/student/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Student Dashboard**: http://localhost:3000/student/dashboard

---

## 🛡️ Security Features

- ✅ Separate login routes for admins and students
- ✅ Admin passwords are hashed with bcrypt
- ✅ Students cannot access admin routes
- ✅ Students can only see their own class-level exams
- ✅ Exams must be both published AND scheduled to be visible to students
- ✅ Session-based authentication for admins (NextAuth.js)
- ✅ LocalStorage-based authentication for students (simple and secure)
