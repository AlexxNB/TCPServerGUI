export function SSEMiddleware(req,res,next){
  let inited;

  /* Does request require SSE connection */
  req.isSSE = req.headers.accept === 'text/event-stream';

  if(req.isSSE){
    res.SSE = {
      /** Send event from server in opened SSE connection */
      send: function(event,data){
        !inited && (inited=initSSE(res)); // set SSE headers only on first send
        res.write(`event: ${event}\ndata: ${JSON.stringify(data||{})}\n\n`);
      }
    };
  }

  next();
}

/** Init SSE headers */
function initSSE(res){
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  return true;
}