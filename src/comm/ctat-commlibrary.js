
import $ from 'jquery';
import SimonBase from '../simon-base.js';
import CTATWSConnection from '../comm/ctat-wsconnection.js';
import CTATConnection from '../comm/ctat-connection.js';

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

		var vars=flashVars.getRawFlashVars ();

		var url=this.getURL ();

		var formatted=this.bundleFormatter;

		if (this.bundleFormatter.indexOf ("<?xml")==-1) {
			formatted=("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+bundleFormatter);
		}

		if (this.getUseCommSettings() && pointer.getSocketType ()=="javascript") {
			this.send_post (url,formatted);
		} else {
			this.ctatdebug("bump");
		}
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

    /*
		if (CTATGlobals.CommDisabled===true) {
			pointer.ctatdebug ("Communications globally disabled, please check your settings");
			return false;
		}
		*/

		var newConnection=new CTATConnection (null);
		newConnection.setID (httpreqindex);
		this.httpreqindex++;

		if (newConnection.getHTTPObject ()===null) {
			alert ('Cannot create XMLHTTP instance');
			return false;
		}

		this.httprequests.push(newConnection);

		newConnection.setURL (url);

		newConnection.assignReceiveFunction (this.processReply);

		try {
			newConnection.getHTTPObject ().open ('GET', url, true);
		} catch(err) {
			this.ctatdebug ("Error in newConnection.httpObject.open: " + err.message);
			return false;
		}

		try {
			newConnection.init ();
		} catch(err) {
			this.ctatdebug ("Error in newConnection.init: " + err.message);
			return false;
		}

		try {
			newConnection.getHTTPObject ().send (null);
		} catch(err) {
			this.ctatdebug ("Error in newConnection.httpObject.send: " + err.message);
			return false;
		}

		return true;
	}

	/**
	*
	*/
	send_post_variables (url,variables) {
		this.ctatdebug ('send_post_variables ('+url+')');

		var vars=flashVars.getRawFlashVars ();
		var res=url;

		//if (vars ['tutoring_service_communication']=='websocket')
		if (this.getSocketType ()=="websocket") {
			//res=url.replace ("http:","ws:");
		}

		var data="";

		if (this.useOLIEncoding===false) {
			data=this.encodeVariables(variables);
		} else {
			data=this.encodeVariablesOLI(variables);
		}

		this.ctatdebug ("Sending: " + data);

    /*
		if (CTATGlobals.CommDisabled===true) {
			pointer.ctatdebug ("Communications globally disabled, please check your settings");
			return;
		}
		*/

		var newConnection=this.createConnection (url);
		newConnection.setContentType ("application/x-www-form-urlencoded");

		this.httpreqindex++;

		/*
		if (newConnection.getHTTPObject ()===null)
		{
			alert ('Cannot create XMLHTTP instance');
			return false;
		}
		*/

		this.httprequests.push(newConnection);

		this.ctatdebug (data);

		if (this.messageListener!==null) {
			this.messageListener.processOutgoing (data);
		}

		newConnection.setURL (res);
		newConnection.setData (data);  // or CTATCommLibrary.addAuthenticityToken(data)
		newConnection.assignReceiveFunction (this.processReply);
		newConnection.send ();
	}

	/**
	*
	*/
	send_post (url,data) {
		//useDebugging=true;

		var newConnection=null;

		this.ctatdebug ('send_post ('+url+')');

    /*
		if (CTATGlobals.CommDisabled===true) {
			this.ctatdebug ("Communications globally disabled, please check your settings");
			return;
		}
		*/

		this.ctatdebug ("Outoing on wire: " + data);

		//var vars=flashVars.getRawFlashVars ();
		var res=url;

		//if (vars ['tutoring_service_communication']=='websocket')
		if (this.getSocketType ()=="websocket") {
			ctatdebug('opening websocket connection: url '+url);

			res=url.replace ("http:", "ws:");
		  res=pointer.editSocketURLForHTTPS(res);
			
			this.ctatdebug('opening websocket connection to '+res);

			newConnectionthis.createConnection (res);

			newConnection.setData (data);

			this.ctatdebug (data);

			if (messageListener!==null) {
				messageListener.processOutgoing (data);
			}
		} else {
			// This should always result in a new connection object
			newConnection=this.createConnection (res);
			newConnection.setData (data);  // or CTATCommLibrary.addAuthenticityToken(data)

			if (this.messageListener!==null) {
				this.messageListener.processOutgoing (data);
			}
		}

    newConnection.setCaller(this);
		newConnection.send ();
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
	* https://www.w3schools.com/js/js_ajax_http.asp
	*/
	processReply (argument) {
    console.log ("processReply ()");

    //this.debugHTTPObject (anObject);

    if (this.readyState!=4) {
    	console.log ("Response not ready yet");
		  return;
		}

		console.log ("status: " + this.status);
		console.log ("readyState: " + this.readyState);
		/*
		console.log ("responseText: " + this.responseText);
		console.log ("responseXML: " + this.responseXML);
		console.log ("statusText: " + this.statusText);		
    */

		var i=0;
		var found=false;
		var stringDelivery=[];

		var request=0;

		console.log ("Testing " + this.caller.httprequests.length + " request objects");

		for (request=0;request<this.caller.httprequests.length;request++) {
			var testConnection=this.caller.httprequests [request];
			var testObject=testConnection.getHTTPObject ();

			this.ctatdebug ("Testing connection entry " + request + ", readyState: " + testObject.readyState + ", consumed: "+ testConnection.getConsumed () + ", status: " + testObject.status);

			//>---------------------------------------------------------------------------------

			if ((testObject.readyState==4) && (testConnection.getConsumed ()===false)) {
				this.ctatdebug ("Investigating request response: " + i + " -> " + testObject.status + ", for: " + testConnection.getURL ());

				found=false;

				if (testObject.status===0) {
					found=true;

					this.ctatdebug ("Received message (status 0): (" + testObject.responseText + "), status: " + testObject.status);

					if(useScrim) {
						CTATScrim.scrim.errorScrimUp(CTATGlobals.languageManager.filterString (connectionRefusedMessage));
					}
				}

				// 408 timeout response
				if(testObject.status==408) {
					found=true;

					this.ctatdebug ("Received message (status 408): " + testObject.responseText);

          /* 
					if(useScrim) {
						CTATScrim.scrim.scrimDown();
					}
					*/
				}

				if (testObject.status==502) {
					found=true;

					this.ctatdebug ("Received message (status 502): " + testObject.responseText);

          /* 
					if(useScrim) {
						CTATScrim.scrim.errorScrimUp(CTATGlobals.languageManager.filterString (ERROR_502));
					}
					*/
				}

				if (testObject.status==200) {
					found=true;

					this.ctatdebug ("Processing 200 response ...");

					if (httphandler!==null) {
						//pointer.ctatdebug ("Received message (status 200): " + testObject.responseText);

						stringDelivery.push (testObject.responseText);

						if (this.messageListener!==null) {
							this.messageListener.processIncoming (testObject.responseText);
						}
					} else {
						this.ctatdebug ("Error: httphandler is null, can't process response!");
					}
				} else if(httphandler && httphandler.processError) {
					found=true;
					this.ctatdebug ("Processing non-200 response, status "+testObject.status);
					httphandler.processError(testObject.status, testObject.responseText);
				}

				if (found===false) {
					pointer.ctatdebug ("Error: status not handled for: " + testObject.status);
				}

				pointer.ctatdebug ("Marking connection as consumed ...");

				testConnection.setConsumed (true); // make sure we don't call it again!
			} else {
				if (testObject.readyState===0) {
					pointer.ctatdebug ("Received message (status 0, request not initialized)");
				}

				if (testObject.readyState===1) {
					pointer.ctatdebug ("Received message (status 1, server connection established)");
				}

				if (testObject.readyState===2) {
					pointer.ctatdebug ("Received message (status 2, request received)");
				}

				if (testObject.readyState===3) {
					pointer.ctatdebug ("Received message (status 3, processing request)");
				}
			}

			i++;
		}

		pointer.cleanup();

		for (var t=0;t<stringDelivery.length;t++) {
			pointer.ctatdebug ("Processing incoming message: " +  t);

			var aMessage=stringDelivery [t];

			if (aMessage.indexOf ("status=success")!=-1) {
				pointer.ctatdebug ("Info: logging success message received, not propagating to message handler");
			} else {
				pointer.ctatdebug ("Processing incoming message: " + aMessage);

				httphandler.processMessage (aMessage);
			}
		}
	}

	/**
	*
	*/
	cleanup () {
		pointer.ctatdebug ("cleanup ()");

		//var i=0;
		var count=0;
		var found=false;
		var clean=false;

		while (clean===false) {
			found=this.checkEntries ();

			if (found===false) {
				clean=true;
			} else {
				count++;
			}
		}

		pointer.ctatdebug ("Removed " + count + " entries");
	}

	/**
	*
	*/
	checkEntries () {
		pointer.ctatdebug ("checkEntries ("+httprequests.length+")");

		var i=0;
		var requests=0;

		for (requests=0; requests<httprequests.length; requests++) {
			var testConnection=httprequests [requests];

			if (testConnection.getConsumed()===true) {
				pointer.ctatdebug ("Removing : " + testConnection.getID ());

				httprequests.splice(i, 1);
				return (true);
			} else {
				var testObject=testConnection.getHTTPObject ();

				pointer.ctatdebug ("Check, readyState: " + testObject.readyState + ", consumed: " + testConnection.getConsumed ());
			}

			i++;
		}

		return (false);
	}

	/**
   * Get the BRD file; parse it on receipt. Returns as soon as request is posted.
	 * @param {string} XML file URL
	 * @param {CTATXML} an instance of the CTATXML parser
	 * @param {function} handler function for when the data has been retrieved, argument is the data
   */
	retrieveXMLFile(xmlFile, parser, handler) {
		pointer.ctatdebug("retrieveXMLFile ("+xmlFile+")");

		if (location.href) {
			pointer.ctatdebug ("Location: ");

			if (location.href.toLowerCase().indexOf ("file://")!=-1) {
				var errFile = new CTATTutorMessageBuilder().createErrorMessage("", "You have loaded your tutor directly from the file system, please do not load a tutor using file://. Please use the CTAT Authoring Tools to launch the html file.");
				pointer.ctatdebug("onerror GET for xmlFile " + errFile);
				CTAT.ToolTutor.sendToInterface(errFile, true);
				return;
			}
		} else {
			pointer.ctatdebug ("We can't check location.href in the current configuration");
		}

		if (xmlFile.toLowerCase().indexOf ("file://")!=-1) {
			var errXFile = new CTATTutorMessageBuilder().createErrorMessage("", "Unable to load: "+xmlFile+" - You are trying to use the file:// protocol, which is not allowed in this browser.");
			pointer.ctatdebug("onerror GET for xmlFile "+errXFile);
			CTAT.ToolTutor.sendToInterface(errXFile, true);
			return;
		}

		fileTobeLoaded=xmlFile;

		var newConnection=new CTATConnection ();
		var xmlhttp=newConnection.getHTTPObject ();
		//var xmlhttp = ProblemStateRestorer.getXHR();

		xmlhttp.onreadystatechange = function() {
			pointer.ctatdebug("onready... GET for xmlFile xmlhttp.readyState "+xmlhttp.readyState+", .status "+xmlhttp.status+", parser "+parser);

			if (xmlhttp.readyState != 4) {
				//handler.processXML (null);
				return;
			}

			if (xmlhttp.status == 200) {
				var xmlDoc = null;

				if (!xmlhttp.responseXML) {
					pointer.ctatdebug("parsing brd xml using node");
					xmlDoc = (parser = new CTATXML()).parseXML(xmlhttp.responseText);
				} else {
					pointer.ctatdebug("parsing brd xml using something else");
					xmlDoc = xmlhttp.responseXML.documentElement;
				}

				if(xmlDoc === null) {
					var errXNull = new CTATTutorMessageBuilder().createErrorMessage("Error parsing xmlFile "+ fileTobeLoaded);
					pointer.ctatdebug("Error parsing xmlFile "+fileTobeLoaded+": "+errXNull);
					CTAT.ToolTutor.sendToInterface(errXNull, true);
					return;
				}

				handler.processXML (xmlDoc);
			}

			if (xmlhttp.status == 404) {
				var err404 = new CTATTutorMessageBuilder().createErrorMessage( "Unable to download file", "("+ fileTobeLoaded + ") not found");
				pointer.ctatdebug("Error loading xmlFile "+fileTobeLoaded+": "+err404);
				CTAT.ToolTutor.sendToInterface(err404, true);
				return;
			}
		}

		xmlhttp.onerror = function() {
			var errHTTP = new CTATTutorMessageBuilder().createErrorMessage("", "Unable to load: "+fileTobeLoaded+" - Either you are trying to use the  file:// protocol, there is a firewall between the tutor and BRD, or the BRD is on a different domain and permission to retrieve data from that server is denied.");
			pointer.ctatdebug("onerror GET for xmlFile "+errHTTP);
			CTAT.ToolTutor.sendToInterface(errHTTP, true);

			handler.processXML (null);
		}

		xmlhttp.open("GET", xmlFile, true);   // true => async
		xmlhttp.setRequestHeader ("Content-type","text/plain");
		xmlhttp.send();
	}

	/**
   * Get a JSON file. The file is not parsed but returned as a string instead
	 * @param {string} XML file URL
	 * @param {CTATXML} an instance of the CTATXML parser
	 * @param {function} handler function for when the data has been retrieved, argument is the data
   */
	retrieveJSONFile(jsonFile, handler) {
		pointer.ctatdebug("retrieveJSONFile ("+jsonFile+")");

		if (location.href) {
			pointer.ctatdebug ("Location: ");

			if (location.href.toLowerCase().indexOf ("file://")!=-1) {
				var errFile = new CTATTutorMessageBuilder().createErrorMessage("","You have loaded your tutor directly from the file system, please do not load a tutor using file://. Please use the CTAT Authoring Tools to launch the html file.");
				pointer.ctatdebug("onerror GET for xmlFile "+errFile);
				CTAT.ToolTutor.sendToInterface(errFile, true);
				return;
			}
		} else {
			pointer.ctatdebug ("We can't check location.href in the current configuration");
		}

		if (jsonFile.toLowerCase().indexOf ("file://")!=-1) {
			var errJFile = new CTATTutorMessageBuilder().createErrorMessage("", "Unable to load: "+jsonFile+" - You are trying to use the file:// protocol, which is not allowed in this browser.");
			pointer.ctatdebug("onerror GET for xmlFile "+errJFile);
			CTAT.ToolTutor.sendToInterface(errJFile, true);
			return;
		}

		fileTobeLoaded=jsonFile;

		var newConnection=new CTATConnection ();
		var jsonhttp=newConnection.getHTTPObject ();

		jsonhttp.onreadystatechange = function() {
			//pointer.ctatdebug("onready... GET for JSON File jsonhttp.readyState "+jsonhttp.readyState+", .status "+jsonhttp.status);

			if (jsonhttp.readyState != 4) {
				//pointer.ctatdebug ("Error ("+jsonhttp.status+") retrieving file: " + jsonFile);
				return;
			}

			if (jsonhttp.status == 200) {
				pointer.ctatdebug ("Successfully retrieved file: " + jsonFile);
				handler (JSON.parse(jsonhttp.responseText));
				return;
			}
		}

		jsonhttp.onerror = function() {
			var errMsg = new CTATTutorMessageBuilder().createErrorMessage("", "Unable to load: "+fileTobeLoaded+" - Either you are trying to use the  file:// protocol, there is a firewall between the tutor and BRD, or the BRD is on a different domain and permission to retrieve data from that server is denied.");
			pointer.ctatdebug("onerror GET for xmlFile "+errMsg);
			CTAT.ToolTutor.sendToInterface(errMsg, true);
			return;
		}

		jsonhttp.open("GET", jsonFile, true);   // true => async
		jsonhttp.setRequestHeader ("Content-type","text/plain");
		jsonhttp.send();
	}

	/**
     * Get a (text formatted) file. The file is not parsed but returned as a string instead
	 * @param {string} file URL
	 * @param {function} handler function for when the data has been retrieved, argument is the data
     */
	retrieveFile(txtFile, handler) {
		pointer.ctatdebug("retrieveFile ("+txtFile+")");

		if (location.href) {
			pointer.ctatdebug ("Location: ");

			if (location.href.toLowerCase().indexOf ("file://")!=-1) {
				var errFile = new CTATTutorMessageBuilder().createErrorMessage("", "You have loaded your tutor directly from the file system, please do not load a tutor using file://. Please use the CTAT Authoring Tools to launch the html file.");
				pointer.ctatdebug("onerror GET for xmlFile "+errFile);
				CTAT.ToolTutor.sendToInterface(errFile, true);
				return;
			}
		} else {
			pointer.ctatdebug ("We can't check location.href in the current configuration");
		}

		if (txtFile.toLowerCase().indexOf ("file://")!=-1) {
			var errTFile = new CTATTutorMessageBuilder().createErrorMessage("", "Unable to load: "+txtFile+" - You are trying to use the file:// protocol, which is not allowed in this browser.");
			pointer.ctatdebug("onerror GET for xmlFile "+errTFile);
			CTAT.ToolTutor.sendToInterface(errTFile, true);
			return;
		}

		fileTobeLoaded=txtFile;

		var newConnection=new CTATConnection ();
		var txthttp=newConnection.getHTTPObject ();

		txthttp.onreadystatechange = function() {
			//pointer.ctatdebug("onready... GET for JSON File txthttp.readyState "+txthttp.readyState+", .status "+txthttp.status);

			if (txthttp.readyState != 4) {
				//handler.processXML (null);
				//pointer.ctatdebug ("Error ("+txthttp.status+") retrieving file: " + txtFile);
				return;
			}

			if (txthttp.status == 200) {
				pointer.ctatdebug ("Successfully retrieved file: " + txtFile);
				handler (txthttp.responseText);
				return;
			}
		}

		txthttp.onerror = function() {
			var errHTTP = new CTATTutorMessageBuilder().createErrorMessage("", "Unable to load: "+fileTobeLoaded+" - Either you are trying to use the  file:// protocol, there is a firewall between the tutor and BRD, or the BRD is on a different domain and permission to retrieve data from that server is denied.");
			pointer.ctatdebug("onerror GET for xmlFile "+errHTTP);
			CTAT.ToolTutor.sendToInterface(errHTTP, true);
			return;
		}

		txthttp.open("GET", txtFile, true);   // true => async
		txthttp.setRequestHeader ("Content-type","text/plain");
		txthttp.send();
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
