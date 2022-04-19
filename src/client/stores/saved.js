import {store} from 'storxy';

const KEY = 'saved_requests';

export const saved = store( loadList(), st => {

  function update(e){
    if(e.key === KEY){
      st.$ = parse( e.newValue );
    }
  }

  window.addEventListener('storage',update);

  return ()=>window.removeEventListener('storage',update);
});

saved.subscribe( saveList, true );

saved.add = function(data){
  saved.$.push(makeRequestObject({data}));
};

function makeRequestObject(request){
  return {
    title: request.title || 'Preset #'+(saved.$.length+1),
    data: request.data || [],
    rename(title){ this.title = title; },
    update(bytes){ this.data = bytes; },
    delete(){ saved.$ = saved.$.filter( item => item !== this ); }
  };
}

function saveList(list){
  localStorage.setItem(KEY, JSON.stringify(list) );
}

function loadList(){
  return parse(localStorage.getItem(KEY));
}

function parse(json){
  return JSON.parse( json || '[]' ).map(makeRequestObject);
}