const DEV = process.argv.includes('--dev');

// Svelte compile configuration
const malinaConfig = {
  css: false  //use `css:true` to inline CSS in `bundle.js`
};

/* Edit this file below only if know what you doing! */

const { fork } = require("child_process");
const { build } = require("esbuild");
const { createRemote } = require("derver");
const {malinaPlugin} = require("malinajs/malina-esbuild");
const {sveltePaths} = require('esbuild-svelte-paths');
const watch = require("node-watch");
const path = require("path");

const CWD = process.cwd();

const remote = DEV && createRemote('malina_fullstack_template');

(async()=>{
  const bundleServer = await build_server();
  const bundleClient = await build_client();

  if(DEV){

    nodemon(path.join(CWD,'dist','app.js'),{cwd:path.join(CWD,'dist')});

    watch(path.join(CWD,'src','client'),{ recursive: true }, async function() {
      try {
        await bundleClient.rebuild();
      } catch (err){
        remote.error(err.message,'Svelte compile error');
      }
    });

    watch(path.join(CWD,'src','server'),{ recursive: true }, async function() {
      await bundleServer.rebuild();
      await bundleClient.rebuild();
      console.log('Restarting server...');
    });
  }
})();

async function build_server(){
  return await build({
    entryPoints: ['src/server/main.js'],
    bundle: true,
    outfile: 'dist/app.js',
    platform: 'node',
    sourcemap: DEV, // Use `DEV && 'inline'` to inline sourcemaps to the bundle
    minify: !DEV,
    incremental: DEV,
    plugins:[
      plugin_server()
    ]
  });
}

async function build_client(){
  return await build({
    entryPoints: ['src/client/main.js'],
    bundle: true,
    outfile: 'dist/static/build/bundle.js',
    sourcemap: DEV, // Use `DEV && 'inline'` to inline sourcemaps to the bundle
    minify: !DEV,
    incremental: DEV,
    plugins: [
      sveltePaths( {extension: 'xht'} ),
      malinaPlugin(malinaConfig)
    ]
  });
}

function plugin_server(){
  return {
    name: 'server-plugin',
    setup(b) {
      b.onResolve({ filter: /^@server$/ }, () => {
        return { path: DEV ? 'server_development.js' : 'server_production.js', namespace: 'server' };
      });

      b.onLoad({ filter: /^server_development\.js$/, namespace: 'server'}, () => {
        return {
          contents: `
              import {derver} from "derver";
              import path from "path";
              const DIR = path.join(__dirname,'static');
              export default function (options){
                  return derver({
                      dir: path.join(__dirname,'static'),
                      ...options,
                      remote: 'malina_fullstack_template'
                  });
              }
          `,
          resolveDir: CWD
        };
      });

      b.onLoad({ filter: /^server_production\.js$/, namespace: 'server'}, () => {
        return {
          contents: `
                    import {derver} from "derver";
                    import path from "path";
                    const DIR = path.join(__dirname,'static');
                    export default function (options){
                        return derver({
                            dir: path.join(__dirname,'static'),
                            cache: true,
                            compress: true,
                            watch: false,
                            host: "0.0.0.0",
                            ...options
                        });
                    }
                `,
          resolveDir: CWD
        };
      });
    }
  };
}

function nodemon(path,options){
  let child;
  const kill = ()=>{
    child && child.kill();
  };

  const start = () => {
    child = fork(path, [], options);
  };

  process.on('SIGTERM', kill);
  process.on('exit', kill);

  start();
  watch(path,()=>{
    kill();
    start();
  });
}
