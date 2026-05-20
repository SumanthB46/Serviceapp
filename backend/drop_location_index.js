/**
 * One-time script: drop the stale 2dsphere index from the locations collection.
 * Run with: node drop_location_index.js
 * Then DELETE this file.
 */
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db('serviceapp');
    const collection = db.collection('locations');

    const indexes = await collection.indexes();
    console.log('Current indexes on locations:', indexes.map(i => i.name));

    // Drop the 2dsphere index if it exists
    const geoIndex = indexes.find(i => i.name && i.name.includes('2dsphere') || (i.key && i.key.coordinates === '2dsphere'));
    if (geoIndex) {
      await collection.dropIndex(geoIndex.name);
      console.log(`✅ Dropped index: ${geoIndex.name}`);
    } else {
      console.log('ℹ️  No 2dsphere index found — nothing to drop.');
    }

    const remaining = await collection.indexes();
    console.log('Remaining indexes:', remaining.map(i => i.name));
  } finally {
    await client.close();
  }
}

main().catch(console.error);
