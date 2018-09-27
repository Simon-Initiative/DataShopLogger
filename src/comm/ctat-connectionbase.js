
import SimonBase from '../simon-base.js';

/**
 *
 */
export default class CTATConnectionBase extends SimonBase {

  /**
   *
   */
	constructor () {
	  super ("CTATConnectionBase","ctatconnection");

		this.id=-1;
		this.url="";
		this.socketType="http";
  }

	/**
	*
	*/
	setURL (aURL) {
		url=aURL;
	}

	/**
	*
	*/
	getURL () {
		return (url);
	}

	/**
	*
	*/
	setID (anID) {
		id=anID;
	}

	/**
	*
	*/
	getID () {
		return (id);
	}

	/**
	*
	*/
	setSocketType (aType) {
		socketType=aType;
	}

	/**
	*
	*/
	getSocketType () {
		return (socketType);
	}
}
