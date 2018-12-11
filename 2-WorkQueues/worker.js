#!/usr/bin/env node

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        const q = 'task_queue'

        ch.assertQueue(q, { durable: true })
        ch.prefetch(1)  // This tells RabbitMQ not to give 
                        // more than one message to a worker at a time. 
                        // Or, in other words, don't dispatch a new message 
                        // to a worker until it has processed and acknowledged 
                        // the previous one. Instead, it will dispatch it 
                        // to the next worker that is not still busy.
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q)
        ch.consume(q, (msg) => {
            const secs = msg.content.toString().split('.').length - 1

            console.log(" [x] Received %s", msg.content.toString())
            setTimeout(() => {
                console.log(" [x] Done")
                ch.ack(msg)
            }, secs * 1000)
        }, { noAck: false })
    })
})
