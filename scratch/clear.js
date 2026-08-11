const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://neondb_owner:npg_R4UiwyVr7cFZ@ep-broad-flower-az60zfzn.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

async function clearDB() {
  await client.connect();
  console.log('Connected to Neon DB');
  
  try {
    // Delete all chats, tasks, goals first due to foreign keys
    await client.query('DELETE FROM chat;');
    await client.query('DELETE FROM task;');
    await client.query('DELETE FROM goal;');
    // Then delete all users
    await client.query('DELETE FROM users;');
    console.log('Successfully deleted all users and related data!');
  } catch (err) {
    console.error('Error deleting data', err);
  } finally {
    await client.end();
  }
}

clearDB();
