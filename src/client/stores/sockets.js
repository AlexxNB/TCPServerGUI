import {store,computed} from 'storxy';
import {SSEClient,api} from '@/lib/api';

export const sockets = store([], st => {
  return SSEClient('/events/list',{
    list: data => {
      st.$ = JSON.parse(data);
    }
  });
});

export function makeSocketStore(id){
  const socketStore = store([], st => {

    // Get all messages till this moment
    api('/socket/'+id).then( currentData => {
      if(currentData) st.$ = currentData;
    });

    // Update store on new messages
    return SSEClient('/events/socket/'+id,{
      message: data => {
        st.$.push(JSON.parse(data));
      }
    });
  });

  // Send message
  socketStore.send = async function(data){
    return await api('/socket/'+id,data);
  };

  // Socket status info
  socketStore.status = computed(sockets, list => {
    return list && list.find( s => s.id == id );
  });

  return socketStore;
}

