import SimonBase from '../simon-base.js';
import OLIMessageBuilderBase from './oli-messagebuilderbase.js';

/**
	{
	  	"actor": 
	  	{
	    	"name": "student1"
	  	},
	  	"verb": 
	  	{
	    	"id": "http://spec.oli.cmu.edu/xapi/logging/verb",
	    	"display": { "en-US": "attempt" }
	  	},
	  	"object": 
	  	{
	    	"id": "http://spec.oli.cmu.edu/xapi/logging/sai",
	    	"definition": 
	    	{
	      		"selection": { "string": "input1" },
	      		"action": { "string": "SetTextArea" },
	      		"input": { "string": "5" }
	    	}
	  	}
	}
*/

/**
 * 
 */
export default class OLIXAPIMessageBuilder extends OLIMessageBuilderBase {

  /**
  *
  */
	constructor (aVars) {
		super ("OLIXAPIMessageBuilder","logmessagebuilder",aVars);
	
	  this.message={};
	
	  this.pointer=this; // superfluous

	  this.setMessageFormat ("JSON");
  }
		
	/**
	 * 
	 */
	buildSAI (aSelection,anAction,anInput) {
		var SAI={};
		SAI.selection=aSelection;
		SAI.action=anAction;
		SAI.input=anInput;
		
		return (SAI);
	}

	/**
	 * 
	 */
	buildSAIfromObject (anSAI) {
		var SAI={};
		SAI.selection=anSAI.getSelection ();
		SAI.action=anSAI.getAction ();
		SAI.input=anSAI.getInput ();
		
		return (SAI);
	}	

	/**
	 * 
	 */
	build () {		
		return (JSON.stringify (this.message));
	}

	/**
	*
	*/
	makeSessionElement () {
		this.message={};
		
		return (message);
	}

	/**
	*	Builds a context message to the Data Shop specifications.
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/context_message.html
	*/
	createContextMessage (aWrapForOLI) {
		this.ctatdebug("createContextMessage()");

    this.message={};

		return (this.build ());
	}

	/**
	*	Builds a tool message to the Data Shop specifications, for tool messages with semantic_event fields.
	* 	<p>The basic difference between the tool messages is that a Semantic Event message contains data that is
	* 	useful in a tutoring context where a UI_Event does not.</p>
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/tool_message.html DataShop specification for tool_message
	*/
	createSemanticEventToolMessage (sai,
														  	  semanticTransactionID,
														  		semanticName,
														  		semanticSubType,
														  		wrapForOLI,
																	aTrigger) {
		this.ctatdebug ("createSemanticEventToolMessage("+aTrigger+")");


		this.message={};
		
		return (this.build ());
	}

	/**
	*	Builds a tool message to the Data Shop specifications, for tool messages with ui_event fields.
	* 	<p>The basic difference between the tool messages is that a Semantic Event message contains data that is
	* 	useful in a tutoring context where a UI_Event does not.</p>
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/tool_message.html DataShop specification for tool_message
	*/
	createUIEventToolMessage (sai,
														uiEventName,
														uiEventField,
														wrapForOLI) {
		this.ctatdebug ("createUIEventToolMessage()");
		
		this.message={};
		
		return (this.build ());
	}

	/**
	*	Builds a tutor message to the Data Shop specifications.
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/tutor_message.html DataShop specification for tutor_message
	*/
	createTutorMessage (sai,
											semanticTransactionID,
											semanticName,
											evalObj,
											advice,
											semanticSubType,
											aSkillObject,
											wrapForOLI) {
		this.ctatdebug ("createTutorMessage()");

		this.message={};
		
		return (this.build ());
	}

	/**
	*	Builds a generic message to the Data Shop specifications.
	*	<p>In practice this will only assure that the message compiles with general XML specifications and that
	*	it contains the minimal requirements for a "message" in Data Shop's specifications.</p>
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/message_message.html DataShop specification for message
	*/
	createGenericMessage(logMessage,wrapForOLI) {
		this.ctatdebug ("createGenericMessage()");

		this.message={};
		
		return (this.build ());
	}

	/**
	 *
   */
	makeMetaElement (timeStamp) {
		this.ctatdebug ("makeMetaElement ()");

		this.message={};
		
		return (this.build ());
	}

	/**
	*
	*/
	wrapForOLI(messageString) {
		this.ctatdebug ("wrapForOLI ()");

		this.message={};
		
		return (this.build ());
	}

	/**
	 * Creates a SessionStart message.
	 * <p>session_log messages are part of logging to an OLI framework.</p>
	 * @param	sessionObj	The CTATSessionData object, this is a member of CTATContextData
	 * @return	Returns a session_log message.
	 */
	createLogSessionStart () {
		this.ctatdebug ("createLogSessionStart ()");

		this.message={};
		
		return (this.build ());
	}
}


