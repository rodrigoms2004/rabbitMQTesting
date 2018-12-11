#!/usr/bin/env node

// Execution
// node emit_log_direct.js error "Run. Run. Or it will explode."
// node emit_log_direct.js warning "It could explode."
// node emit_log_direct.js info "It just exploded..."

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel( (err, ch) => {
        const ex = 'direct_logs'
        const args = process.argv.slice(2)
        const msg = process.argv.slice(1).join(' ') || 'Hello World'
        const severity = (args.length > 0) ? args[0] : 'info'

        ch.assertExchange(ex, 'direct', { durable: false })
        ch.publish(ex, severity, new Buffer(msg))
        console.log(" [x] Sent %s: '%s'", severity, msg)
    })
    setTimeout(() => { conn.close(); process.exit(0) }, 500)
})