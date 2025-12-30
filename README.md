# CBT Exam System for Secondary Schools

A comprehensive Computer-Based Testing (CBT) platform built with Next.js, TypeScript, Prisma, and PostgreSQL. This system enables schools to conduct secure, efficient online examinations for students.

## 🎯 Features

### For Administrators
- **Dashboard**: Overview of students, exams, questions, and system activity
- **Exam Management**: Create, edit, publish, and schedule exams
- **Student Management**: Add and manage student records across all class levels
- **Question Bank**: Build and organize questions by subject, topic, and difficulty
- **Results & Analytics**: View detailed exam results and student performance
- **Audit Logs**: Track all system activities for accountability

### For Students
- **Student Dashboard**: View available and completed exams
- **Exam Taking Interface**: Clean, intuitive interface for taking exams
- **Real-time Timer**: Countdown timer with auto-submission when time expires
- **Question Navigation**: Easy navigation between questions with status indicators
- **Instant Results**: View scores and performance immediately after submission
- **Attempt Tracking**: Track multiple attempts if allowed

### Exam Features
- ⏱️ Customizable duration
- 🔀 Question randomization
- 🎲 Answer option shuffling
- ❌ Negative marking support
- 📊 Pass mark configuration
- 🔄 Multiple attempts (configurable)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/quiz_db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Admin login: Use email and password
   - Student login: Use student ID

## 📱 Main Pages

### Public Pages
- `/` - Landing page with system overview
- `/login` - Login page for both admins and students

### Admin Pages
- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/exams` - List and manage all exams
- `/admin/exams/create` - Create new exam
- `/admin/students` - Student management
- `/admin/questions` - Question bank management

### Student Pages
- `/student/dashboard` - Student dashboard with available exams
- `/student/exam/[id]` - Take exam interface
- `/student/results/[id]` - View exam results

## 🔑 Authentication

### Admin Login
- Email and password-based authentication
- Powered by NextAuth.js with JWT sessions

### Student Login
- Simple student ID-based authentication
- No password required for easy access

## 📊 Database Schema

### Main Models
- **Admin**: System administrators
- **Student**: Student records with class levels (JSS1-JSS3, SS1-SS3)
- **Exam**: Examination configurations
- **Question**: Question bank with multiple-choice options
- **Attempt**: Student exam attempts and submissions
- **Answer**: Individual answers for each question
- **AuditLog**: System activity tracking

## 🛠️ Technologies Used

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Built with ❤️ for Secondary Schools**
