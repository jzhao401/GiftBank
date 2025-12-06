// Script to add sample comments to all gifts in MongoDB
require("dotenv").config({ path: "./envs" });
const MongoClient = require("mongodb").MongoClient;

const url = process.env.MONGO_URL;
const dbName = "giftdb";

// Sample comments with different sentiments
const sampleComments = [
  {
    author: "John Doe",
    comment: "I would like this! This looks amazing!",
    sentiment: "positive",
    createdAt: new Date("2024-11-01T10:30:00Z").toISOString()
  },
  {
    author: "Jane Smith",
    comment: "Just DMed you. Hope it's still available.",
    sentiment: "neutral",
    createdAt: new Date("2024-11-02T14:20:00Z").toISOString()
  },
  {
    author: "Alice Johnson",
    comment: "I will take it if it's still available. Really need this!",
    sentiment: "positive",
    createdAt: new Date("2024-11-03T09:15:00Z").toISOString()
  },
  {
    author: "Mike Brown",
    comment: "This is a good one! Perfect for my needs.",
    sentiment: "positive",
    createdAt: new Date("2024-11-04T16:45:00Z").toISOString()
  },
  {
    author: "Sarah Wilson",
    comment: "My family can use one. DM me if it is still available. Thank you!",
    sentiment: "positive",
    createdAt: new Date("2024-11-05T11:00:00Z").toISOString()
  },
  {
    author: "David Lee",
    comment: "Condition doesn't look great from the photos.",
    sentiment: "negative",
    createdAt: new Date("2024-11-06T13:30:00Z").toISOString()
  },
  {
    author: "Emma Davis",
    comment: "Is this still available? Would love to have it.",
    sentiment: "neutral",
    createdAt: new Date("2024-11-07T08:50:00Z").toISOString()
  },
  {
    author: "Robert Taylor",
    comment: "Great item! Exactly what I've been looking for!",
    sentiment: "positive",
    createdAt: new Date("2024-11-08T15:20:00Z").toISOString()
  }
];

async function addCommentsToGifts() {
  let client;
  
  try {
    client = new MongoClient(url);
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db(dbName);
    const giftsCollection = db.collection("gifts");
    
    // Get all gifts
    const gifts = await giftsCollection.find({}).toArray();
    console.log(`Found ${gifts.length} gifts`);
    
    // Add comments to each gift (randomly select 3-5 comments per gift)
    for (const gift of gifts) {
      const numComments = Math.floor(Math.random() * 3) + 3; // 3-5 comments
      const selectedComments = [];
      
      // Randomly select comments
      const shuffled = [...sampleComments].sort(() => 0.5 - Math.random());
      for (let i = 0; i < numComments && i < shuffled.length; i++) {
        selectedComments.push(shuffled[i]);
      }
      
      // Update the gift with comments
      await giftsCollection.updateOne(
        { _id: gift._id },
        { $set: { comments: selectedComments } }
      );
      
      console.log(`Added ${numComments} comments to gift: ${gift.name}`);
    }
    
    console.log("Successfully added comments to all gifts!");
    
  } catch (error) {
    console.error("Error adding comments:", error);
  } finally {
    if (client) {
      await client.close();
      console.log("MongoDB connection closed");
    }
  }
}

// Run the script
addCommentsToGifts();
