import sade from 'sade';
import PKG from './../../package.json';
import {runServer} from './srv';
import {runEchoClient} from './echo';

sade('tcpsrv',true)
  .version(PKG.version)
  .describe('Run TCP Server and Web-GUI to debug connections')
  .example('tcpsrv')
  .example('tcpsrv --port 10000')
  .example('tcpsrv --host 0.0.0.0 --port 5050')
  .option('-g, --guiport','Port to bind Web-GUI',7000)
  .option('-p, --port','Port to bind TCP Server',6969)
  .option('-h, --host','Hostname to bind TCP Server and Web-GUI','localhost')
  .option('-e, --echo','Run echo-client for testing purposes',false)
  .action( opts => {
    if(opts.echo)
      runEchoClient(opts.host,opts.port);
    else
      runServer(opts.host,opts.port,opts.guiport);
  })
  .parse(process.argv);
