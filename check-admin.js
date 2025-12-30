const { PrismaClient } = require('./app/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@school.com' }
    });
    
    if (!admin) {
      console.log('❌ Admin not found in database');
      console.log('Creating admin...');
      
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const newAdmin = await prisma.admin.create({
        data: {
          email: 'admin@school.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'SUPER_ADMIN'
        }
      });
      
      console.log('✅ Admin created:', newAdmin.email);
    } else {
      console.log('✅ Admin found:', admin.email);
      console.log('Password hash:', admin.password);
      
      // Test password
      const passwordMatch = await bcrypt.compare('Admin@123', admin.password);
      console.log('Password "Admin@123" match:', passwordMatch);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
