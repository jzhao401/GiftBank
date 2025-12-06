/**
 * Quick connectivity test
 */

const fetch = require('node-fetch');

async function quickTest() {
  console.log('Testing backend connection...');
  
  try {
    const response = await fetch('http://localhost:3060');
    const text = await response.text();
    console.log('✓ Backend responded:', text);
    console.log('Status:', response.status);
  } catch (error) {
    console.log('✗ Backend connection failed:', error.message);
  }

  console.log('\nTesting MongoDB...');
  try {
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient('mongodb://127.0.0.1:27017', {
      serverSelectionTimeoutMS: 2000
    });
    await client.connect();
    console.log('✓ MongoDB connected');
    
    const db = client.db('giftdb');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name).join(', '));
    
    await client.close();
  } catch (error) {
    console.log('✗ MongoDB connection failed:', error.message);
  }
}

quickTest();
