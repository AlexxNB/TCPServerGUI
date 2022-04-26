const {test} = require('uvu');
const asserts = require('uvu/assert');
const waitPort = require('wait-port');
const puppeteer = require('puppeteer');
const {spawn} = require('child_process');
const {readdirSync} = require('fs');
const path = require('path');


test.before(async ctx => {
  // Run server
  ctx.srv = runCLI(['--port',6970,'--host','localhost','--guiport',7001]);
  await wait(6970);
  await wait(7001);

  // Run echo-client
  ctx.client = runCLI(['--echo','--port',6970,'--host','localhost']);

  // Run Pptr
  ctx.browser = await puppeteer.launch();
});

test.before.each(async ctx => {
  // Setup new page
  ctx.page = patchHandle(await ctx.browser.newPage());
  await ctx.page.goto('http://localhost:7001');
  await ctx.page.waitForSelector('li > a');
});

test.after.each(async ctx => {
  await ctx.page.close();
});

test.after(async ctx => {
  // Cleanup
  ctx.browser.close();
  ctx.srv.kill();
  ctx.client.kill();
});

// Run all tests
for(let module of getTestModules()){
  module(function(name,cb){
    test(name,async ctx => {
      await cb(ctx.page,asserts);
    });
  });
}
test.run();

/** Returns an array of test modules */
function getTestModules(){
  return readdirSync(path.join(__dirname,'tests'))
    .filter( file => /^\d+_.+$/.test(file))
    .sort((a,b)=>Number(a.split('_')[0])-Number(b.split('_')[0]))
    .map( file => require(path.join(__dirname,'tests',file)));
}

/** Runs CLI in spawned process */
function runCLI(args=[]){
  args.unshift('tcpsrv');
  const cli = spawn('node',args,{
    cwd: path.join(__dirname,'..','dist'),
    stdio: 'ignore',
    detached: false
  });

  const kill = ()=>cli.kill();

  process.on('SIGTERM', kill);
  process.on('exit', kill);

  return cli;
}

/** Wait until port will be available */
function wait(port){
  return waitPort({
    host: 'localhost',
    port: port,
    timeout: 1000,
  });
}

/** Add helpful queries and methods to the Pptr's elementHandle object */
function patchHandle(elHandle){
  if(elHandle){
    elHandle.find = async function(selector){
      return patchHandle(await elHandle.$(selector));
    };

    elHandle.findAll = async function(selector='*'){
      return (await elHandle.$$(selector)).map(patchHandle);
    };

    elHandle.findByTextAll = async function(text,selector){
      return asyncFilter(await elHandle.findAll(selector), async el => {
        const value = await el.getText();
        return (text instanceof RegExp)
          ? text.test(value)
          : text===value;
      });
    };

    elHandle.findByText = async function(text,selector){
      const [el] = await elHandle.findByTextAll(text,selector);
      return el;
    };


    elHandle.getText = () => elHandle.evaluate( e => e.innerText && e.innerText.trim());
    elHandle.getValue = () => elHandle.evaluate( e => e.value);
    elHandle.getAttr = (name) => elHandle.evaluate( (e,n) => e.getAttribute(n),name);
    elHandle.isDisabled = async() => (await elHandle.getAttr('disabled')) !== null;
  }

  return elHandle;
}

async function asyncFilter(arr, predicate){
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => results[index]);
}