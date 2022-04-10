import {store} from 'storxy';
import {SSEClient} from '@/lib/api';

export const sockets = store([], st => {
  return SSEClient('/events/list',{
    list: data => {
      st.$ = JSON.parse(data);
    }
  });
});