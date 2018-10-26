
import SimonBase from '../simon-base.js';

/**
 * 
 */
export default class OLILogLibraryBase extends SimonBase {

  /**
   *
   */
	constructor (aClass,aName) {
	  super (aClass,aName);

		this.pointer=this;
		this.customFieldNames=[];
		this.customFieldValues=[];
  }
}
