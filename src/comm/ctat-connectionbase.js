
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
		this.url=aURL;
	}

	/**
	*
	*/
	getURL () {
		return (this.url);
	}

	/**
	*
	*/
	setID (anID) {
		this.id=anID;
	}

	/**
	*
	*/
	getID () {
		return (this.id);
	}

	/**
	*
	*/
	setSocketType (aType) {
		this.socketType=aType;
	}

	/**
	*
	*/
	getSocketType () {
		return (socketType);
	}
}
