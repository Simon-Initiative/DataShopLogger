
import SimonBase from '../simon-base.js';
import OLIMessageBuilderBase from './oli-messagebuilderbase.js';

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
export default class CTATLogMessageBuilder extends OLIMessageBuilderBase {

  /**
  *
  */
	constructor (aConfiguration) {
		super ("CTATLogMessageBuilder","logmessagebuilder", aConfiguration);

		// Blanked this out to kill a bug that generated extra XML headers. Used to be = '<?xml version="1.0" encoding="UTF-8"?>'
		this.xmlHeader = '';

		/**
		 * The standard XMLProlog, we actually reference this a lot.
		 */
		this.xmlProlog = '<?xml version="1.0" encoding="UTF-8"?>';

		this.setMessageFormat ("XML");
  }

	/**
	*	Builds a context message to the Data Shop specifications.
	*	@see http://pslcdatashop.web.cmu.edu/dtd/guide/context_message.html
	*	DataShop specification for context_message
	* 	Sample translation between dataset logConfiguration parameters
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
		this.ctatdebug("createContextMessage("+this.getContextName()+")");

		var now=new Date();

		var vars=this.logConfiguration;

		var messageString=this.xmlHeader+'<context_message context_message_id="'+this.getContextName()+'" name="START_PROBLEM">';

		if(!aWrapForOLI) {
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

	    var dataset = '<dataset>';
	    dataset += '<name><![CDATA['+vars ['dataset_name']+']]></name>';

	    var datasetLevelTypes=[];
	    var datasetLevelNames=[];
	    for(let p in vars) {
		let match=null;
		if(match=/dataset_level_type([0-9]+)/i.exec(p)) {
		    datasetLevelTypes[match[1]]=vars[p];
		}
		if(match=/dataset_level_name([0-9]+)/i.exec(p)) {
		    datasetLevelNames[match[1]]=vars[p];
		}
	    }
	    let nLevels=0;
	    datasetLevelNames.forEach(
		(name, i) => {
		    if(name) {
			let type=datasetLevelTypes[i] || "level"+i;
			dataset += '<level type="'+type+'"><name><![CDATA['+name+']]></name>';
			nLevels++;
		    }
		}
	    );

	    dataset += '<problem';
	    if (vars ["problem_tutorflag"]!=undefined) {
		dataset+=' tutorFlag="' + vars ["problem_tutorflag"]+'"';
	    } else if (vars ["problem_otherproblemflag"]!=undefined) {
		dataset+=' tutorFlag="' + vars ["problem_otherproblemflag"]+'"';
	    }
	    dataset += '><name><![CDATA['+vars ['problem_name']+']]></name>';

	    if (vars ['problem_context']!=undefined) {
		dataset += '<context><![CDATA[' + vars ['problem_context'] + ']]></context>';
	    } else {
		dataset += '<context />';
	    }
	    dataset += '</problem>';

	    for (var l=0;l<nLevels;l++) {
		dataset += '</level>';
	    }
	    dataset += '</dataset>';
	    messageString += dataset;

		//}

		//>---------------------------------------------------------------------
		//<condition>

		//if (vars ['DeliverUsingOLI']=='false')
		//{
			var condition="";

      /* 
			var conditionNames = logConfiguration.getConditionNames();
			var conditionTypes = logConfiguration.getConditionTypes();
			var conditionDescriptions = logConfiguration.getConditionDescriptions();
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
		//var cFields=logConfiguration.getCustomFields ();

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
		var vars=this.logConfiguration;
		var messageString=this.xmlHeader+'<tool_message context_message_id="'+this.getContextName()+'">';

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
		var loggedSAI=sai.toXMLString();
		//this.ctatdebug ("Logged SAI (B): " + loggedSAI);
		eventDescriptor+=loggedSAI;
		eventDescriptor+='</event_descriptor>';
		messageString+=eventDescriptor;

		messageString+=this.createCustomFields (this.customFieldNames,this.customFieldValues);

		messageString += '</tool_message>';

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
		var vars=this.logConfiguration;
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
		var vars=this.logConfiguration;
		var messageString = this.xmlHeader+'<tutor_message context_message_id="'+this.getContextName()+'">';

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
		eventDescriptor+=sai.toXMLString();
		eventDescriptor+='</event_descriptor>';
		messageString+=eventDescriptor;

		//<action_evaluation> (0+)
		var actionEvaluation = '<action_evaluation ';
	    	actionEvaluation += evalObj.getAttributeString();
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

		messageString+=this.createCustomFields (this.customFieldNames,this.customFieldValues);

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

		var vars=this.logConfiguration;

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
	 * https://pslcdatashop.web.cmu.edu/help?page=importFormatTd#note-2
	 */
	makeMetaElement (timeStamp) {
		this.ctatdebug ("makeMetaElement ()");

		var meta='<meta>';
		meta += '<user_id>'+this.logConfiguration['user_guid']+'</user_id>';
		meta += '<session_id>'+this.logConfiguration['session_id']+'</session_id>';
		meta += '<time>'+this.formatTimeStamp(timeStamp)+'</time>';
		meta += '<time_zone>'+this.getTimeZone ()+'</time_zone>';
		meta += '</meta>';

		return meta;
	}

    /**
     *
     */
    wrapForOLI (messageString, useVars) {
	this.ctatdebug ("wrapForOLI ()");

	var now=new Date();
	var vars=useVars || {user_guid: "", source_id: "", session_id: ""};

	messageString = encodeURIComponent(messageString);

	var wrapper = this.xmlProlog + '<log_action ';
	wrapper += 'auth_token="'+encodeURIComponent(vars ['auth_token'])+'" ';
	wrapper += 'session_id="' + vars ['session_id'] + '" ';
	wrapper += 'action_id="' + "EVALUATE_QUESTION" + '" ';
	wrapper += 'user_guid="" ';  // leave blank if not log_session_start
	wrapper += 'date_time="' + this.formatTimeStampOLI(now) + '" ';
	wrapper += 'timezone="' + this.getTimeZone () + '" ';
	wrapper += 'source_id="' + vars ['source_id'] + '" ';
	wrapper += 'external_object_id="'+(vars ['activity_context_guid'] || "") + '" ';
	wrapper += 'info_type="tutor_message.dtd">';
	messageString = wrapper + messageString + "</log_action>";

	return messageString;
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

		message += 'date_time="'+this.formatTimeStampOLI(now) + '" ';
		message += 'auth_token="' + aVarset['auth_token'] + '" ';
		message += 'session_id="' + aVarset['session_id'] + '" ';
		message += 'user_guid="' + aVarset['user_guid'] + '" ';
		message += 'class_id="" treatment_id="" assignment_id="" info_type="tutor_message.dtd"/>';

		return message;
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
}
