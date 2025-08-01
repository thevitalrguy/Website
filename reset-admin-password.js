// Simple script to reset admin password if needed
// Run with: node reset-admin-password.js

import bcrypt from 'bcrypt';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon
globalThis.WebSocket = ws;

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function resetAdminPassword() {
  const newPassword = 'admin123'; // Change this to your desired password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  try {
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 AND role = $3',
      [hashedPassword, 'admin@vitalr.tech', 'admin']
    );

    if (result.rowCount > 0) {
      console.log('✅ Admin password has been reset successfully!');
      console.log('📧 Email: admin@vitalr.tech');
      console.log('🔑 Password: admin123');
    } else {
      console.log('❌ No admin user found with email admin@vitalr.tech');
    }
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  }
  
  await pool.end();
}

resetAdminPassword();