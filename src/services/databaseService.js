const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectDb() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
        return client.db("stockData"); // Return the database instance to use
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1); // Exit the app if cannot connect to the database
    }
}

async function insertDocument(collectionName, document) {
    const db = await connectDb();
    const collection = db.collection(collectionName);
    return await collection.insertOne(document);
}

// Export functions for use in other parts of your application
module.exports = { connectDb, insertDocument };
