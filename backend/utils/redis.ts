import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("Redis connected");
  }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key: string, value: any, ttlSeconds = 300) => {
  await redis.setEx(key, ttlSeconds, JSON.stringify(value));
};

export const deleteCache = async (key: string) => {
  await redis.del(key);
};

export default redis;
