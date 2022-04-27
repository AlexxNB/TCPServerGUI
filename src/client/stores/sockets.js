import {store,computed} from 'storxy';
import {SSEClient,api} from '@/lib/api';

/** Store for connections list */
export const socketsList = store([], st => {

  // Update store value when new list recieved
  return SSEClient('/events/list',{
    list: data => {
      st.$ = data;
    }
  });
});

/** Make connection store by its id */
export function makeSocketStore(id){
  const socketStore = store([], async st => {

    // Get all messages till this moment
    const currentData = await api('/socket/'+id);

    if(currentData !== null) {
      // Make all messages history as store value
      st.$ = currentData;

      // Open SSE connection and add all new messages to store value
      return SSEClient('/events/socket/'+id,{
        message: data => {
          st.$.push(data);
        }
      });
    }
  });

  /** Send message method  */
  socketStore.send = async function(data){
    return await api('/socket/'+id,data);
  };

  // Socket status info
  socketStore.status = computed(socketsList, list => {
    return list && list.find( s => s.id == id );
  });

  return socketStore;
}