/**
*
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
function OLIXAPIMessageBuilder ()
{
	OLILogLibraryBase.call (this,"OLIXAPIMessageBuilder","logmessagebuilder");
	
	var message={};
	
	var pointer=this;
		
	/**
	 * 
	 */
	this.buildSAI=function buildSAI (aSelection,anAction,anInput)
	{
		var SAI={};
		SAI.selection=aSelection;
		SAI.action=anAction;
		SAI.input=anInput;
		
		return (SAI);
	}
	/**
	 * 
	 */
	this.buildSAIfromObject=function buildSAIfromObject (anSAI)
	{
		var SAI={};
		SAI.selection=anSAI.getSelection ();
		SAI.action=anSAI.getAction ();
		SAI.input=anSAI.getInput ();
		
		return (SAI);
	}	
	/**
	 * 
	 */
	this.build=function build ()
	{
		message={};
		
		return (message);
	};

	/**
	*
	*/
	this.makeSessionElement=function makeSessionElement ()
	{
		message={};
		
		return (message);
	};

	/**
	*	Builds a context message to the Data Shop specifications.
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/context_message.html
	*/
	this.createContextMessage=function createContextMessage (aWrapForOLI)
	{
		pointer.ctatdebug("createContextMessage()");

		return messageString;
	};

	/**
	*	Builds a tool message to the Data Shop specifications, for tool messages with semantic_event fields.
	* 	<p>The basic difference between the tool messages is that a Semantic Event message contains data that is
	* 	useful in a tutoring context where a UI_Event does not.</p>
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/tool_message.html DataShop specification for tool_message
	*/
	this.createSemanticEventToolMessage=function createSemanticEventToolMessage(sai,
														  						semanticTransactionID,
														  						semanticName,
														  						semanticSubType,
														  						wrapForOLI,
																				aTrigger)
	{
		pointer.ctatdebug ("createSemanticEventToolMessage("+aTrigger+")");


		message={};
		
		return (message);
	};

	/**
	*	Builds a tool message to the Data Shop specifications, for tool messages with ui_event fields.
	* 	<p>The basic difference between the tool messages is that a Semantic Event message contains data that is
	* 	useful in a tutoring context where a UI_Event does not.</p>
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/tool_message.html DataShop specification for tool_message
	*/
	this.createUIEventToolMessage=function createUIEventToolMessage (sai,
																	 uiEventName,
																	 uiEventField,
																	 wrapForOLI)
	{
		pointer.ctatdebug ("createUIEventToolMessage()");
		
		message={};
		
		return (message);
	};

	/**
	*	Builds a tutor message to the Data Shop specifications.
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/tutor_message.html DataShop specification for tutor_message
	*/
	this.createTutorMessage=function createTutorMessage (sai,
											   			 semanticTransactionID,
											   			 semanticName,
											   			 evalObj,
											   			 advice,
											   			 semanticSubType,
											   			 aSkillObject,
											   			 wrapForOLI)
	{
		pointer.ctatdebug ("createTutorMessage()");

		message={};
		
		return (message);
	};

	/**
	*	Builds a generic message to the Data Shop specifications.
	*	<p>In practice this will only assure that the message compiles with general XML specifications and that
	*	it contains the minimal requirements for a "message" in Data Shop's specifications.</p>
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/message_message.html DataShop specification for message
	*/
	this.createGenericMessage=function createGenericMessage(logMessage,wrapForOLI)
	{
		pointer.ctatdebug ("createGenericMessage()");

		message={};
		
		return (message);
	};

	/**
	 *
	 */
	this.makeMetaElement=function makeMetaElement (timeStamp)
	{
		pointer.ctatdebug ("makeMetaElement ()");

		message={};
		
		return (message);
	};

	/**
	*
	*/
	this.wrapForOLI=function wrapForOLI(messageString)
	{
		pointer.ctatdebug ("wrapForOLI ()");

		message={};
		
		return (message);
	};

	/**
	 * Creates a SessionStart message.
	 * <p>session_log messages are part of logging to an OLI framework.</p>
	 * @param	sessionObj	The CTATSessionData object, this is a member of CTATContextData
	 * @return	Returns a session_log message.
	 */
	this.createLogSessionStart=function createLogSessionStart ()
	{
		pointer.ctatdebug ("createLogSessionStart ()");

		message={};
		
		return (message);	
	};

	/**
	 *
	 * @param customFieldNames
	 * @param customFieldValues
	 * @returns {String}
	 */
	this.createCustomFields=function createCustomFields (aCustomFieldNames,
											   			 aCustomFieldValues)
	{
		pointer.ctatdebug ("createCustomFields ()");

		if ((aCustomFieldNames==null) || (aCustomFieldValues==null))
		{
			pointer.ctatdebug ("No custom fields provided");
			return ({});
		}		
		
		var cElements={};
		
		for (var dex=0; dex < aCustomFieldNames.length; dex++)
		{
			pointer.ctatdebug ("Adding custom field: ["+aCustomFieldNames[dex]+"],["+aCustomFieldValues[dex]+"]");

			var newElement={};
			newElement.name=aCustomFieldNames[dex];
			newElement.value=aCustomFieldValues[dex];
			
			cElements [dex]=newElement;
		}
				
		return (cElements);
	};
}

OLIXAPIMessageBuilder.prototype = Object.create(OLILogLibraryBase.prototype);
OLIXAPIMessageBuilder.prototype.constructor = OLIXAPIMessageBuilder;
