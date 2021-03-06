#!/usr/bin/env node

const amqp = require('amqplib/callback_api')

const sendTasks = (id) => {
    amqp.connect('amqp://localhost', (err, conn) => {
        conn.createChannel((err, ch) => {
            const q = 'task_queue'
            const msg = process.argv.slice(2).join('') || 'Hello World! ' + id
    
            ch.assertQueue(q, {durable: true})
            ch.sendToQueue(q, new Buffer(msg), {persistent: true})
            console.log(" [x] Sent %s", msg)
        })
        setTimeout(() => {conn.close(); process.exit(0) }, 500)
    })    
}

for (let i = 0; i <= 1000; i++) {
    sendTasks(i)
}

