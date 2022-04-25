import net from 'net';

export function runEchoClient(host,port){
  const client = new net.Socket();

  client.connect(port,host,()=>{
    console.log('Connected!');
    client.write('Hello!');
  });

  client.on('data',(data)=>{
    const hexData = data.toJSON().data.map(int => int
      .toString(16)
      .padStart(2,'0')
      .toUpperCase()
    ).join(' ');
    console.log(' IN: ' + hexData);
    client.write(data);
    console.log('OUT: ' + hexData);
  });

  client.on('close', function() {
    console.log('Connection closed');
  });

  client.on('error', function(err) {
    console.log('Error: '+err.message);
  });
}