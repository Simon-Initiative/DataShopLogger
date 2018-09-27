
import CTATConnectionBase from './ctat-connectionbase.js';

/**
 * @param {object} substVars needs property session_id if no real flashVars
 */
export default class CTATConnection extends CTATConnectionBase {

  /**
  *
  */
	constructor (substVars) {
		super ("CTATConnection","ctatconnection");

		this.substituteFlashVars = substVars;

		this.data=null;
		this.httpObject=null;

		this.consumed=false;
		this.pointer = this;

		this.receiveFunction=null;

		this.contentType="text/plain";

		pointer.setSocketType ("http");
		pointer.createHTTPObject ();
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

		pointer.ctatdebug ("consumed: " + consumed);
	}

	/**
	*
	*/
	getConsumed () {
		pointer.ctatdebug ("consumed: " + consumed);

		return (consumed);
	}

	/**
	*
	*/
	assignReceiveFunction(aFunction) {
		receiveFunction=aFunction;

		httpObject.onreadystatechange=aFunction;
	}

	/**
	*
	*/
	setData (aData) {
		data=aData;
	}

	/**
	*
	*/
	getData () {
		return (data);
	}

	/**
	*
	*/
	getHTTPObject () {
		return (httpObject);
	}

	/**
	*
	*/
  createHTTPObject () {
		pointer.ctatdebug ("createHTTPObject ()");

		httpObject=new XMLHttpRequest();

		if (window.XMLHttpRequest) {
			pointer.ctatdebug ("Creating regular XMLHttpRequest ...");

			httpObject=new XMLHttpRequest();

			if (httpObject.overrideMimeType) {
				httpObject.overrideMimeType('text/html');
			}
		} else {
			pointer.ctatdebug ("Trying alternative HTTP object creation ...");

			if (window.ActiveXObject) {
				pointer.ctatdebug ("Detected window.ActiveXObject ...");

				// IE
				try {
					pointer.ctatdebug ("Creating Msxml2.XMLHTTP ...");

					httpObject=new ActiveXObject ("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						pointer.ctatdebug ("Creating Microsoft.XMLHTTP ...");

						httpObject=new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {
						alert ('Error: Unable to create HTTP Request Object: ' + e.message);
					}
				}
			} else {
				alert ("Internal error: an HTTP connection object could not be created");
			}
		}
	}

	/**
	* Do not call this method before open is called on the http object. If you do you will
	* get a Javascript exception that says: "an attempt was made to use an object that is
	* not or is no longer usable"
	*/
	init () {
		pointer.ctatdebug ("init ()");

		if (httpObject!==null) {
			var fVars=(flashVars ? flashVars.getRawFlashVars () : substituteFlashVars);

			var aSession=(fVars['session_id'] ? fVars['session_id'] : "dummySession");

			if (aSession=='dummySession') {
				pointer.ctatdebug ("Unable to find CTAT session information from environment, trying OLI ...");
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

				httpObject.setRequestHeader ("Content-type",contentType);

				//httpObject.setRequestHeader ("Access-Control-Allow-Origin","*");
				//httpObject.setRequestHeader ("Access-Control-Allow-Headers","X-Custom-Header");
				httpObject.setRequestHeader ("ctatsession",aSession);
			} catch (err) {
				alert ("HTTP object creation error: " + err.message);
			}
		} else {
			alert ("Internal error: http object is null right after creation");
		}

		pointer.ctatdebug ("init () done");
	}

	/**
	*
	*/
	send () {
		pointer.ctatdebug ("send ()");

		pointer.getHTTPObject ().onerror = function() {
			pointer.ctatdebug ("Networking error!");
		}

		try {
			pointer.getHTTPObject ().open ('POST', pointer.getURL (), true);
		} catch(err) {
			pointer.ctatdebug ("Error in newConnection.httpObject.open: " + err.message);
			return;
		}

		pointer.init ();

		try {
			if (data) {
				pointer.getHTTPObject ().send (data);
			} else {
				pointer.getHTTPObject ().send ();
			}
		} catch(err) {
			this.ctatdebug ("Error in newConnection.httpObject.send: " + err.message);
			return;
		}
	}
}
