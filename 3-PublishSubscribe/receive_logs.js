#!/usr/bin/env node

// Execution
// node receive_logs.js > logs_from_rabbit.log

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel( (err, ch) => {
        const ex = 'logs'

        ch.assertExchange(ex, 'fanout', { durable: true })

        // When the connection that declared it closes, 
        // the queue will be deleted because it is declared as exclusive. 
        // Exclusive (used by only one connection and the queue will be deleted when that connection closes)
        // https://www.rabbitmq.com/queues.html
        ch.assertQueue('', { exclusive: true }, (err, q) => {
            console.log(" [*] Waiting for messages in %s; To exist press CTRL+C", q.queue)
            ch.bindQueue(q.queue, ex, '')

            ch.consume(q.queue, (msg) => {
                if (msg.content) {
                    console.log(" [x] %s", msg.content.toString())
                }
            }, { noAck: true })
        }) 
    })
})
