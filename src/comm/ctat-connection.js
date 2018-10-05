
import CTATConnectionBase from './ctat-connectionbase.js';

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

/**
 * @param {object} substVars needs property session_id if no real flashVars
 */
export default class CTATConnection extends CTATConnectionBase {

  /**
  *
  */
	constructor () {
		super ("CTATConnection","ctatconnection");

		//this.substituteFlashVars = substVars;

		this.data=null;
		this.httpObject=null;

		this.consumed=false;
		this.pointer = this;
		this.caller = null;

		this.receiveFunction=null;

		this.contentType="text/plain";

		this.setSocketType ("http");
		this.createHTTPObject ();
  }

  /**
  *
  */
  setCaller (aPointer) {
  	this.caller=aPointer;
  }

	/**
	*
	*/
  setContentType (aVal) {
		contentType=aVal;
	}

	/**
	*
	*/
	getContentType () {
		return (contentType);
	}

	/**
	*
	*/
	setConsumed (aVal) {
		consumed=aVal;

		this.ctatdebug ("consumed: " + consumed);
	}

	/**
	*
	*/
	getConsumed () {
		this.ctatdebug ("consumed: " + consumed);

		return (consumed);
	}

	/**
	*
	*/
	assignReceiveFunction(aFunction) {
		this.receiveFunction=aFunction;

		this.httpObject.onreadystatechange=aFunction;
	}

	/**
	*
	*/
	setData (aData) {
		this.data=aData;
	}

	/**
	*
	*/
	getData () {
		return (this.data);
	}

	/**
	*
	*/
	getHTTPObject () {
		return (this.httpObject);
	}

	/**
	*
	*/
  createHTTPObject () {
		this.ctatdebug ("createHTTPObject ()");

		this.httpObject=new XMLHttpRequest();
    this.httpObject.caller=this.caller;

    /*
		if (window.XMLHttpRequest) {
			this.ctatdebug ("Creating regular XMLHttpRequest ...");

			this.httpObject=new XMLHttpRequest();

			if (httpObject.overrideMimeType) {
				httpObject.overrideMimeType('text/html');
			}
		} else {
			this.ctatdebug ("Trying alternative HTTP object creation ...");

			if (window.ActiveXObject) {
				this.ctatdebug ("Detected window.ActiveXObject ...");

				// IE
				try {
					this.ctatdebug ("Creating Msxml2.XMLHTTP ...");

					httpObject=new ActiveXObject ("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						this.ctatdebug ("Creating Microsoft.XMLHTTP ...");

						httpObject=new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {
						alert ('Error: Unable to create HTTP Request Object: ' + e.message);
					}
				}
			} else {
				alert ("Internal error: an HTTP connection object could not be created");
			}
		}
		*/
	}

	/**
	* Do not call this method before open is called on the http object. If you do you will
	* get a Javascript exception that says: "an attempt was made to use an object that is
	* not or is no longer usable"
	*/
	init () {
		this.ctatdebug ("init ()");

		if (this.httpObject!==null) {
			//var fVars=(flashVars ? flashVars.getRawFlashVars () : substituteFlashVars);

			//var aSession=(fVars['session_id'] ? fVars['session_id'] : "dummySession");

			var aSession="dummySession";

			if (aSession=='dummySession') {
				this.ctatdebug ("Unable to find CTAT session information from environment, trying OLI ...");
			}

			try {
				/*
				if (useOLIEncoding==false)  // default for CORS compatibility, but OLI needs urlencoded, only
				{
					httpObject.setRequestHeader ("Content-type","text/plain");
				}
				else
				{
					httpObject.setRequestHeader ("Content-type","application/x-www-form-urlencoded");
				}
				*/

				this.httpObject.setRequestHeader ("Content-type",this.contentType);

				//httpObject.setRequestHeader ("Access-Control-Allow-Origin","*");
				//httpObject.setRequestHeader ("Access-Control-Allow-Headers","X-Custom-Header");
				this.httpObject.setRequestHeader ("ctatsession",aSession);
			} catch (err) {
				console.log ("HTTP object creation error: " + err.message);
			}
		} else {
			console.log ("Internal error: http object is null right after creation");
		}

		this.ctatdebug ("init () done");
	}

	/**
	*
	*/
	send () {
		this.ctatdebug ("send ()");

		this.getHTTPObject ().onerror = function() {
			this.ctatdebug ("Networking error!");
		}

    this.getHTTPObject ().open ('POST', this.getURL (), true);

    /*
		try {
			this.getHTTPObject ().open ('POST', this.getURL (), true);
		} catch(err) {
			this.ctatdebug ("Error in newConnection.httpObject.open: " + err.message);
			return;
		}
		*/

		this.init ();

		try {
			if (this.data) {
				this.getHTTPObject ().send (this.data);
			} else {
				this.getHTTPObject ().send ();
			}
		} catch(err) {
			this.ctatdebug ("Error in newConnection.httpObject.send: " + err.message);
			return;
		}
	}
}
