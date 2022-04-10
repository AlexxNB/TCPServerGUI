import net from 'net';
import {store} from 'storxy';
import { nanoid } from 'nanoid';
import {PORT,HOST} from '@srv/constants';


export function runTCPServer(){

  const socketStore = createSocketStore();
  let num = 0;

  const server = net.createServer( socket => {
    const dataStore = store(null);

    const socketObj = {
      id: nanoid(),
      num: num++,
      ip: socket.remoteAddress,
      data: dataStore,
      send: data => socket.write(data),
      close: ()=>socket.destroy()
    };

    socketStore.add(socketObj);

    socket.on('data',data => dataStore.$ = data);
    socket.on('close',() => socketStore.delete(socketObj));
  });

  const kill = ()=>server.close();
  process.on('SIGTERM', kill);
  process.on('exit', kill);

  server.listen(PORT,HOST);

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