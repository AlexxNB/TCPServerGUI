import net from 'net';
import {store} from 'storxy';
import { nanoid } from 'nanoid';
import {PORT,HOST} from '@srv/constants';


export function runTCPServer(){

  const socketStore = createSocketStore();
  let num = 0;

  const server = net.createServer( socket => {

    const socketObj = {
      id: nanoid(),
      num: num++,
      ip: socket.remoteAddress,
      data: store([]),
      send(data){
        socket.write(data);
        this.data.$.push({type:'out',data: data.toJSON().data});
      },
      close: ()=>socket.destroy()
    };

    socket.on('data',data => socketObj.data.$.push({type:'in',data: data.toJSON().data}));
    socket.on('close',() => {
      socketStore.delete(socketObj);
      console.log(`The connection #${socketObj.num} was closed.`);
    });

    socketStore.add(socketObj);
    console.log(`New connection #${socketObj.num} from ${socketObj.ip}`);
  });

  const kill = ()=>server.close();
  process.on('SIGTERM', kill);
  process.on('exit', kill);

  server.listen(PORT,HOST);
  console.log(`TCP Server started on ${HOST}:${PORT}`);

  return socketStore;
}

function createSocketStore(){
  const sockets = new Set();
  const socketStore = store([]);

  const update = () => socketStore.$ = Array.from(sockets).map(s => (
    {
      id:s.id,
      num: s.num,
      ip: s.ip,
    }
  ));

  socketStore.add = function(socket){
    sockets.add(socket);
    update();
  };

  socketStore.delete = function(socket){
    sockets.delete(socket);
    update();
  };

  socketStore.get = function(id){
    return Array.from(sockets).find( s => s.id === id);
  };

  socketStore.info = function(){
    return {
      host: HOST,
      port: PORT,
    };
  };

  return socketStore;
}