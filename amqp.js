const amqp = require("amqplib")

const setup = async () => {

    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        await channel.assertExchange('ihome_exchange', 'topic', { durable: true }),

        await channel.assertQueue('ihome.dashboard', { durable: true });
        await channel.bindQueue('ihome.dashboard', 'ihome_exchange', 'device.#')

        await channel.assertQueue('ihome.alerts', { durable: true });
        await channel.bindQueue('ihome.alerts', 'ihome_exchange', 'device.power.high')

        await channel.assertQueue('ihome.logger', { durable: true });
        await channel.bindQueue('ihome.logger', 'ihome_exchange', 'device.#')

        console.log('Exchange and Queues binded and ready')

        await channel.close();
        await connection.close()

    } catch (error) {
        console.log("amqp setup error: ", error.message)

        return res.status(500).json({
            status: "error",
            message: "Internal error message"
        })
    }



}
