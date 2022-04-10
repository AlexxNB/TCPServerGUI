const net = require('net');

const PORT = 6969;

const client = new net.Socket();

client.connect(PORT,'localhost',()=>{
  console.log('Connected!');
});

client.on('data',(data)=>{
  console.log('DATA: ' + data);
  client.write(data);
});

client.on('close', function() {
  console.log('Connection closed');
});