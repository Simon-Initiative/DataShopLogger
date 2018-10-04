/*
 Notes:

 For OLI, make sure you use the correct session id, otherwise the server will respond with:

	status=failure
	cause=NOT_AUTHENTICATED
	message=com.beginmind.login.service.InvalidSessionException: invalid session token
*/

//import $ from 'jquery';
import * as tools from '../simon-lms-tools.js';
import SimonBase from '../simon-base.js';
import CTATLogMessageBuilder from './ctat-logmessagebuilder.js'
import OLILogLibraryBase from './oli-loglibrarybase.js'
import CTATCommLibrary from '../comm/ctat-commlibrary.js'

var loggingDisabled=false; // Be very careful with this flag, it will do a hard disable on logging!

/**
 * 
 */
export default class CTATLoggingLibrary extends OLILogLibraryBase {

	/**
	*
	*/
	constructor (anInternalUsage) {
		super ("CTATLoggingLibrary","commLoggingLibrary");

		this.pointer=this;

		// The current version of this LoggingLibrary.
		this.version="3.Beta";

		// The version of the DataShop DTD specification that this LoggingLibrary conforms with.
		this.DTDVersion="4";

		// I just copy pasted this off of DataShop's website, its probably right but it may not even be necessary to include.
		this.nameSpace="xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:noNamespaceSchemaLocation='http://learnlab.web.cmu.edu/dtd/tutor_message_v4.xsd'";

		// The standard XMLProlog, we actually reference this a lot.
		this.xmlProlog='<?xml version="1.0" encoding="UTF-8"?>';

		this.useSessionLog=true;
		this.useInternal=false;
		this.useInternalConfigured=false;
		this.useForcedSessionID="";
		this.useVars=[];

		this.logclassname="undefined";
		this.school="undefined";
		this.period="undefined";
		this.description="undefined";
		this.instructor="undefined";
		this.problem_name="undefined";
		this.problem_context="undefined";
		this.userid="undefined";
		this.datasetName="UnassignedDataset";
		this.datasetLevelName="UnassignedLevelName";
		this.datasetLevelType="UnassignedLevelType";

		this.logListener=null;
		
		this.lastSAI=null;
		
		//var gen=new CTATGuid ();
		//this.userid=SimonGuid.guid ();
		this.userid=tools.uuidv4();

		if ((anInternalUsage!=undefined) && (anInternalUsage!=null)) {
			this.useInternal=anInternalUsage;

			if (this.useInternal==false) {
				CTATLogMessageBuilder.commLogMessageBuilder=new CTATLogMessageBuilder ();
			}
		} else {
			CTATLogMessageBuilder.commLogMessageBuilder=new CTATLogMessageBuilder ();
		}

		this.loggingCommLibrary=new CTATCommLibrary ();
		this.loggingCommLibrary.setName ("commLoggingLibrary");
		this.loggingCommLibrary.setUseCommSettings (false);
		this.loggingCommLibrary.setConnectionRefusedMessage ("ERROR_CONN_LS");
		this.loggingCommLibrary.assignHandler (this);
	}

	/**
	*
	*/
	getLastSAI () {
		return (lastSAI);
	};
	
	/**
	*
	*/
	assignLogListener (aListener) {
		logListener=aListener;
	};

	/**
	*
	*/
	generateSession () {
		useVars ['session_id']=("ctat_session_"+SimonGuid.guid ());

		return (useVars ['session_id']);
	};
	/**
	*
	*/
	setLogClassName (aValue) {
		logclassname=aValue;
	};

	/**
	*
	*/
	setDatasetName (aValue) {
		datasetName=aValue;
	};

	/**
	*
	*/
	setdDtasetLevelName (aValue) {
		datasetLevelName=aValue;
	};

	/**
	*
	*/
	setDatasetLevelType (aValue) {
		datasetLevelType=aValue;
	};

	/**
	*
	*/
	setSchool (aValue) {
		school=aValue;
	};

	/**
	*
	*/
	setPeriod (aValue) {
		period=aValue;
	};

	/**
	*
	*/
	setDescription (aValue) {
		description=aValue;
	};

	/**
	*
	*/
	setInstructor (aValue) {
		instructor=aValue;
	};


	/**
	*
	*/
	setProblemName (aValue) {
		problem_name=aValue;
	};

	/**
	*
	*/
	setProblemContext (aValue) {
		problem_context=aValue;
	};

	/**
	*
	*/
	setUserID (aValue) {
		userid=aValue;
	};

	/**
	*
	*/
	getLoggingCommLibrary () {
		return (loggingCommLibrary);
	};
	/**
	*
	*/
	setUseSessionLog (aValue) {
		useSessionLog=aValue;
	};
	/**
	*
	*/
	setLoggingURL (aURL) {
		pointer.getLoggingCommLibrary ().setFixedURL (aURL);
	};
	/**
	*
	*/
	getSessionIdentifierBundle() {
		var aBundle=[];
		aBundle ['class_name']=logclassname;
		aBundle ['school_name']=school;
		aBundle ['period_name']=period;
		aBundle ['class_description']=description;
		aBundle ['instructor_name']=instructor;
		aBundle ['dataset_name']=datasetName;

		aBundle ['problem_name']=problem_name;
		aBundle ['problem_context']=problem_context;

		aBundle ['auth_token']='';
		aBundle ['user_guid']=userid;

		aBundle ['session_id']=useVars ['session_id'];
		aBundle ['source_id']='tutor'; // Mainly for OLI

		aBundle ['dataset_level_name1']=datasetLevelName;
		aBundle ['dataset_level_type1']=datasetLevelType;
		
		return (aBundle);
	};

	/**	
	*
	*/
	setupExternalLibraryUsage () {
		pointer.ctatdebug ("setupExternalLibraryUsage ()");
			
		useVars ['class_name']=logclassname;
		useVars ['school_name']=school;
		useVars ['period_name']=period;
		useVars ['class_description']=description;
		useVars ['instructor_name']=instructor;
		useVars ['dataset_name']=datasetName;

		useVars ['problem_name']=problem_name;
		useVars ['problem_context']=problem_context;

		useVars ['auth_token']='';
		useVars ['user_guid']=userid;

		//var generator=new CTATGuid ();

		useVars ['session_id']=("ctat_session_"+SimonGuid.guid ());
		useVars ['source_id']='tutor'; // Mainly for OLI

		useVars ['dataset_level_name1']=datasetLevelName;
		useVars ['dataset_level_type1']=datasetLevelType;

		/*
		if (useOLILogging==true)
		{
			useVars ['DeliverUsingOLI']='true';
		}
		else
		{
			useVars ['DeliverUsingOLI']='false';
		}
		*/

		flashVars=CTATConfiguration.generateDefaultConfigurationObject();
		flashVars.assignRawFlashVars(useVars);
	}

	/**
	*
	*/
	initCheck () {
		pointer.ctatdebug ("initCheck ()");

		if (useInternal==false)
		{
			if (useInternalConfigured==false)
			{
				pointer.setupExternalLibraryUsage ();
				useInternalConfigured=true;
			}
		}
	}

	/**
	*
	*/
	sendMessage (message) {
		pointer.ctatdebug ("sendMessage ()");

		//useDebugging=true;
		pointer.ctatdebug ("Raw log message to send: " + message);
		//useDebugging=false;

		this.sendMessageInternal (message);

		if (logListener!=null)
		{
			logListener (message);
		}
	}

	/**
	*
	*/
	sendMessageInternal (message) {
		pointer.ctatdebug ("sendMessageInternal ()");

		if (loggingDisabled===true)
		{
			pointer.ctatdebug ("Warning: loggingDisabled==true");
			return;
		}
		
		/**
			WARNING! The following code is executed every time we send a message! We
			need to find a better way to handle this.
		*/
		if (useInternal==true)
		{
			var logging = CTATConfiguration.get('Logging');
			
			if ((logging !='ClientToService') && (logging!='ClientToLogServer'))
			{
				pointer.ctatdebug ("Logging is turned off, as per: " + logging);
				return;
			}
			
			var tsc = CTATConfiguration.get('tutoring_service_communication');
			
			if ((logging=='ClientToService') && ((tsc=='http') || (tsc=='https')))
			{
				var logURL = CTATConfiguration.get('remoteSocketURL')+":"+CTATConfiguration.get('remoteSocketPort')
				pointer.setLoggingURL (logURL);

				pointer.ctatdebug ("Reconfigured the logging url to be: " + logURL);
			}

			pointer.ctatdebug ("Pre encoded log message: " + message);
			
			if (message.indexOf ("<log_session_start")<0)
			{
				message = xmlProlog + '<tutor_related_message_sequence version_number="' + DTDVersion + '">' + message + '</tutor_related_message_sequence>';
				message = CTATLogMessageBuilder.commLogMessageBuilder.wrapForOLI (message);
			}
			
			pointer.ctatdebug ("Encoded log message: " + message);
			
			CTATLMS.logEvent(message);

			if (CTATConfiguration.get('log_service_url'))
			{
				loggingCommLibrary.sendXMLNoBundle (message);
			}	
		}
		else
		{
			pointer.ctatdebug ("Use internal: " + useInternal);			
		}
	}

	/**
	 *
	 */
	startProblem () {
		pointer.ctatdebug ("startProblem ()");

		pointer.initCheck ();

		//useDebugging=true;
		pointer.logSessionStart ();

		pointer.sendMessage (CTATLogMessageBuilder.commLogMessageBuilder.createContextMessage(true));

		//useDebugging=false;
	}

	/**
	*
	*/
	logSessionStart () {
		pointer.ctatdebug ("logSessionStart ()");

		pointer.initCheck ();

		//useOLILogging=true;

		var vars=CTATConfiguration.getRawFlashVars ();

		/*
		if (useInternal==true)
		{
			var vars=flashVars.getRawFlashVars ();

			if ((vars ['DeliverUsingOLI']!=undefined) && (vars ['DeliverUsingOLI']!=null))
			{
				if (vars ['DeliverUsingOLI']=='true')
				{
					pointer.ctatdebug ('Turning useOLILogging on ...');
					useOLILogging=true;
				}
				else
				{
					pointer.ctatdebug ('Turning useOLILogging off ...');
					useOLILogging=false;
				}
			}
		}
		*/

		if (vars ['SessionLog']!=undefined)
		{
			if (vars ['SessionLog']=='false' || (typeof (vars ['SessionLog'])=='boolean' && vars ['SessionLog']===false))
			{
				pointer.ctatdebug ('Turning SessionLog off ...');
				useSessionLog=false;
			}
			else
			{
				pointer.ctatdebug ('Turning SessionLog on ...');
				useSessionLog=true;
			}
		}

		// Don't send this if we're running in OLI because the OLI environment
		// well send one for us!
		if (useSessionLog===true)
	        {
			if(!CTATLogMessageBuilder.commLogMessageBuilder) {
			    CTATLogMessageBuilder.commLogMessageBuilder=new CTATLogMessageBuilder ();
			}
			this.sendMessage (CTATLogMessageBuilder.commLogMessageBuilder.createLogSessionStart());
		}
	}

	/**
	 * @private
	 * This is the internal version of Semantic Event logging for within CTAT itself and won't be visible in the API.
	 * NOTE:We will also end up using this one for hints.
	 * @param	transactionID			A GUID for the transaction
	 * @param	sai						A CTATSAI for the action.
	 * @param	semanticEventName		A name for the Semantic Event, usually "ATTEMPT"
	 * @param	semanticEventSubtype	A subtype for the Semantic Event, commonly used to refer to tutor-performed actions
	 */
	logSemanticEvent (transactionID,
									  sai,
									  semanticEventName,
									  semanticEventSubtype,
									  aCustomFieldNames,
									  aCustomFieldValues,
										aTrigger) {
		pointer.ctatdebug ("logSemanticEvent ("+aTrigger+")");

		pointer.initCheck ();

		lastSAI=sai;
		
		//var timeStamp = new Date(Date.UTC ());
		var timeStamp = new Date();

		CTATLogMessageBuilder.commLogMessageBuilder.resetCustomFields ();
		CTATLogMessageBuilder.commLogMessageBuilder.addCustomFields (aCustomFieldNames,aCustomFieldValues);
		CTATLogMessageBuilder.commLogMessageBuilder.addCustomField ("tool_event_time",CTATLogMessageBuilder.commLogMessageBuilder.formatTimeStamp (timeStamp) + " UTC");

		var message=CTATLogMessageBuilder.commLogMessageBuilder.createSemanticEventToolMessage (sai,
																		  transactionID,
																		  semanticEventName,
																		  semanticEventSubtype,
																		  true,
																		  aTrigger);
		this.sendMessage (message);
	}

	/**
	 * @private
	 * This is the internal method to send a tutor_message. It will not show up in the external API.
	 * NOTE: we will end up using this for hints as well, though you can use one of the public version as well.
	 * @param	transactionID
	 * @param	sai
	 * @param	anEval
	 * @param	feedBack
	 * @param	aSkillObject
	 */
	logTutorResponse (transactionID,
							  		sai,
							  		semanticName,
							  	  semanticSubtype,
							  		anEval,
							  		feedBack,
							  		aSkillObject,
									  aCustomFieldNames,
									  aCustomFieldValues) {
		pointer.ctatdebug("logTutorResponse ()");

		pointer.initCheck ();

		lastSAI=sai;

		var timeStamp =  new Date();

		CTATLogMessageBuilder.commLogMessageBuilder.resetCustomFields ();
		CTATLogMessageBuilder.commLogMessageBuilder.addCustomFields (aCustomFieldNames,aCustomFieldValues);
		CTATLogMessageBuilder.commLogMessageBuilder.addCustomField ("tutor_event_time",CTATLogMessageBuilder.commLogMessageBuilder.formatTimeStamp (timeStamp) + " UTC");

		pointer.ctatdebug("Formatting feedback ...");

		var formattedFeedback="";

		if ((feedBack!=undefined) && (feedBack!=null)) {
			var preFeedback=CTATGlobals.languageManager.filterString (feedBack);

			/*
			if ((preFeedback.indexOf("'")!=-1) ||
				(preFeedback.indexOf("\"")!=-1) ||
				(preFeedback.indexOf("<")!=-1) ||
				(preFeedback.indexOf(">")!=-1) ||
				(preFeedback.indexOf("&")!=-1))
			{
				pointer.ctatdebug("Feedback message contains invalid characters, wrapping in CDATA ...");
				formattedFeedback="<![CDATA["+preFeedback+"]]>";
			}
			else
			{
				pointer.ctatdebug("Feedback message doesn't contain any invalid characters, using as-is");
				formattedFeedback=preFeedback;
			}
			*/

			formattedFeedback="<![CDATA["+preFeedback+"]]>";
		} else {
			pointer.ctatdebug("No feedback provided, using empty string");
			formattedFeedback="";
		}

		pointer.ctatdebug("Creating tutor message ...");

		var message=CTATLogMessageBuilder.commLogMessageBuilder.createTutorMessage (sai,
															  transactionID,
															  semanticName,
															  anEval,
															  formattedFeedback,
															  semanticSubtype,
															  aSkillObject,
															  true);
		this.sendMessage (message);
	}

	/**
	*
	*/
	processMessage (aMessage) {
		pointer.ctatdebug("processMessage ()");

		pointer.ctatdebug("Response from log server: " + aMessage);
	}

	//------------------------------------------------------------------------------
	// Public API methods start here
	//------------------------------------------------------------------------------

	/**
	* Part of the public API. Use this function to both start a session and indicate
	* to a log server that the user has started working on a problem. The methods
	* called in this convenience method can also be called separately
	*/
	start () {
		pointer.ctatdebug ("start ()");

		var sessionTag=pointer.generateSession ();
		pointer.startProblem ();

		//CTATScrim.scrim.scrimDown (); // Just in case

		return (sessionTag);
	}

	/**
	* Convenience function for the public API, not used by the CTAT library itself. 
	* DO NOT REMOVE THIS METHOD. We depend on it for testing
	*/
	logInterfaceAttempt (aSelection,anAction,anInput,aCustomElementObject) {
		pointer.ctatdebug ("logInterfaceAttempt ()");

		var transactionID = SimonGuid.guid ();

		var sai=new CTATSAI (aSelection,anAction,anInput);
		sai.setInput (anInput);
		
		lastSAI=sai;

		this.logSemanticEvent (transactionID,sai,"ATTEMPT","");

		return (transactionID);
	}

	/**
	* Convenience function for the public API, not used by the CTAT library itself. 
	* DO NOT REMOVE THIS METHOD. We depend on it for testing
	*/
	logInterfaceAttemptSAI (anSAI,aCustomElementObject) {
		pointer.ctatdebug ("logInterfaceAttemptSAI ()");

		lastSAI=anSAI;
		
		var transactionID = SimonGuid.guid ();

		this.logSemanticEvent (transactionID,anSAI,"ATTEMPT","");

		return (transactionID);
	}

	/**
	* Convenience function for the public API, not used by the CTAT library itself. Be
	* careful using this function since it might not be actively maintained!
	* DO NOT REMOVE THIS METHOD. We depend on it for testing
	*/
	logResponse (transactionID,
							 aSelection,anAction,anInput,
							 semanticName,
							 anEvaluation,
						   anAdvice,
							 aCustomElementObject) {
		pointer.ctatdebug ("logResponse ()");

		var sai=new CTATSAI (aSelection,anAction,anInput);
		sai.setInput (anInput);

		var evalObj=new CTATActionEvaluationData("");
		evalObj.setEvaluation (anEvaluation);

		if (aCustomElementObject==undefined) {
			this.logTutorResponse (transactionID,
								   sai,
								   semanticName,
								   "",
								   evalObj,
								   anAdvice);
		} else {
			this.logTutorResponse (transactionID,
								   sai,
								   semanticName,
								   "",
								   evalObj,
								   anAdvice,
								   null, // Skills object
								   aCustomElementObject.getCustomElementNames (),
								   aCustomElementObject.getCustomElementTypes ());
		}
	}

	/**
	* Convenience function for the public API, not used by the CTAT library itself. Be
	* careful using this function since it might not be actively maintained!
	* DO NOT REMOVE THIS METHOD. We depend on it for testing	
	*/
	logResponseSAI (transactionID,
									anSAI,
									semanticName,
									anEvaluation,
									anAdvice,
									aCustomElementObject) {
		pointer.ctatdebug ("logResponse ()");

		var evalObj=new CTATActionEvaluationData("");
		evalObj.setEvaluation (anEvaluation);

		if (aCustomElementObject==undefined) {
			this.logTutorResponse (transactionID,
								   anSAI,
								   semanticName,
								   "",
								   evalObj,
								   anAdvice);
		} else {
			this.logTutorResponse (transactionID,
								   anSAI,
								   semanticName,
								   "",
								   evalObj,
								   anAdvice,
								   null, // Skills object
								   aCustomElementObject.getCustomElementNames (),
								   aCustomElementObject.getCustomElementTypes ());
		}
	}

	/**
	*
	*/
	endSession () {
		this.generateSession (); // just in case
	}
}
