
import CTATConnectionBase from './ctat-connectionbase.js';

/**
 * @param {object} substVars needs property session_id if no real flashVars
 */
export default class CTATWSConnection extends CTATConnectionBase {

  /**
  *
  */
  constructor (substVars) {
		super ("CTATWSConnection","websocket-connection");

		this.substituteFlashVars = substVars;
		this.data="";

		this.consumed=false;
		this.pointer = this;

		this.output;
		this.websocket=null;

		this.outgoingQueue=[];
		this.ready=false;

		this.before=0;
		this.after=0;

		this.receiveFunction=null;
		this.closeFunction=null;

		pointer.setSocketType ("ws");
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
	assignReceiveFunction (aFunction) {
		receiveFunction=aFunction;
	}

	/**
	* @param {function} new value for var closeFunction
	*/
	assignCloseFunction (aFunction) {
		closeFunction=aFunction;
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
	init () {
		ctatdebug ("init ("+pointer.getURL ()+"); websocket "+websocket);

		if(websocket != null) {
			return;
		}
		
		websocket = new WebSocket(pointer.getURL());

		websocket.addEventListener('open', function(e) {
			ctatdebug('STATUS: open');

			ready=true;

			ctatdebug('Connection open, flushing outgoing queue ...');

			var timeDriver = new Date();
			before = timeDriver.getTime();

			if (outgoingQueue.length>0) {
				for (var i=0;i<outgoingQueue.length;i++) {
					websocket.send (outgoingQueue [i]);
				}

				outgoingQueue=[];
			}
		});

		websocket.addEventListener('message', function(e) {
			var timeDriver = new Date();
			after = timeDriver.getTime();

			ctatdebug('STATUS: message after '+(after-before)+' ms');
			ctatdebug('Received: ' + e.data);

			if (receiveFunction) {
				receiveFunction (e.data);
			} else {
				ctatdebug('Error: no processing function provided');
			}
		});

		/*
		 * Event handler for close events: call websocket.close() with code 1000, which appears
		 * to be the only standard (in range 1000-2000) code accepted by Chrome's WebSocket.
		 */
		websocket.addEventListener('close', function(e) {
			ctatdebug('STATUS: close; '+(e ? 'code '+e.code+', reason '+e.reason : 'no event'));

			ready=false;

			var reason = (e ? (e.reason ? e.reason : 'received close code '+e.code) : 'no close event received');

			websocket.close(1000, reason);  // 1000: see header comment

			if (closeFunction) {
				closeFunction (e);
			}
		});

		/*
		 * Event handler for error events: call websocket.close() with code 1000, which appears
		 * to be the only standard (in range 1000-2000) code accepted by Chrome's WebSocket.
		 */
		websocket.addEventListener('error', function(e) {
			ctatdebug('STATUS: error; '+(e ? e.type : 'no event'));

			ready=false;

			websocket.close(1000, 'client closing in response to error');  // 1000: see header comment
		});

		ctatdebug ("init () done");
	}

	/**
	*
	*/
	send () {
		ctatdebug('send ()');

		pointer.init ();

		if (ready===false) {
			ctatdebug('Connection not ready yet, storing ...');
			outgoingQueue.push (data);
		} else {
			ctatdebug('Connection ready, sending data ...');

			var timeDriver = new Date();
			before = timeDriver.getTime();
			websocket.send (data);
		}
	}
	
	/**
	 *
	 */
	getWebSocket () {
		return websocket;
	}
	
	/**
	 *
	 */
	close (opt_reason, opt_cbk) {
		ready=false;
		opt_reason = opt_reason || 'no reason';
		closeFunction = opt_cbk || closeFunction;
		websocket.close(1000, opt_reason);
	}
}
