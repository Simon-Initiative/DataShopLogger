
//import $ from 'jquery';
import SimonBase from './simon-base.js';
import axios from 'axios' // https://www.npmjs.com/package/axios

var bundleFormatter="";
var inBundle=false;
var useBundling=false;
var useOLIEncoding=false;

/**
 * Maintain a list of outstanding and completed XHR requests, to be careful that they don't clobber each other.
 * @param {} aHandler an object having a function property processMessage() that accepts the response body
 * @param {boolean} aUseScrim whether to show the scrim on some errors; default is true
 */
export default class CTATCommLibrary extends SimonBase {

  /**
   *
   */
  constructor (aHandler, aUseScrim) {
  	super ("CTATCommLibrary","commlibrary");

		this.authenticityToken = "";

		this.xmlHeader='<?xml version="1.0" encoding="UTF-8"?>';
		this.fixedURL="";
		this.httpreqindex=0;
		this.httprequests=[];
		this.httphandler=(aHandler ? aHandler : null);
		this.useScrim=(aUseScrim == null ? true : aUseScrim);
		this.useCommSettings=true;
		this.messageListener=null;
		this.pointer = this;
		this.socketType="http";
		this.connectionRefusedMessage="ERROR_CONN_TS";
		this.fileTobeLoaded="";
	}

	/**
	*
	*/
	setUseCommSettings (aValue) {
		this.useCommSettings=aValue;
	}

	/**
	*
	*/
	getUseCommSettings () {
		return (this.useCommSettings);
	}

	/**
	*
	*/
	setConnectionRefusedMessage (aValue) {
		this.connectionRefusedMessage=aValue;
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
		return (this.socketType);
	}

	/**
	 * See http://beradrian.wordpress.com/2007/07/19/passing-post-parameters-with-ajax/
	 * This setter's argument has the same semantics as the constructor's argument.
	 * @param {} aHandler an object having a function property processMessage() that accepts the response body
	 */
	assignHandler (aHandler) {
		this.httphandler=aHandler;
	}

	/**
	*
	*/
	assignMessageListener (aListener) {
		this.messageListener=aListener;
	}

	/**
	 *
	 */
	encodeVariables(variables) {
		this.ctatdebug ("encodeVariables ()");

	    var parameterString="";

	    for (var i=0;i<variables.length;i++) {
	    	var variable=variables [i];

	    	if (i>0) {
	    		parameterString+="&";
	    	}

	    	parameterString+=variable.name;
	    	parameterString+="=";
	    	parameterString+=encodeURIComponent (variable.value);  // FIXME was encodeURI
	    }

	    return (parameterString);
	}

	/**
	 *
	 */
	encodeVariablesOLI(variables) {
		this.ctatdebug ("encodeVariablesOLI ()");

	    var parameterString="";

	    for (var i=0;i<variables.length;i++) {
	    	var variable=variables [i];

	    	if (i>0) {
	    		parameterString+="&";
	    	}

	    	parameterString+=variable.name;
	    	parameterString+="=";
	    	parameterString+=encodeURIComponent(variable.value);
	    }

	    return (parameterString);
	}

	/**
	*
	*/
	createConnection (aURL) {
		this.ctatdebug ('createConnection ()');

		if (!aURL) {
			return (new CTATConnection ());
		}

		//var vars=flashVars.getRawFlashVars ();
		var	newConnection=null;

		newConnection=new CTATConnection ();
		newConnection.setID (this.httpreqindex);
		newConnection.setURL (aURL);
		newConnection.assignReceiveFunction (this.processReply);

		this.httprequests.push(newConnection);
		this.httpreqindex++;

		return (newConnection);
	}
		
	/**
	*
	*/
	startBundle () {
		this.ctatdebug ('startBundle ()');

		if (this.useBundling===false) {
			this.ctatdebug ("Not using bundling, bump");
			return;
		}

		this.bundleFormatter=xmlHeader+"<message><verb/><properties><MessageType>MessageBundle</MessageType><messages>";

		this.inBundle=true;
	}

	/**
	 *
	 */
	endBundle () {
		this.ctatdebug ('endBundle ()');

		if (this.useBundling===false) {
			this.ctatdebug ("Not using bundling, bump");
			return;
		}

		this.inBundle=false;

		this.bundleFormatter+="</messages></properties></message>";

		this.sendXML (bundleFormatter);
	}

	/**
	*
	*/
	setFixedURL (aURL) {
		this.fixedURL=aURL;
	}

	/**
	 *
	 */
	getFixedURL () {
		return (this.getURL ());
	}	

	/**
	 *
	 */
	getURL () {
		this.ctatdebug ("getURL ()");

		if (this.fixedURL!=="") {
			this.ctatdebug ("Returning fixedURL: " + this.fixedURL);
			return (this.fixedURL);
		}

		var vars=flashVars.getRawFlashVars ();

		var prefix="http://";

		//if (vars ['tutoring_service_communication']=='https')
		if (this.getSocketType ()=="https") {
			prefix="https://";
		}

		var url=prefix + vars ["remoteSocketURL"] + ":" + vars ["remoteSocketPort"];

		if (vars ["remoteSocketURL"].indexOf ("http")!=-1) {
			url=vars ["remoteSocketURL"] + ":" + vars ["remoteSocketPort"];
		}

		return (url);
	}

	/**
	 *
	 */
	sendJSON (aMessage) {
		this.ctatdebug ('sendJSON ('+aMessage+')');

		if (this.useBundling===true) {
			if (this.inBundle===true) {
				this.ctatdebug ('Bundling ...');

				this.bundleFormatter+=aMessage;
				return;
			} else {
				this.bundleFormatter=aMessage;
			}
		} else {
			this.bundleFormatter=aMessage;
		}

		//var vars=flashVars.getRawFlashVars ();

		//var url=this.getURL ();

		var formatted=this.bundleFormatter;

		axios.post(this.getFixedURL (),
      formatted, {
        headers: {'Content-Type': 'application/json'}
      }).then(res=>{
        console.log("status: " + res.status);
        console.log("status: " + res.statusText);
      }).catch(err=>{console.log("error: " + err)});
	}	

	/**
	 *
	 */
	sendXML (aMessage) {
		this.ctatdebug ('sendXML ('+aMessage+')');

		if (this.useBundling===true) {
			if (this.inBundle===true) {
				this.ctatdebug ('Bundling ...');

				this.bundleFormatter+=aMessage;
				return;
			} else {
				this.bundleFormatter=aMessage;
			}
		} else {
			this.bundleFormatter=aMessage;
		}

		//var vars=flashVars.getRawFlashVars ();

		var url=this.getURL ();

		var formatted=this.bundleFormatter;

		if (this.bundleFormatter.indexOf ("<?xml")==-1) {
			formatted=("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+bundleFormatter);
		}

    /*
		if (this.getUseCommSettings() && pointer.getSocketType ()=="javascript") {
			this.send_post (url,formatted);
		} else {
			this.ctatdebug("bump");
		}
		*/

		axios.post(this.setFixedURL,
      xmlString, {
        headers: {'Content-Type': 'text/xml'}
      }).then(res=>{
        console.log("status: " + res.status);
        console.log("status: " + res.statusText);
      }).catch(err=>{console.log("error: " + err)});
	}

	/**
	*
	*/
	sendXMLNoBundle (aMessage) {
		this.ctatdebug ('sendXMLNoBundle ('+aMessage+')');

		this.bundleFormatter=aMessage;

		var url=this.getURL ();

		var formatted=aMessage;

		if (aMessage.indexOf ("<?xml")==-1) {
			formatted=("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+aMessage);
		}

		//var vars=flashVars.getRawFlashVars ();

		this.ctatdebug (this.getUseCommSettings());
		this.ctatdebug (this.getSocketType());

		//if (this.getUseCommSettings() && this.getSocketType ()=="javascript") {
		if (this.getUseCommSettings() && this.getSocketType ()=="http") {
			this.send_post (url,formatted);
		} else {
			this.ctatdebug("bump");
		}
	}

	/**
	 *
	 */
	sendXMLURL (aMessage,aURL) {
		this.ctatdebug ('sendXMLURL ('+aURL+')');

		var formatted=aMessage;

		if (aMessage.indexOf ("<?xml")==-1) {
			formatted=("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+aMessage);
		}

		//var vars=flashVars.getRawFlashVars ();

		this.ctatdebug ("Sending: " + formatted);

		//if (this.getUseCommSettings() && this.getSocketType ()=="javascript") {
		if (this.getUseCommSettings() && this.getSocketType ()=="http") {
			this.send_post (aURL,formatted);
		} else {
			this.ctatdebug("bump");
		}
	}

	/**
	 *
	 */
	sendURLVariables (aURL,variables) {
		this.ctatdebug ('sendURLVariables ('+aURL+')');

		this.send_post_variables (aURL,variables);
	}

	/**
	* We have to be very careful here. Websockets do not support regular gets but we
	* do need to provide this for such functions as navigating to the next tutor or
	* to call any other GET based controller. So for now this method ignores the
	* connection type and will instantiate our default HTTP connection object
	*/
	send (url) {
		this.ctatdebug ('send ('+url+')');

		this.setFixedURL=url;

    axios.get(url).then(function (res) {
        console.log("status: " + res.status);
        console.log("statusText: " + res.statusText);
        console.log("data: " + res.data);
      }).catch(function (error) {
        console.log(error);
      });		
	
		return true;
	}

	/**
	*
	*/
	send_post_variables (url,variables) {
		this.ctatdebug ('send_post_variables ('+url+')');

		this.setFixedURL=url;

		var data="";

		if (this.useOLIEncoding===false) {
			data=this.encodeVariables(variables);
		} else {
			data=this.encodeVariablesOLI(variables);
		}

		this.ctatdebug ("Sending: " + data);

		if (this.messageListener!==null) {
			this.messageListener.processOutgoing (data);
		}

		axios.post(url,
      data, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(res=>{
        console.log("status: " + res.status);
        console.log("statusText: " + res.statusText);
        console.log("data: " + res.data);
      }).catch(err=>{console.log("error: " + err)});			
	}

	/**
	*
	*/
	send_post (url,data) {
		this.ctatdebug ('send_post ('+url+')');

    /*
		if (CTATGlobals.CommDisabled===true) {
			this.ctatdebug ("Communications globally disabled, please check your settings");
			return;
		}
		*/

		this.setFixedURL=url;

		console.log ("Outoing on wire: \n" + data +  "\n");

    axios.post(url,
      data, {
        headers: {'Content-Type': 'text/xml'}
      }).then(res=>{
        console.log("status: " + res.status);
        console.log("statusText: " + res.statusText);
        console.log("data: " + res.data);
      }).catch(err=>{console.log("error: " + err)});
	}

  /**
  * https://www.w3schools.com/js/js_ajax_http.asp
  */
  debugHTTPObject (anObject) {
		console.log ("status: " + anObject.status);
		console.log ("readyState: " + anObject.readyState);
		console.log ("responseText: " + anObject.responseText);
		console.log ("responseXML: " + anObject.responseXML);
		console.log ("statusText: " + anObject.statusText);
  }
 
  /**
   *
   */
  setAuthenticityToken () {
	  if(Array.isArray(token)) {
		  token = (token.length > 0 ? token[0] : "");
	  }

	  if(token) {
		  pointer.authenticityToken = decodeURIComponent(token);
	  }
  }

  /**
   * 
   */
  getAuthenticityToken () {
	  return authenticityToken;
  }

	/**
	 * @param {string} data append to this string
	 * @return {string} edited string
	 */
	addAuthenticityToken (data) {
		if (pointer.authenticityToken && (data === "" || (data.search(/authenticity_token=/) < 0 && data.search(/^[?]?[^?&=><]+=?[^&=]*(&[^?&=><]+=?[^&=]*)*$/) >= 0))) {
			return "" + data + (data ? "&" : "") + "authenticity_token=" + encodeURIComponent(CTATCommLibrary.authenticityToken);
		}
		return data;
	}

	/**
	 * Adjust the protocol (to "wss:") and port (to the remoteSocketSecurePort) in a websocket URL for secure connections.
	 * @param {string} url URL to edit
	 * @return edited URL
	 */
	editSocketURLForHTTPS (url) {
		if(url && window.top.location.protocol === 'https:') {
			pointer.ctatdebug("We're embedded in an https window, using wss...");  //replace protocol
			url = url.replace('ws:', 'wss:');		
			let securePort = CTATConfiguration.get('remoteSocketSecurePort');  //replace port
			
			if(securePort) {
			  let regex = /(wss:\/\/[^:]{1,}:)\d{1,}/;
			  url = url.replace(regex, "$1"+securePort);
			}
			pointer.ctatdebug('url after replace: '+url);
		}
		return url;
	}
}
