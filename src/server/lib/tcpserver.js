import net from 'net';
import {store} from 'storxy';
import { nanoid } from 'nanoid';
import {PORT,HOST} from '@srv/constants';

/** Start TCP server */
export function runTCPServer(){

  const socketStore = createSocketStore();
  let num = 0; // Connections counter

  const server = net.createServer( socket => {

    /** Object for current connection */
    const socketObj = {
      id: nanoid(),
      num: num++,
      ip: socket.remoteAddress,
      data: store([]),  // Array of incoming and outgoing data objects

      /** Send data to socket */
      send(data){
        socket.write(data);
        this.data.$.push({type:'out',data: data.toJSON().data});
      },

      /** Close connection */
      close(){
        socket.destroy();
      }
    };

    /* Push data object to the store on incoming message */
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
  const sockets = new Set(); // Set to store sockets
  const socketStore = store([]); // Array of info about each socket: id,ip and number

  /** Update store value from current Set */
  const update = () => socketStore.$ = Array.from(sockets).map(s => (
    {
      id:s.id,
      num: s.num,
      ip: s.ip,
    }
  ));

  /** Add socket in Set */
  socketStore.add = function(socket){
    sockets.add(socket);
    update();
  };

  /** Delete socket from Set */
  socketStore.delete = function(socket){
    sockets.delete(socket);
    update();
  };

  /** Return socketObj object by its id */
  socketStore.get = function(id){
    return Array.from(sockets).find( s => s.id === id);
  };

  /** Return info about server's params */
  socketStore.info = function(){
    return {
      host: HOST,
      port: PORT,
    };
  };

  return socketStore;
}