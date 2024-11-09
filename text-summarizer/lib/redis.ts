import Redis from 'redis'

const client = Redis.createClient({
    url: process.env.REDIS_URL
})

client.on("error", (error) => {
    console.error("Redis Error: ", error)
})

client.connect()

export default client