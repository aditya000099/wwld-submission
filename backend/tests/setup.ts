import { jest, beforeAll, afterAll, afterEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

process.env.JWT_SECRET = "testsecret";

let mongoServer: MongoMemoryServer;

// Mock Redis
jest.mock("../utils/redis.ts", () => ({
    connectRedis: jest.fn(),
    getCache: jest.fn().mockResolvedValue(null),
    setCache: jest.fn(),
    deleteCache: jest.fn(),
    __esModule: true,
    default: {
        on: jest.fn(),
        isOpen: true,
        connect: jest.fn(),
        get: jest.fn(),
        setEx: jest.fn(),
        del: jest.fn(),
    },
}));

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
