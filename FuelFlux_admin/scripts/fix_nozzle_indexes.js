// Script to drop old adminId_1_stationId_1 index, cleanup duplicates, and create correct unique index on stationId
// Usage: node fix_nozzle_indexes.js

const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/FUELFLUX'; // Update if your DB runs elsewhere
const nozzleSchema = new mongoose.Schema({
  stationId: String,
  stationName: String,
  petrol: Array,
  diesel: Array,
  cng: Array,
  electric: Array,
  other: Array
});
const Nozzle = mongoose.model('Nozzle', nozzleSchema, 'nozzles');

async function fixIndexes() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  // Drop old index if exists
  try {
    await db.collection('nozzles').dropIndex('adminId_1_stationId_1');
    console.log('Dropped old index adminId_1_stationId_1');
  } catch (err) {
    if (err.codeName === 'IndexNotFound') {
      console.log('Old index not found, skipping drop');
    } else {
      throw err;
    }
  }
  // Cleanup duplicates
  const groups = await Nozzle.aggregate([
    { $group: { _id: "$stationId", ids: { $push: "$_id" }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]);
  let totalRemoved = 0;
  for (const group of groups) {
    // Keep the most recent (highest _id)
    const ids = group.ids.sort((a, b) => b.toString().localeCompare(a.toString()));
    const toRemove = ids.slice(1); // keep first, remove rest
    if (toRemove.length > 0) {
      const res = await Nozzle.deleteMany({ _id: { $in: toRemove } });
      totalRemoved += res.deletedCount;
      console.log(`Removed ${res.deletedCount} duplicates for stationId ${group._id}`);
    }
  }
  // Create new unique index
  await db.collection('nozzles').createIndex({ stationId: 1 }, { unique: true });
  console.log('Created unique index on stationId');
  await mongoose.disconnect();
  console.log(`Index fix complete. Total duplicates removed: ${totalRemoved}`);
}

fixIndexes().catch(err => {
  console.error('Error during index fix:', err);
  process.exit(1);
});
