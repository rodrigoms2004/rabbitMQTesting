#!/usr/bin/env node

// Execution
/*
To receive all the logs:
node receive_logs_topic.js "#"

To receive all logs from the facility "kern":
node receive_logs_topic.js "kern.*"

Or if you want to hear only about "critical" logs:
node receive_logs_topic.js "*.critical"

You can create multiple bindings:
node receive_logs_topic.js "kern.*" "*.critical"
*/

const amqp = require('amqplib/callback_api')

const args = process.argv.slice(2)

if (args.length == 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel( (err, ch) => {
        const ex = 'topic_logs'

        ch.assertExchange(ex, 'topic', { durable: false })

        ch.assertQueue('', { exclusive: true }, (err, q) => {
            console.log(' [*] Waiting for logs. To exit press CTRL+C')

            args.forEach((key) => {
                ch.bindQueue(q.queue, ex, key)
            })

            ch.consume(q.queue, (msg) => {
                console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, { noAck: true })
        })
    })
})