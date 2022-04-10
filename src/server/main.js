import server from '@server';

import {GUI_PORT} from '@srv/constants';
import {runTCPServer} from '@srv/lib/tcpserver';
import {SSEMiddleware} from '@srv/lib/sse';

const sockets = runTCPServer();

const app = server({
  port: GUI_PORT
});

app.use(SSEMiddleware);


/** Info about running server */
app.get('/server/info',(req,res)=>{
  res.send(sockets.info());
});


/** SSE: List of current connections */
app.get('/events/list',(req,res, next)=>{
  if(!req.isSSE) return next();

  res.SSE.init();

  const un = sockets.$$( list => {
    res.SSE.send('list',list);
  });

  res.on('close', un);
});

