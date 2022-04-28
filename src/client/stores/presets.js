import { store } from 'storxy';

const KEY = 'saved_presets';

/** Store with presets */
export const presets = store( parse(localStorage.getItem(KEY)), st => {

  function update(e) {
    if(e.key === KEY) {
      st.$ = parse(e.newValue);
    }
  }

  // Update store if presets changes on other tab
  window.addEventListener('storage', update);
  return () => window.removeEventListener('storage', update);
});

// Dump list on every change
presets.subscribe(list => localStorage.setItem(KEY, list), true);

/** Add preset in a list */
presets.add = function (data) {
  presets.$.push(makePresetObject({ data: cloneObject(data) }));
  return presets.$[presets.$.length - 1];
};

/** Make preset object from {title,data} */
function makePresetObject(preset) {
  return {
    title: preset.title || 'Preset #' + (presets.$.length + 1),
    data: preset.data || [],
    rename(title) { this.title = title; },
    update(bytes) { this.data = bytes; },
    delete() { presets.$ = presets.$.filter(item => item !== this); }
  };
}

/** Parsing stored JSON to preset objects */
function parse(json) {
  return JSON.parse(json || '[]').map(makePresetObject);
}

/** Clone serializable object */
function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}