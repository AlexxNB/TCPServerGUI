export const modes = {

  hex:{
    length: 2,                            // Length of byte's value
    lead: '0',                            // Add lead symbols to the byte value
    uppercase: true,                      // Should byte's value be uppercased
    filter: '0-9ABCDEF',                  // Set of allowed symbols
    value: int => int.toString(16),       // Get value from integer
    int: value => parseInt(value, 16)     // Get integer from byte's value
  },

  dec:{
    length: 3,
    filter: '0-9',
    check: value => value > 255 ? 255 : value,  // Some additional handle of the byte's value
    value: int => String(int),
    int: value => parseInt(value, 10)
  },

  ascii:{
    length: 1,
    value: int => String.fromCharCode(int),
    int: value => value.charCodeAt(0)
  }
};