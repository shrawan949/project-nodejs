// Development startup with in-memory MongoDB
// Usage: node src/dev-server.js
// This script starts an in-memory MongoDB, seeds the database, and launches the app server.
import { MongoMemoryServer } from 'mongodb-memory-server';
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');

async function startDev() {
  console.log('🔧 Starting in-memory MongoDB server...');
  const mongod = await MongoMemoryServer.create({ binary: { version: '7.0.0' } });
  const uri = mongod.getUri();
  console.log(`✅ MongoDB running at: ${uri}`);

  // Update .env file with the in-memory URI
  let envContent = '';
  try {
    envContent = readFileSync(envPath, 'utf-8');
  } catch {
    envContent = '';
  }
  
  // Replace or add MONGO_URI
  if (envContent.includes('MONGO_URI=')) {
    envContent = envContent.replace(/MONGO_URI=.*/g, `MONGO_URI=${uri}`);
  } else {
    envContent += `\nMONGO_URI=${uri}`;
  }
  writeFileSync(envPath, envContent);
  console.log('📝 Updated .env with in-memory MongoDB URI');

  // Now import and run the main server (which reads .env via dotenv)
  await import('./server.js');
  
  // Handle graceful shutdown
  const shutdown = async () => {
    console.log('\n🛑 Shutting down MongoDB...');
    await mongod.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startDev().catch(err => {
  console.error('❌ Failed to start dev server:', err);
  process.exit(1);
});
