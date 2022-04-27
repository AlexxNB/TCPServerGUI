/** Simple Fetch wrapper which sends GET and POST requests and parse JSON data */
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

/** SSE connection which runs callbacks according received event */
export function SSEClient(endpoint,handlers){
  const source = new EventSource(endpoint);

  for(let event in handlers){
    source.addEventListener(event,e => handlers[event](JSON.parse(e.data)));
  }

  return ()=>source.close();
}