import server from '@server';

import { GUI_PORT } from '@srv/constants';
import { runTCPServer } from '@srv/lib/tcpserver';
import { SSEMiddleware } from '@srv/lib/sse';
import { errorMiddleware } from '@srv/lib/error';

const sockets = runTCPServer();

const app = server({
  port: GUI_PORT
});

app.use(errorMiddleware, SSEMiddleware);


/** Info about running server */
app.get('/server/info', (req, res) => {
  res.send(sockets.info());
});

/** SSE: List of current connections */
app.get('/events/list', (req, res, next) => {
  if(!req.isSSE) return next();

  res.SSE.init();

  const un = sockets.$$(list => {
    res.SSE.send('list', list);
  });

  res.on('close', un);
});

/** Get socket data */
app.get('/socket/:socket_id', (req, res) => {
  const socket = sockets.get(req.params.socket_id);
  if(!socket) return res.error('Unknown socket ID');

  res.send(socket.data.$);
});

/** Send data to socket */
app.post('/socket/:socket_id', (req, res) => {
  const socket = sockets.get(req.params.socket_id);
  if(!socket) return res.error('Unknown socket ID');

  try {
    socket.send( Buffer.from(req.body) );
    res.send({ok:true});
  } catch (err) {
    res.error(err.message);
  }
});

/** SSE: Listen socket data */
app.get('/events/socket/:socket_id', (req, res, next) => {
  if(!req.isSSE) return next();

  res.SSE.init();

  const socket = sockets.get(req.params.socket_id);
  if(!socket) return res.error('Unknown socket ID');

  const un = socket.data.$$(data => {
    res.SSE.send('message', data[data.length - 1]);
  },true);
  res.on('close', un);
});

