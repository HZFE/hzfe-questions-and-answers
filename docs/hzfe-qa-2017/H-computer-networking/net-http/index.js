const net = require('net');
const server = net.createServer();

server.on('connection', (socket) => {
    socket.pipe(process.stdout);
    socket.write('data from server');
});

server.listen(3002, () => {
    console.log(`server is on ${JSON.stringify(server.address())}`);
});