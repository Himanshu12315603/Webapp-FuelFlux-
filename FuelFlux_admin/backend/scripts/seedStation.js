import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PetrolPump from '../models/PetrolPump.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fuelflux';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const station = new PetrolPump({
    name: 'Test Pump',
    lat: 22.7680,
    lon: 73.6096,
    contact: '9999999999',
    status: 'Active',
    fuelTypes: ['petrol', 'diesel'],
    operator: 'Test Operator',
    nozzles: { petrol: 2, diesel: 2 },
    prices: { petrol: 100, diesel: 90 },
  });

  await station.save();
  console.log('Seeded station:', station);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
