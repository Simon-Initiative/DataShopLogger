
import SimonBase from '../simon-base.js';

/**
 * CTATLogMessageBuilder is used to create xml log messages that conform to DataShop's specifications.
 * <p> This class contains static factory methods that are used to create the different types of log messages used in the
 * DataShop specification.</p>
 * Example:
 	<tutor_related_message_sequence version_number="4">
		<context_message context_message_id="98F2147D22FAA521048373A69AB06C23B347866" name="LOAD_TUTOR">
			<class>
				<name>Default Class</name>
				<school>Admin</school>
				<instructor>admin</instructor>
			</class>
			<dataset>
				<name>Mathtutor</name>
				<level type="ProblemSet">
					<name>QA2.0_debug_enabled_tutor</name>
					<problem>
						<name>1415-error</name>
					</problem>
				</level>
			</dataset>
		</context_message>
	</tutor_related_message_sequence>
*/
export default class CTATLogMessageBuilder extends SimonBase {

  /**
  *
  */
	constructor (aVars) {
		super ("CTATLogMessageBuilder","logmessagebuilder");

    this.customFieldNames=[];
	  this.customFieldValues=[];

    this.flashVars=aVars;

		//this.pointer=this;

		// Blanked this out to kill a bug that generated extra XML headers. Used to be = '<?xml version="1.0" encoding="UTF-8"?>'
		this.xmlHeader = '';

		/**
		 * The standard XMLProlog, we actually reference this a lot.
		 */
		this.xmlProlog = '<?xml version="1.0" encoding="UTF-8"?>';

		this.contextGUID = '';
  }

	/**
	 * <b>[Required]</b> The &#60;name&#62; attribute of the current context.
	 * <p>The name attribute is used to indicate where the student is in the process of working on a tutor or problem.
	 * The PSLC DataShop team has established some canonical values for this attribute that should be used,
	 * displayed in <a href="http://pslcdatashop.web.cmu.edu/dtd/guide/context_message.html#table.context_message.name.values">Table 1, Recommended values for the &#60;context_message&#62; name attribute</a>.</p>
	 * @param	context_name	A name for the current context, see table for a set  of recommended names.
	 */
	setContextName(context_name) {
		this.contextGUID = context_name;
	}

	/**
	*
	*/
	getContextName() {
		this.contextGUID;
	}

	/**
	*
	*/
	makeSessionElement () {
		if ((this.flashVars ['log_session_id']!=undefined) && (this.flashVars ['log_session_id']!=null)) {
			return ('<session_id>'+this.flashVars ['log_session_id']+'</session_id>');
		}

		return ('<session_id>'+this.flashVars ['session_id']+'</session_id>');
	}

	/**
	*	Builds a context message to the Data Shop specifications.
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/context_message.html
	*	DataShop specification for context_message
	* 	Quick example of the translation between data set flashvars and
	*	the resulting XML:
	*
	*	"dataset_name":"BDE101 Test",
	*	"dataset_level_name1":"Assignment",
	*	"dataset_level_type1":"Assignment",
	*	"dataset_level_name2":"Assignment4of8",
	*	"dataset_level_type2":"ProblemSet",
	*	"problem_name":"Assignment4",
	*	"problem_context":"Assignment 4 for edX MOOC Big Data in Education, Summer 2015."
	*
	*	<dataset>
	*	  	<name>BDE101 Test</name>
	*	  	<level type="Assignment">
	*			<name>Assignment</name>
	*	 		<level type="ProblemSet">
	*	   			<name>Assignment4of8</name>
	*			   	<problem tutorFlag="tutor">
	*					<name>Assignment4</name>
	*					<context>Assignment 4 for edX MOOC Big Data in Education, Summer 2015.</context>
	*	   			</problem>
	*			</level>
	*		</level>
	*	</dataset>
	*/
	createContextMessage (aWrapForOLI) {
		this.ctatdebug("createContextMessage()");

		var now=new Date();

		var vars=this.flashVars;

		var messageString=this.xmlHeader+'<context_message context_message_id="'+this.getContextName()+'" name="START_PROBLEM">';

		if(!this.aWrapForOLI) {
			messageString += this.makeMetaElement(now);
		}

		//>---------------------------------------------------------------------
		// class

		var classS = '';

		if (vars ['class_name']!=undefined) {
			if (vars ['class_name']!="") {
				classS = '<class>';

				classS += '<name>'+ vars ['class_name'] + '</name>';

				if (vars ['school_name']!=undefined) {
					classS += '<school>'+ vars ['school_name'] + '</school>';
				}

				if (vars ['period_name']!=undefined) {
					classS += '<period>'+ vars ['period_name'] + '</period>';
				}

				if (vars ['class_description']!=undefined) {
					classS += '<description>'+ vars ['class_description'] + '</description>';
				}

				if (vars ['instructor_name']!=undefined) {
					classS += '<instructor>' + vars ['instructor_name'] + '</instructor>';
				}

				classS += '</class>';
			} else {
				classS='<class />';
			}
		} else {
			classS='<class />';
		}

		messageString += classS;

		//>---------------------------------------------------------------------
		// <dataset>

		//if (vars ['DeliverUsingOLI']=='false')
		//{
			
			//var datasetLevelTypes = this.flashVars.getDatasetTypes ();
			//var datasetLevelNames = this.flashVars.getDatasetNames ();

			var datasetLevelTypes = [];
			var datasetLevelNames = [];

			this.ctatdebug ("Check: " + datasetLevelTypes.length + ", " + datasetLevelNames.length);

			if ((datasetLevelTypes!=null) && (datasetLevelNames!=null)) {
				this.ctatdebug ("We have valid data set names and types, adding to message ...");

				var dataset = '<dataset>';
				dataset += '<name>'+vars ['dataset_name']+'</name>';

				for (var k=0;k<datasetLevelTypes.length;k++) {
					this.ctatdebug ("Adding ...");

					dataset += '<level type="' + datasetLevelTypes[k] + '">';
					dataset += '<name>' + datasetLevelNames[k] + '</name>';
				}

				dataset += '<problem ';

				this.ctatdebug ("Checking vars [\"problem_tutorflag\"]: " + vars ["problem_tutorflag"]);
				this.ctatdebug ("Checking vars [\"problem_otherproblemflag\"]: " + vars ["problem_otherproblemflag"]);

				if ((vars ["problem_tutorflag"]!=undefined) || (vars ["problem_otherproblemflag"]!=undefined)) {
					if (vars ["problem_tutorflag"]!=undefined) {
						dataset+=' tutorFlag="' + vars ["problem_tutorflag"]+'"';
					} else {
						if (vars ["problem_otherproblemflag"]!=undefined) {
							dataset+='tutorFlag="' + vars ["problem_otherproblemflag"]+'"';
						}
					}
				}

				dataset += '>';
				dataset += '<name>'+vars ['problem_name']+'</name>';

				if (vars ['problem_context']!=undefined) {
					dataset += '<context>' + vars ['problem_context'] + '</context>';
				} else {
					dataset += '<context />';
				}

				dataset += '</problem>';

				for (var l=0;l<datasetLevelTypes.length;l++) {
					dataset += '</level>';
				}

				dataset += '</dataset>';

				messageString += dataset;
			}
		//}

		//>---------------------------------------------------------------------
		//<condition>

		//if (vars ['DeliverUsingOLI']=='false')
		//{
			var condition="";

      /* 
			var conditionNames = flashVars.getConditionNames();
			var conditionTypes = flashVars.getConditionTypes();
			var conditionDescriptions = flashVars.getConditionDescriptions();
      */

			var conditionNames = [];
			var conditionTypes = [];
			var conditionDescriptions = [];

			//for (var cond in conditionNames)
			if (conditionNames.length>0) {
				for (var i=0;i<conditionNames.length;i++) {
					//cond=conditionNames [i];

					condition += '<condition><name>'+conditionNames[i]+'</name>';
					condition += (conditionTypes[i] == "" ? "" : '<type>'+conditionTypes[i]+'</type>');
					condition += (conditionDescriptions[i] == "" ? "" : '<desc>'+conditionDescriptions[i]+'</desc>');
					condition += '</condition>';
				}
			}

			messageString += condition;
		//}
		//>---------------------------------------------------------------------
		// custom fields
		//var cFields=flashVars.getCustomFields ();

		var cFields=[];

		for(var aField in cFields) {
			if (cFields.hasOwnProperty(aField)) {
				messageString += '<custom_field>';
				messageString += '<name>' + aField + '</name>';
				messageString += '<value>' + cFields[aField] + '</value>';
				messageString += '</custom_field>';
			}
		}

		messageString += "</context_message>";

		this.ctatdebug ("messageString = " + messageString);

		return messageString;
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

		var now=new Date();
		var vars=flashVars.getRawFlashVars ();
		var messageString=xmlHeader+'<tool_message context_message_id="'+this.getContextName()+'">';

		//<meta>
		if (!wrapForOLI) {
			messageString += this.makeMetaElement (now);
		}


		//<semantic_event> (1+)
		var semantic='<semantic_event transaction_id="'+semanticTransactionID+ '" name="' + semanticName + '"';

		if (semanticSubType != "") {
			semantic += ' subtype="' + semanticSubType + '"';
		}

		if ((aTrigger!=undefined) && (aTrigger != "")) {
			semantic += ' trigger="' + aTrigger + '"';
		}

		semantic+='/>';
		messageString+=semantic;

		//<event_descriptor>(0+)
		var eventDescriptor = '<event_descriptor>';

		//useDebugging=true;
		var loggedSAI=sai.toXMLString(true);
		//this.ctatdebug ("Logged SAI (B): " + loggedSAI);
		eventDescriptor+=loggedSAI;
		//useDebugging=false;

		eventDescriptor+='</event_descriptor>';
		messageString+=eventDescriptor;

		messageString+=this.createCustomFields (customFieldNames,customFieldValues);

		messageString += '</tool_message>';

		/*
		if (wrapForOLI)
		{
			messageString = this.wrapForOLI(messageString);
		}
		*/

		//useDebugging=true;
		this.ctatdebug ("messageString = "+messageString);
		//useDebugging=false;

		return messageString;
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

		var now = new Date();
		var vars=flashVars.getRawFlashVars ();
		var messageString = xmlHeader+'<tool_message context_message_id="'+this.getContextName()+'">';

		//<meta>
		if (!wrapForOLI) {
			messageString += this.makeMetaElement (now);
		}

		//<ui_event> (1+)
		var uiEvent = '<ui_event name="'+uiEventName+'">'+uiEventField+'</ui_event>';
		messageString += uiEvent;

		//<event_descriptor>(0+)
		var eventDescriptor = '<event_descriptor>';
		eventDescriptor+=sai.toSerializedString();
		eventDescriptor+='</event_descriptor>';

		messageString+=eventDescriptor;

		messageString+=this.createCustomFields (customFieldNames,customFieldValues);

		messageString+='</tool_message>';

		/*
		if (wrapForOLI)
		{
			messageString = this.wrapForOLI(messageString);
		}
		*/

		this.ctatdebug ("messageString = "+messageString);

		return messageString;
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

		var now = new Date();
		var vars=flashVars.getRawFlashVars ();
		var messageString = xmlHeader+'<tutor_message context_message_id="'+this.getContextName()+'">';

		//<meta>
		if (!wrapForOLI) {
			messageString += this.makeMetaElement(now);
		}

		//<semantic_event> (1+)
		var semantic = '<semantic_event transaction_id="' + semanticTransactionID + '" name="' + semanticName + '"';

		if (semanticSubType !== "") {
			semantic += ' subtype="' + semanticSubType + '"';
		}

		semantic+='/>';
		messageString+=semantic;

		//<event_descriptor>(0+)
		var eventDescriptor = '<event_descriptor>';
		eventDescriptor+=sai.toXMLString(true);
		eventDescriptor+='</event_descriptor>';
		messageString+=eventDescriptor;

		//<action_evaluation> (0+)
		var actionEvaluation = '<action_evaluation ';

		if (evalObj.hasClassification()) {
			if (evalObj.getAttributeString()!=null) {
				actionEvaluation += evalObj.getAttributeString();
			}
		}

		actionEvaluation += '>'+evalObj.getEvaluation()+'</action_evaluation>';
		messageString += actionEvaluation;

		//<tutor_advice>(0+)
		if (advice != "") {
			messageString += '<tutor_advice>'+advice+'</tutor_advice>';
		}

		/*
		if ((skillSet!=undefined) && (skillSet!=null))
		{
			this.ctatdebug ("Adding " + skillSet.getSize () + " skills to log message ...");

			messageString+=skillSet.toLogString ();
		}
		else
		{
			this.ctatdebug ("No skills defined for this message");
		}
		*/

		if (aSkillObject!=null) {
			this.ctatdebug ("Adding skills to log message ...");

			messageString+=aSkillObject.toLogString ();
		}

		messageString+=this.createCustomFields (customFieldNames,customFieldValues);

		messageString+='</tutor_message>';

		/*
		if (wrapForOLI)
		{
			messageString = this.wrapForOLI(messageString);
		}
		*/

		this.ctatdebug("messageString = "+messageString);

		return messageString;
	}

	/**
	*	Builds a generic message to the Data Shop specifications.
	*	<p>In practice this will only assure that the message compiles with general XML specifications and that
	*	it contains the minimal requirements for a "message" in Data Shop's specifications.</p>
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/message_message.html DataShop specification for message
	*/
	createGenericMessage(logMessage,wrapForOLI) {
		this.ctatdebug ("createGenericMessage()");

		var vars=flashVars.getRawFlashVars ();

		var messageString = xmlHeader+'<message context_message_id="'+this.getContextName()+'">';
		messageString+=logMessage;
		messageString+='</message>';

		/*
		if (wrapForOLI==true)
		{
			messageString = this.wrapForOLI (messageString);
		}
		*/

		this.ctatdebug ("messageString = "+messageString);

		return messageString;
	}

	/**
	 *
	 */
	makeMetaElement (timeStamp) {
		this.ctatdebug ("makeMetaElement ()");

		//var vars=flashVars.getRawFlashVars ();

		var meta='<meta>';
		meta += '<user_id>'+this.flashVars['user_guid']+'</user_id>';
		meta += '<session_id>'+this.flashVars['session_id']+'</session_id>';
		meta += '<time>'+this.formatTimeStamp(timeStamp)+'</time>';
		meta += '<time_zone>'+this.getTimeZone ()+'</time_zone>';
		meta += '</meta>';

		return meta;
	}

	/**
	*
	*/
	wrapForOLI (messageString) {
		this.ctatdebug ("wrapForOLI ()");

		//var now=new Date(Date.UTC ());
		var now=new Date();

		//var vars=flashVars.getRawFlashVars ();

		messageString = encodeURIComponent(messageString);

		var wrapper = xmlProlog + '<log_action ';
		wrapper += 'auth_token="'+encodeURIComponent(vars ['auth_token'])+'" ';

		if ((vars ['log_session_id']!=undefined) && (vars ['session_id']!=null)) {
			wrapper += 'session_id="' + vars ['log_session_id'] + '" ';
		} else {
			wrapper += 'session_id="' + vars ['session_id'] + '" ';
		}

		wrapper += 'action_id="' + "EVALUATE_QUESTION" + '" ';
		wrapper += 'user_guid="' + this.flashVars ['user_guid'] + '" ';
		wrapper += 'date_time="' + this.formatTimeStampOLI(now) + '" ';
		wrapper += 'timezone="' + this.getTimeZone () + '" ';
		wrapper += 'source_id="' + this.flashVars ['source_id'] + '" ';

		if (vars ['activity_context_guid']) {
			wrapper += 'external_object_id="'+vars ['activity_context_guid']+'" info_type="tutor_message.dtd">';
		} else {
			wrapper += 'external_object_id="" info_type="tutor_message.dtd">';
		}

		messageString = wrapper + messageString + "</log_action>";

		return messageString;
	}

	/**
	 *
	 * @returns
	 */
	getTimeZone() {
		if (this.raw!=null) {
			if (this.raw ['timezone']) {
				return (this.raw ['timezone']);
			}
		}

		return "UTC";
	}

	/**
	 * Creates a SessionStart message.
	 * <p>session_log messages are part of logging to an OLI framework.</p>
	 * @param	sessionObj	The CTATSessionData object, this is a member of CTATContextData
	 * @return	Returns a session_log message.
	 */
  createLogSessionStart (aVarset) {
		this.ctatdebug ("createLogSessionStart ()");

		//var now=new Date(Date.UTC ());
		var now = new Date();

		this.ctatdebug ("Date: " + now);

		var message='<log_session_start timezone="' + this.getTimeZone() + '" ';

		//var aVarset=flashVars.getRawFlashVars ();

		message += 'date_time="'+this.formatTimeStampOLI(now) + '" ';
		message += 'auth_token="' + aVarset['auth_token'] + '" ';
		message += 'session_id="' + aVarset['session_id'] + '" ';
		message += 'user_guid="' + aVarset['user_guid'] + '" ';
		message += 'class_id="" treatment_id="" assignment_id="" info_type="tutor_message.dtd"/>';

		return message;
	}

	/**
	 * Formats Date objects into Datashop's prefered format.
	 * @param	stamp	A Date object.
	 * @return	A String in the proper format
	 *
	 * http://www.w3schools.com/jsref/jsref_obj_date.asp
	 */
	formatTimeStamp (stamp) {
		this.ctatdebug ("formatTimeStamp (" + stamp + ")");

		var s="";
		var year= stamp.getUTCFullYear();
		s += year+"-";

		var month=stamp.getUTCMonth();
		month++;
		s += ((month<10) ? ("0"+month) : month)+"-";

		var date = stamp.getUTCDate();
		s += ((date<10) ? ("0"+date) : date)+" ";

		var hours = stamp.getUTCHours();
		s += ((hours<10) ? ("0"+hours) : hours)+":";

		var mins = stamp.getUTCMinutes();
		s += ((mins<10) ? ("0"+mins) : mins)+":";

		var secs = stamp.getUTCSeconds();
		s += ((secs<10) ? ("0"+secs) : secs);

		var msec = stamp.getUTCMilliseconds ();
		s+=".";
		s+=msec;

		//s+=" UTC";

		return s;
	}

	/**
	 * Formats Date objects into Datashop's prefered format.
	 * @param	stamp	A Date object.
	 * @return	A String in the proper format
	 *
	 * http://www.w3schools.com/jsref/jsref_obj_date.asp
	 */
	formatTimeStampOLI (stamp) {
		this.ctatdebug ("formatTimeStampOLI (" + stamp + ")");

		var s="";
		var year= stamp.getUTCFullYear();
		s += year+"/";

		var month=stamp.getUTCMonth();
		month++;
		s += ((month<10) ? ("0"+month) : month)+"/";

		var date = stamp.getUTCDate();
		s += ((date<10) ? ("0"+date) : date)+" ";

		var hours = stamp.getUTCHours();
		s += ((hours<10) ? ("0"+hours) : hours)+":";

		var mins = stamp.getUTCMinutes();
		s += ((mins<10) ? ("0"+mins) : mins)+":";

		var secs = stamp.getUTCSeconds();
		s += ((secs<10) ? ("0"+secs) : secs);

		var msec = stamp.getUTCMilliseconds ();
		s+=".";
		s+=msec;

		return s;
	}

	resetCustomFields () {
		this.ctatdebug ("resetCustomFields ()");

		this.customFieldNames=new Array ();
		this.customFieldValues=new Array ();
	}

	/**
	 *
	 * @param customFieldNames
	 * @param customFieldValues
	 * @returns {String}
	 */
	createCustomFields (aCustomFieldNames,aCustomFieldValues) {
		this.ctatdebug ("createCustomFields ()");

		if ((aCustomFieldNames==null) || (aCustomFieldValues==null)) {
			this.ctatdebug ("No custom fields provided");
			return ("");
		}

		this.ctatdebug ("Processing " + aCustomFieldNames.length + " custom fields ...");

		var message='';

		for (var dex=0; dex < aCustomFieldNames.length; dex++) {
			this.ctatdebug ("Adding custom field: ["+aCustomFieldNames[dex]+"],["+aCustomFieldValues[dex]+"]");

			message += '<custom_field>';
			message += '<name>' + aCustomFieldNames[dex] + '</name>';
			message += '<value>' + aCustomFieldValues[dex] + '</value>';
			message += '</custom_field>';
		}

		return message;
	}

	/**
	 *
	 */
	addCustomFields (aCustomFieldNames, aCustomFieldValues) {
		this.ctatdebug ("addCustomFields ()");

		if (aCustomFieldNames==undefined) {
			return;
		}

		for (var i=0;i<aCustomFieldNames.length;i++) {
			this.customFieldNames.push (aCustomFieldNames [i]);
			this.customFieldValues.push (aCustomFieldValues [i]);
		}
	}

	/**
	 *
	 */
	addCustomfield (aName,aValue) {
		this.ctatdebug ("addCustomfield ("+aName+","+aValue+")");

		this.customFieldNames.push (aName);
		this.customFieldValues.push (aValue);
	}

	/**
	 *
	 */
	getCustomFieldNames () {
		return (this.customFieldNames);
	}

	/**
	 *
	 */
	getCustomFieldValues () {
		return (this.customFieldValues);
	}
}
