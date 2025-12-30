# NEON POSTGRESQL SETUP GUIDE

## Quick Start

1. **Create a Neon Account**
   - Go to https://console.neon.tech
   - Sign up for free (includes 1 free project)

2. **Create a Database**
   - Click "Create Project"
   - Choose a name for your project
   - Select a region (choose closest to your users)
   - Wait for provisioning (takes ~30 seconds)

3. **Get Connection Strings**
   - In your Neon dashboard, click "Connection Details"
   - Copy the **Pooled connection** string (for DATABASE_URL)
   - Copy the **Direct connection** string (for DIRECT_URL)
   - Both will look like: postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname

4. **Update Your .env File**
   `env
   DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
   DIRECT_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
   NEXTAUTH_SECRET="generate-a-random-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   `

5. **Run Migrations**
   `ash
   npx prisma migrate dev --name init
   `

6. **Seed the Database**
   `ash
   npm run seed
   `

## What Changed for Neon?

- Added directUrl to Prisma schema for connection pooling support
- Neon uses ?sslmode=require for secure connections
- DATABASE_URL uses pooled connection (better for serverless)
- DIRECT_URL uses direct connection (required for migrations)

## Neon Benefits

 Serverless PostgreSQL (auto-scaling)
 Generous free tier (3 GB storage, 100 hours compute/month)
 Connection pooling built-in
 Instant branching (great for testing)
 No server management required

## Connection String Format

`
postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require
`

Example:
`
postgresql://myuser:mypassword@ep-abc123.us-east-1.aws.neon.tech/mydb?sslmode=require
`

## Troubleshooting

- **Can't connect?** Make sure you copied the full connection string with password
- **Migration errors?** Use DIRECT_URL for migrations, DATABASE_URL for app queries
- **Too many connections?** Neon automatically pools connections, but check your connection limits in dashboard

## Next Steps

1. Replace the placeholder values in .env with your actual Neon credentials
2. Run 
px prisma migrate dev to create your database tables
3. Run 
pm run seed to populate with demo data
4. Start your dev server with 
pm run dev

## Login Credentials (After Seeding)

### Admin Accounts
- Email: admin@school.com | Password: Admin@123
- Email: examadmin@school.com | Password: Admin@123

### Student IDs
- STU2024001 through STU2024012 (no password required)
