import net from 'net';

export function runEchoClient(host,port){
  const client = new net.Socket();

  client.connect(port,host,()=>{
    console.log(arguments)
    console.log('Connected!');
    client.write('Hello!');
  });


  client.on('data',(data)=>{
    console.log('IN:  ' + data);
    client.write(data);
    console.log('OUT:  ' + data);
  });

  client.on('close', function() {
    console.log('Connection closed');
  });

  client.on('error', function(err) {
    console.log('Error: '+err.message);
  });
}