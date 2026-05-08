require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function forceUser() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/agroguru";
    console.log("Connecting to: " + uri);
    await mongoose.connect(uri);
    
    const email = "rushikeshjagtap1405@gmail.com";
    const name = "Rushikesh JAGTAP";
    const phone = "7276637699";
    const password = "password123";

    // Delete existing to be sure
    await mongoose.connection.db.collection('users').deleteOne({ email });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await mongoose.connection.db.collection('users').insertOne({
      name,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("\n--- USER CREATED/RESET SUCCESS ---");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("----------------------------------\n");
    
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

forceUser();
