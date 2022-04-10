export function SSEMiddleware(req,res,next){

  req.isSSE = req.headers.accept === 'text/event-stream';

  res.SSE = {
    init: function(){
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
    },
    send: function(event,data){
      res.write(`event: ${event}\ndata: ${JSON.stringify(data||{})}\n\n`);
    }
  };

  next();
}