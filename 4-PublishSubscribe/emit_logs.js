#!/usr/bin/env node

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel( (err, ch) => {
        const ex = 'logs';  // exchange
        const msg = process.argv.slice(2).join(' ') || 'Hello World'
        
        ch.assertExchange(ex, 'fanout', {durable: true})
        ch.publish(ex, '', new Buffer(msg)) // '' not specified queue
        console.log(" [x] Sent %s", msg)
    })
    setTimeout(() => { conn.close(); process.exit(0) }, 500)
})

