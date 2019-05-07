
import SimonBase from './simon-base.js';

/**
 *
 */
export default class LogConfiguration extends SimonBase {

  /**
   *
   */
  constructor () {
    super ("LogConfiguration","logconfiguration");

    this.bundleFormatter="";
    this.inBundle=false;
    this.useBundling=false;
    this.useOLIEncoding=false;    
  }
}
