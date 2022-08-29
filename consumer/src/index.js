const Kafka = require('node-rdkafka')
const topic = 'testing'
const config = require('./shared/config')

const consumer = Kafka.KafkaConsumer({
    'metadata.broker.list': config.META_BROKER_LIST,
    'group.id': 'kafka',
}, {
    'auto.offset.reset': 'earliest',
})

consumer.on('ready', (info, metadata) => {
    console.log('ready', info, metadata)

    consumer.subscribe([topic])
    consumer.consume()
})

consumer.on('data',  ({key, value, partition, offset}) => {
    console.log(`Consumed record with key ${key} and value ${value} of partition ${partition} @ offset ${offset}.`);
})

consumer.on('event.error', (err) => {
    console.log('event.error', error)
})

consumer.on('event.log', (event) => {
    console.log('event.log', event)
})

consumer.connect()