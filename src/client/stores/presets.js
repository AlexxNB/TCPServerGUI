import {store} from 'storxy';

const KEY = 'saved_requests';

export const presets = store( loadList(), st => {

  function update(e){
    if(e.key === KEY){
      st.$ = parse( e.newValue );
    }
  }

  window.addEventListener('storage',update);

  return ()=>window.removeEventListener('storage',update);
});

presets.subscribe( saveList, true );

presets.add = function(data){
  presets.$.push(makeRequestObject({data: JSON.parse(JSON.stringify(data))}));
  return presets.$[presets.$.length -1];
};

function makeRequestObject(request){
  return {
    title: request.title || 'Preset #'+(presets.$.length+1),
    data: request.data || [],
    rename(title){ this.title = title; },
    update(bytes){ this.data = bytes; },
    delete(){ presets.$ = presets.$.filter( item => item !== this ); }
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