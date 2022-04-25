import {spawnSync} from 'child_process';

export function runServer(host,port,guiport){
  spawnSync('node',['app.js'],{
    cwd: __dirname,
    windowsHide: true,
    stdio: ['inherit','inherit','inherit'],
    env: {
      ...process.env,
      HOST: host,
      PORT: port,
      GUI_PORT: guiport,
    }
  });
}