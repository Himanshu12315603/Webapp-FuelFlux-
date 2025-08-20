import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/FUELFLUX';
const nozzleCollection = 'nozzles';
const targetStationId = '684977ebec9599cc429e87fe';

async function deleteAllForStation() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection.db;
  console.log('Connected to MongoDB');

  const res = await db.collection(nozzleCollection).deleteMany({ stationId: targetStationId });
  console.log(`Deleted ${res.deletedCount} documents for stationId ${targetStationId}`);
  await mongoose.disconnect();
}

deleteAllForStation().catch(err => {
  console.error('Delete all for station error:', err);
  process.exit(1);
});
