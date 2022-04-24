export async function api(endpoint,data){
  try {

    const result = await fetch(endpoint,{
      method: data ? 'POST' : 'GET',
      headers: data && {
        'Content-Type': 'application/json'
      },
      body: data && JSON.stringify(data)
    });

    return result.ok ? result.json() : null;

  } catch (err) {

    console.log(err.message);
    return null;

  }
}

export function SSEClient(endpoint,handlers){
  let close = ()=>{};

  function listenList(){
    const source = new EventSource(endpoint);

    for(let event in handlers){
      source.addEventListener(event,e => handlers[event](JSON.parse(e.data)));
    }

    source.addEventListener('error', e => {
      if(e.eventPhase == EventSource.CLOSED) close();
      if(e.target.readyState == EventSource.CLOSED) {
        setTimeout(listenList,3000);
      }
    });

    close = ()=>source.close();
  }

  listenList();

  return ()=>close();
}