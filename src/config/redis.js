import {createClient} from 'redis'

const client = createClient({legacyMode: true});

client.on('connect', () => {
  console.info('Redis connected');
});
client.on('error', (err) => {
  console.error("Redis client error : ", err);
});
client.connect().then();

export const redisCli = client.v4;
