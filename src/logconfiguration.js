
import SimonBase from './simon-base.js';

/**
 *
 */
export default class LogConfiguration extends SimonBase {

  /**
   *
   */
  constructor (params) {
    super ("LogConfiguration","logconfiguration");

    this.bundleFormatter="";
    this.inBundle=false;
    this.useBundling=false;
    this.useOLIEncoding=false;    

    for(let k in params||{}) {
      this[k]=params[k];
    }
  }
}
