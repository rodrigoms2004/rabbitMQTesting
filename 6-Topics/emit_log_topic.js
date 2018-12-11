#!/usr/bin/env node

// Execution
/*
node emit_log_topic.js "kern.critical" "A critical kernel error"

node emit_log_topic.js "io.critical" "Bad thing happens"

*/

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel( (err, ch) => {
        const ex = 'topic_logs'
        const args = process.argv.slice(2)
        const key = (args.length > 0) ? args[0] : 'anonymous.info'
        const msg = args.slice(1).join(' ') || 'Hello World!'

        ch.assertExchange(ex, 'topic', { durable: false })
        ch.publish(ex, key, new Buffer(msg))
        console.log(" [x] Sent %s: '%s'", key, msg)
    })
    setTimeout(() => { conn.close(); process.exit(0) }, 500)
})
