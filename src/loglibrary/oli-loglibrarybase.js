
//import $ from 'jquery';
import SimonBase from '../simon-base.js';

/**
 * 
 */
export default class OLILogLibraryBase extends SimonBase {

  /**
   *
   */
	constructor (aClass,aName) {
	  super (aClass,aName);

		this.pointer=this;
		this.customFieldNames=[];
		this.customFieldValues=[];
  }

	/**
	 * <b>[Required]</b> The &#60;name&#62; attribute of the current context.
	 * <p>The name attribute is used to indicate where the student is in the process of working on a tutor or problem.
	 * The PSLC DataShop team has established some canonical values for this attribute that should be used,
	 * displayed in <a href="http://pslcdatashop.web.cmu.edu/dtd/guide/context_message.html#table.context_message.name.values">Table 1, Recommended values for the &#60;context_message&#62; name attribute</a>.</p>
	 * @param context_name A name for the current context, see table for a set of recommended names.
	 */
	setContextName(context_name) {
		CTATLogMessageBuilder.contextGUID = context_name;
	}

	/**
	*
	*/
	getContextName () {
		return CTATLogMessageBuilder.contextGUID;
	}
	
	/**
	 * Formats Date objects into Datashop's prefered format.
	 * @param	stamp	A Date object.
	 * @return	A String in the proper format
	 *
	 * http://www.w3schools.com/jsref/jsref_obj_date.asp
	 */
	formatTimeStamp (stamp) {
		pointer.ctatdebug ("formatTimeStamp (" + stamp + ")");

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
		pointer.ctatdebug ("formatTimeStampOLI (" + stamp + ")");

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

  /**
  *
  */
	resetCustomFields () {
		pointer.ctatdebug ("resetCustomFields ()");

		customFieldNames=new Array ();
		customFieldValues=new Array ();
	}

	/**
	 *
	 */
	addCustomFields (aCustomFieldNames,aCustomFieldValues) {
		pointer.ctatdebug ("addCustomFields ()");

		if (aCustomFieldNames==undefined) {
			return;
		}

		for (var i=0;i<aCustomFieldNames.length;i++) {
			customFieldNames.push (aCustomFieldNames [i]);
			customFieldValues.push (aCustomFieldValues [i]);
		}
	}

	/**
	 *
	 */
	addCustomfield (aName,aValue) {
		pointer.ctatdebug ("addCustomfield ("+aName+","+aValue+")");

		customFieldNames.push (aName);
		customFieldValues.push (aValue);
	}

	/**
	 *
	 */
	getCustomFieldNames () {
		return (customFieldNames);
	}

	/**
	 *
	 */
	getCustomFieldValues () {
		return (customFieldValues);
	}
}

/*
CTATLogMessageBuilder.contextGUID = "";
CTATLogMessageBuilder.commLogMessageBuilder = null;
*/