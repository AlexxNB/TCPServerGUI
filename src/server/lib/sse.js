export function SSEMiddleware(req,res,next){
  let inited;

  req.isSSE = req.headers.accept === 'text/event-stream';

  if(req.isSSE){
    res.SSE = {
      send: function(event,data){
        !inited && (inited=initSSE(res));
        res.write(`event: ${event}\ndata: ${JSON.stringify(data||{})}\n\n`);
      }
    };
  }

  next();
}

function initSSE(res){
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  return true;
}