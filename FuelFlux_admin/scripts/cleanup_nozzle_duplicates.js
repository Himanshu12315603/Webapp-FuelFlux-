// Script to remove duplicate nozzle configs by stationId, keeping only the most recent one per station
// Usage: node cleanup_nozzle_duplicates.js

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

async function cleanupDuplicates() {
  await mongoose.connect(uri);
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
  await mongoose.disconnect();
  console.log(`Cleanup complete. Total removed: ${totalRemoved}`);
}

cleanupDuplicates().catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
