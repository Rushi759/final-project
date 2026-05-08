require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');

async function checkUsers() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/agroguru";
    console.log("Connecting to: " + uri);
    await mongoose.connect(uri);
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    console.log("\n--- REGISTERED USERS ---");
    if (users.length === 0) console.log("(No users found)");
    users.forEach(u => {
      console.log(`- Email: "${u.email}" | Name: "${u.name}"`);
    });
    console.log("------------------------\n");
    
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

checkUsers();
