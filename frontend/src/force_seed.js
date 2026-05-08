const mongoose = require('mongoose');

// We'll use the same URI as the backend
const mongoURI = "mongodb://localhost:27017/agroguru";

async function forceSeed() {
    try {
        console.log("Connecting...");
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");

        // Dynamically load models using schemas if needed, or just use collection names
        const db = mongoose.connection.db;
        const users = db.collection('users');
        const user = await users.findOne({ email: "rushikeshjagtap1405@gmail.com" });

        if (!user) {
            console.log("USER NOT FOUND! Creating dummy user...");
            // If user doesn't exist, we might need to create one, but for now let's hope it does.
        }
        const uid = user ? user._id : new mongoose.Types.ObjectId();

        console.log("Clearing old data...");
        await db.collection('nurseries').deleteMany({});
        await db.collection('markets').deleteMany({});
        await db.collection('laboratories').deleteMany({});

        const locations = [
            { name: "Kolhapur (Ghodawat Univ)", coords: [74.3496, 16.7388] },
            { name: "Pune Center", coords: [73.8567, 18.5204] },
            { name: "Mumbai Hub", coords: [72.8777, 19.0760] },
            { name: "Bangalore Agri", coords: [77.5946, 12.9716] },
            { name: "Delhi North", coords: [77.2090, 28.6139] }
        ];

        for (let loc of locations) {
            await db.collection('nurseries').insertOne({
                name: loc.name + " Nursery",
                address: loc.name + ", India",
                phone: "9876543210",
                timing: { opening: "8:00 AM", closing: "7:00 PM" },
                offDay: "Sunday",
                userId: uid,
                geometry: { type: "Point", coordinates: loc.coords },
                createdAt: new Date()
            });
            await db.collection('markets').insertOne({
                name: loc.name + " Market",
                address: loc.name + ", India",
                phone: "9988776655",
                items: [{ item: "Seeds", price: "200" }],
                userId: uid,
                geometry: { type: "Point", coordinates: loc.coords },
                createdAt: new Date()
            });
            await db.collection('laboratories').insertOne({
                name: loc.name + " Lab",
                address: loc.name + ", India",
                phone: "9123456789",
                Services: [{ sname: "Soil Test" }],
                userId: uid,
                geometry: { type: "Point", coordinates: loc.coords },
                createdAt: new Date()
            });
            console.log("Added: " + loc.name);
        }

        console.log("SUCCESS! Seeding done.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

forceSeed();
