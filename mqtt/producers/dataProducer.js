const amqp = require('amqplib');
const mqtt = require('mqtt');
const { parsePayload } = require("../../parser");

const startProducer = async (req, res) => {
    const rmqConn = await amqp.connect("amqp://localhost");
    const channel = await rmqConn.createChannel();

    await channel.confirmChannel && channel.confirmChannel();

    console.log('RabbitMQ connected');

    const mqttClient = mqtt.connect('mqtt://localhost:1883');

    mqttClient.on('connect', ()=>{
        console.log('MQTT connected');
        mqttClient.subscribe('ihome/+');
    });

    mqttClient.on('message', async (topic, payload) => {
        try{
            const parsed = parsePayload(topic, payload);

            if(!parsed.deviceId) return;

            let routingKey;

            if(parsed.power.isHigh) {
                routingKey = 'device.power.high'
            } else {
                routingKey = 'device.power.normal';
            }

            channel.publish(
                'ihome_exchange',
                routingKey,
                Buffer.from(JSON.stringify(parsed)),
                { persistent: true}
            );

            console.log(`[-> RMQ] ${parsed.deviceId} | power: ${parsed.power.value}% | key: ${routingKey} | devices: ${parsed.devices.length}` )

        }catch(error){

            console.log("producer API Error: ",error.message);
        }
    })
    mqttClient.on('error', (err) => {
            console.error('MQTT error:', err)
    })
}

startProducer().catch(console.error)
