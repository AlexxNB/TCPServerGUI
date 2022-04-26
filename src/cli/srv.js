import {spawn} from 'child_process';

export function runServer(host,port,guiport){
  const srv = spawn('node',['app.js'],{
    cwd: __dirname,
    windowsHide: true,
    stdio: 'inherit',
    detached: false,
    env: {
      ...process.env,
      HOST: host,
      PORT: port,
      GUI_PORT: guiport,
    }
  });

  const kill = ()=>srv.kill();

  process.on('SIGTERM', kill);
  process.on('exit', kill);
}