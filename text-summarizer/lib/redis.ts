import { createClient } from "@redis/client"

const client = createClient({
    url: process.env.REDIS_URL
})

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await client.connect()
})();

export default client