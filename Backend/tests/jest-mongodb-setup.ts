import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
//@ts-ignore
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  //@ts-ignore
  await mongoose.connect(uri);
});

afterEach(async () => {
  // Clean all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  //@ts-ignore
  await mongoServer.stop();
});
