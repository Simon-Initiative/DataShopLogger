
//import CTATLoggingLibrary from '../lib/datashoplogger.min.js';

import SimonBase from '../src/simon-base.js';

/**
 *
 */
export default function() { 
  //var loggingLibrary = new CTATLoggingLibrary (false);

  var base=new SimonBase ("SimonBase","instance");

  try {
    base.simondebug ("Test message");
  } catch (err) {
    console.log (err.message);
    return (false);
  }

  return (true);
}
