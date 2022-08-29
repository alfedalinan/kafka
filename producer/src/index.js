const Kafka = require('node-rdkafka')
const topic = 'testing'
const config = require('./shared/config')

function createTopicIfNotExists(topicName) {
    const client = Kafka.AdminClient.create({
        'metadata.broker.list': config.META_BROKER_LIST,
    })

    client.createTopic({
        topic,
        num_partitions: 1,
        replication_factor: 1
    }, (err) => {
        if (err) {
            console.log(err)
        }
    })
}

function initializeProducer() {

    // createTopicIfNotExists(topic)

    const stream = new Kafka.Producer.createWriteStream({
        'metadata.broker.list': config.META_BROKER_LIST,
        'dr_cb': true,
    }, {} , {
        topic,
        num_partitions: 1,
        replication_factor: 1
    })
    
    stream.producer.on('event.log', (log) => {
        console.log('event.log', log)
    })

    stream.producer.on('event.error', function(err) {
        console.error('Error from producer');
        console.error(err);
    })

    stream.producer.on('delivery-report', function(err, report) {
        console.log('delivery-report: ' + JSON.stringify(report));
    })

    stream.producer.on('ready', (info, metadata) => {
        console.log('ready', info, metadata)
    })

    return stream
}

function produce(stream, data) {

    stream.write(JSON.stringify(data))

}

const producerStream = initializeProducer()

var payload = {
    status: 'OK',
    message: 'Hello! From My Main Device!!'
}

produce(producerStream, payload)

