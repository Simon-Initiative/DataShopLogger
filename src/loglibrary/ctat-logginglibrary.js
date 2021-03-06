/*
 Notes:

 For OLI, make sure you use the correct session id, otherwise the server will respond with:

	status=failure
	cause=NOT_AUTHENTICATED
	message=com.beginmind.login.service.InvalidSessionException: invalid session token
*/

import * as tools from '../simon-lms-tools.js';
import SimonBase from '../simon-base.js';
import LogConfiguration from '../logconfiguration.js';
import CTATLogMessageBuilder from './ctat-logmessagebuilder.js'
import OLIXAPIMessageBuilder from './ctat-xapilogmessagebuilder.js'
import OLILogLibraryBase from './oli-loglibrarybase.js'
import CTATCommLibrary from '../ctat-commlibrary.js'
import CTATGuid from '../tools/ctat-guid.js'
import SAI from '../sai.js'
import ActionEvaluationData from '../evaluationdata.js'

var loggingDisabled=false; // Be very careful with this flag, it will do a hard disable on logging!

/**
 * 
 */
export default class CTATLoggingLibrary extends OLILogLibraryBase {

	/**
	*
	*/
	constructor (aConfiguration) {
		super ("CTATLoggingLibrary","commLoggingLibrary");

    this.logConfiguration=aConfiguration;
		this.pointer=this;

		// The current version of this LoggingLibrary.
		this.version="3.Beta";

		// The version of the DataShop DTD specification that this LoggingLibrary conforms with.
		this.DTDVersion="4";

		// I just copy pasted this off of DataShop's website, its probably right but it may not even be necessary to include.
		this.nameSpace="xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:noNamespaceSchemaLocation='http://learnlab.web.cmu.edu/dtd/tutor_message_v4.xsd'";

		// The standard XMLProlog, we actually reference this a lot.
		this.xmlProlog='<?xml version="1.0" encoding="UTF-8"?>';

    // Set the default message format to DataShop. This is only a default. Developers are
    // encouraged to ensure that the message encoder corresponds to the desired format.
    this.logFormat="DATASHOP";

		this.useSessionLog=true;
		this.useInternal=true;
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

		this.context_name=tools.uuidv4();

		this.logListener=null;
		
		this.lastSAI=null;
		
		//var gen=new CTATGuid ();
		//this.userid=SimonGuid.guid ();
		this.userid=tools.uuidv4();

    /*
		if ((anInternalUsage!=undefined) && (anInternalUsage!=null)) {
			this.useInternal=anInternalUsage;
    }
    */

		this.loggingCommLibrary=new CTATCommLibrary (this.logConfiguration);
		this.loggingCommLibrary.setName ("commLoggingLibrary");
		this.loggingCommLibrary.setUseCommSettings (true);
		this.loggingCommLibrary.setConnectionRefusedMessage ("ERROR_CONN_LS");
		this.loggingCommLibrary.assignHandler (this);

		this.guidGenerator=new CTATGuid ();

    // Make sure we have a session configured in case the developer forgets upon first use
		this.generateSession ();
	}

	/**
	*
	*/
	getLastSAI () {
		return (lastSAI);
	}

	/**
	*
	*/
	setLogFormat (aFormat) {
		this.logFormat=aFormat;
	}

	/**
	*
	*/
	getLogFormat () {
		return (this.logFormat);
	}

	/**
	*
	*/
	assignLogListener (aListener) {
		this.logListener=aListener;
	}

	/**
	*
	*/
	generateSession () {
		this.useVars ['session_id']=("ctat_session_"+this.guidGenerator.guid ());

		return (this.useVars ['session_id']);
	}

	/**
	*
	*/
	setLogClassName (aValue) {
		this.logclassname=aValue;
	}

	/**
	*
	*/
	setDatasetName (aValue) {
		this.datasetName=aValue;
	}

	/**
	*
	*/
	setDatasetLevelName (aValue) {
		this.datasetLevelName=aValue;
	}

	/**
	*
	*/
	setDatasetLevelType (aValue) {
		this.datasetLevelType=aValue;
	}

	/**
	*
	*/
	setSchool (aValue) {
		this.school=aValue;
	}

	/**
	*
	*/
	setPeriod (aValue) {
		this.period=aValue;
	}

	/**
	*
	*/
	setDescription (aValue) {
		this.description=aValue;
	}

	/**
	*
	*/
	setInstructor (aValue) {
		this.instructor=aValue;
	}


	/**
	*
	*/
	setProblemName (aValue) {
		this.problem_name=aValue;
	}

	/**
	*
	*/
	setProblemContext (aValue) {
		this.problem_context=aValue;
	}

	/**
	*
	*/
	setUserID (aValue) {
		this.userid=aValue;
	}

	/**
	*
	*/
	getLoggingCommLibrary () {
		return (this.loggingCommLibrary);
	}
	/**
	*
	*/
	setUseSessionLog (aValue) {
		this.useSessionLog=aValue;
	}
	/**
	*
	*/
	setLoggingURL (aURL) {
		this.getLoggingCommLibrary ().setFixedURL (aURL);
	}
  /**
  *
  */
	setLoggingURLQA() {
    this.setLoggingURL("https://pslc-qa.andrew.cmu.edu/log/server");
	}
  /**
  *
  */
	setLoggingURLProduction() {
    this.setLoggingURL("https://learnlab.web.cmu.edu/log/server");
	}	

	/**
	 * <b>[Required]</b> The &#60;name&#62; attribute of the current context.
	 * <p>The name attribute is used to indicate where the student is in the process of working on a tutor or problem.
	 * The PSLC DataShop team has established some canonical values for this attribute that should be used,
	 * displayed in <a href="http://pslcdatashop.web.cmu.edu/dtd/guide/context_message.html#table.context_message.name.values">Table 1, Recommended values for the &#60;context_message&#62; name attribute</a>.</p>
	 * @param context_name A name for the current context, see table for a set of recommended names.
	 */
	setContextName(aName) {
   this.context_name=aName;
	}

	/**
	*
	*/
	getContextName () {
	  return this.context_name;
	}	

	/**
	*
	*/
	getSessionIdentifierBundle() {
		var aBundle=[];
		aBundle ['class_name']=this.logclassname;
		aBundle ['school_name']=this.school;
		aBundle ['period_name']=this.period;
		aBundle ['class_description']=this.description;
		aBundle ['instructor_name']=this.instructor;
		aBundle ['dataset_name']=this.datasetName;

		aBundle ['problem_name']=this.problem_name;
		aBundle ['problem_context']=this.problem_context;

		aBundle ['auth_token']='';
		aBundle ['user_guid']=this.userid;

		aBundle ['session_id']=this.useVars ['session_id'];
		aBundle ['source_id']='tutor'; // Mainly for OLI

    /*
		aBundle ['dataset_level_name1']=this.datasetLevelName;
		aBundle ['dataset_level_type1']=this.datasetLevelType;
		*/

		aBundle ['dataset_level_name1']=[];
		aBundle ['dataset_level_type1']=[];

		aBundle ['dataset_level_name1'][0]=this.datasetLevelName;
		aBundle ['dataset_level_type1'][0]=this.datasetLevelType;

		return (aBundle);
	};

	/**	
	*
	*/
	setupExternalLibraryUsage () {
		this.ctatdebug ("setupExternalLibraryUsage ()");
			
		this.useVars ['class_name']=this.logclassname;
		this.useVars ['school_name']=this.school;
		this.useVars ['period_name']=this.period;
		this.useVars ['class_description']=this.description;
		this.useVars ['instructor_name']=this.instructor;
		this.useVars ['dataset_name']=this.datasetName;

		this.useVars ['problem_name']=this.problem_name;
		this.useVars ['problem_context']=this.problem_context;

		this.useVars ['auth_token']='';
		this.useVars ['user_guid']=this.userid;

		//var generator=new CTATGuid ();

		this.useVars ['session_id']=("ctat_session_"+this.guidGenerator.guid ());
		this.useVars ['source_id']='tutor'; // Mainly for OLI

    /*
		this.useVars ['dataset_level_name1']=this.datasetLevelName;
		this.useVars ['dataset_level_type1']=this.datasetLevelType;
    */

		this.useVars ['dataset_level_name1']=[];
		this.useVars ['dataset_level_type1']=[];

		this.useVars ['dataset_level_name1'][0]=this.datasetLevelName;
		this.useVars ['dataset_level_type1'][0]=this.datasetLevelType;		

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

    /*
		flashVars=CTATConfiguration.generateDefaultConfigurationObject();
		flashVars.assignRawFlashVars(useVars);
		*/
	}

	/**
	 * Setup all the moving parts of the library. After this you should be good to call any
	 * of the public log API methods.
	 */
	initCheck () {
		this.ctatdebug ("initCheck ()");

		if (this.useInternal==false) {
			if (this.useInternalConfigured==false) {
				this.setupExternalLibraryUsage ();
				this.useInternalConfigured=true;
			}
		}

		if (this.commLogMessageBuilder==null) {
			if (this.logFormat=="DATASHOP") {
			  this.commLogMessageBuilder=new CTATLogMessageBuilder (this.useVars,this.logConfiguration);
      }

      if (this.logFormat=="XAPI") {
      	this.commLogMessageBuilder=new OLIXAPIMessageBuilder (this.useVars,this.logConfiguration);
      }

      if (this.commLogMessageBuilder==null) {
      	this.commLogMessageBuilder=new CTATLogMessageBuilder (this.useVars,this.logConfiguration);
      }

			this.commLogMessageBuilder.setContextName (this.getContextName());
		}
	}

	/**
	*
	*/
	sendMessage (message) {
		this.ctatdebug ("sendMessage ()");

		this.ctatdebug ("Raw log message to send: " + message);

		this.sendMessageInternal (message);

		if (this.logListener!=null) {
			this.logListener (message);
		}
	}

	/**
	*
	*/
	sendMessageInternal (message) {
		this.ctatdebug ("sendMessageInternal ()");

		if (loggingDisabled===true) {
			this.ctatdebug ("Warning: loggingDisabled==true");
			return;
		}

		var formatHandled=false;
		
		/**
			WARNING! The following code is executed every time we send a message! We
			need to find a better way to handle this.
		*/
		if (this.commLogMessageBuilder.getMessageFormat ()=="XML") {

			formatHandled=true;

			if (this.useInternal==true) {
		  	this.ctatdebug ("Pre encoded log message: " + message);
				
				if (message.indexOf ("<log_session_start")<0) {
					message = this.xmlProlog + '<tutor_related_message_sequence version_number="' + this.DTDVersion + '">' + message + '</tutor_related_message_sequence>';
					message = this.commLogMessageBuilder.wrapForOLI (message);
				}
				
				this.ctatdebug ("Encoded log message: " + message);
				
				this.loggingCommLibrary.sendXMLNoBundle (message);
			} else {
				this.ctatdebug ("Use internal: " + this.useInternal);			
				this.loggingCommLibrary.sendXMLNoBundle (message);
			}
	  } 

	  if (this.commLogMessageBuilder.getMessageFormat ()=="JSON") {
	  	formatHandled=true;

	  	this.loggingCommLibrary.sendJSON(message);
	  }

	  if (formatHandled==false) {
	  	this.ctatdebug ("Internal error: unable to establish logging format, message not sent");
	  }
	}

	/**
	 *
	 */
	startProblem () {
		this.ctatdebug ("startProblem ()");

		this.initCheck ();

		this.logSessionStart ();

		this.sendMessage (this.commLogMessageBuilder.createContextMessage(true));
	}

	/**
	*
	*/
	logSessionStart () {
		this.ctatdebug ("logSessionStart ()");

		this.initCheck ();

		if (this.useVars ['SessionLog']!=undefined) {
			if (this.useVars ['SessionLog']=='false' || (typeof (this.useVars ['SessionLog'])=='boolean' && this.useVars ['SessionLog']===false)) {
				this.ctatdebug ('Turning SessionLog off ...');
				this.useSessionLog=false;
			} else {
				this.ctatdebug ('Turning SessionLog on ...');
				this.useSessionLog=true;
			}
		}

		if (this.useSessionLog===true) {
			this.sendMessage (this.commLogMessageBuilder.createLogSessionStart(this.useVars));
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
		this.ctatdebug ("logSemanticEvent ("+aTrigger+")");

		this.initCheck ();

		this.lastSAI=sai;
		
		//var timeStamp = new Date(Date.UTC ());
		var timeStamp = new Date();

		this.commLogMessageBuilder.resetCustomFields ();
		this.commLogMessageBuilder.addCustomFields (aCustomFieldNames,aCustomFieldValues);
		this.commLogMessageBuilder.addCustomField ("tool_event_time",this.commLogMessageBuilder.formatTimeStamp (timeStamp) + " UTC");

		var message=this.commLogMessageBuilder.createSemanticEventToolMessage (sai,
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
		this.ctatdebug("logTutorResponse ()");

		this.initCheck ();

		this.lastSAI=sai;

		var timeStamp =  new Date();

		this.commLogMessageBuilder.resetCustomFields ();
		this.commLogMessageBuilder.addCustomFields (aCustomFieldNames,aCustomFieldValues);
		this.commLogMessageBuilder.addCustomField ("tutor_event_time",this.commLogMessageBuilder.formatTimeStamp (timeStamp) + " UTC");

		this.ctatdebug("Formatting feedback ...");

		var formattedFeedback="";

		if ((feedBack!=undefined) && (feedBack!=null)) {
			formattedFeedback="<![CDATA["+feedBack+"]]>";
		} else {
			this.ctatdebug("No feedback provided, using empty string");
			formattedFeedback="";
		}

		this.ctatdebug("Creating tutor message ...");

		var message=this.commLogMessageBuilder.createTutorMessage (sai,
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
		this.ctatdebug("processMessage ()");

		this.ctatdebug("Response from log server: " + aMessage);
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
		this.ctatdebug ("start ()");

		var sessionTag=this.generateSession ();
		this.startProblem ();

		//CTATScrim.scrim.scrimDown (); // Just in case

		return (sessionTag);
	}

	/**
	* Convenience function for the public API, not used by the CTAT library itself. 
	* DO NOT REMOVE THIS METHOD. We depend on it for testing
	*/
	logInterfaceAttempt (aSelection,anAction,anInput,aCustomElementObject) {
		this.ctatdebug ("logInterfaceAttempt ()");

		var transactionID = this.guidGenerator.guid ();

		var sai=new SAI (aSelection,anAction,anInput);
		
		this.lastSAI=sai;

		this.logSemanticEvent (transactionID,sai,"ATTEMPT","");

		return (transactionID);
	}

	/**
	* Convenience function for the public API, not used by the CTAT library itself. 
	* DO NOT REMOVE THIS METHOD. We depend on it for testing
	*/
	logInterfaceAttemptSAI (anSAI,aCustomElementObject) {
		this.ctatdebug ("logInterfaceAttemptSAI ()");

		this.lastSAI=anSAI;
		
		var transactionID = this.guidGenerator.guid ();

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
		this.ctatdebug ("logResponse ()");

		var sai=new SAI (aSelection,anAction,anInput);

		var evalObj=new ActionEvaluationData("");
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
		this.ctatdebug ("logResponse ()");

		var evalObj=new ActionEvaluationData("");
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
