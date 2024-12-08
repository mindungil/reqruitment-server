import {createClient} from 'redis'

const client = createClient({
  legacyMode: true
});

client.on('connect', () => {
  console.info('Redis connected');
});
client.on('error', (err) => {
  console.error("Redis client error : ", err);
});
client.connect().then();

const redisCli = client.v4;

export default redisCli;
