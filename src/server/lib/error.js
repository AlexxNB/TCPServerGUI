export function errorMiddleware(req,res,next){
  res.error = function(message,status=500){
    res.statusCode = status;
    res.end(message);
  };
  next();
}