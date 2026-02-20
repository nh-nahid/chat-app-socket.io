const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined ${room}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data)
    });

     socket.on('typing', (username, room) => {
        socket.to(room).emit('user_typing', username)
    })

    socket.on('disconnect', (username, room) => {
        socket.to(room).emit('User disconnected', socket.id)
    })
})

server.listen(3001, () => {
    console.log('Server listening on port 3001');

})