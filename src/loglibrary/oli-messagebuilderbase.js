import SimonBase from '../simon-base.js';
import LogConfiguration from '../logconfiguration.js';

/**
 * 
 */
export default class OLIMessageBuilderBase extends SimonBase {

  /**
  *
  */
  constructor (aClassname, anInstancename, aConfiguration) {
    super (aClassname,anInstancename);

    this.logConfiguration=aConfiguration;

    this.customFieldNames=[];
    this.customFieldValues=[];

    this.contextGUID = "bingo";

    this.messageFormat="TEXT";
  }

  /**
   * <b>[Required]</b> The &#60;name&#62; attribute of the current context.
   * <p>The name attribute is used to indicate where the student is in the process of working on a tutor or problem.
   * The PSLC DataShop team has established some canonical values for this attribute that should be used,
   * displayed in <a href="http://pslcdatashop.web.cmu.edu/dtd/guide/context_message.html#table.context_message.name.values">Table 1, Recommended values for the &#60;context_message&#62; name attribute</a>.</p>
   * @param context_name  A name for the current context, see table for a set  of recommended names.
   */
  setContextName(aName) {
    this.contextGUID = aName;
  }

  /**
  *
  */
  getContextName() {
    return this.contextGUID;
  }  

  /**
   *
   */
  setMessageFormat (aFormat) {
    this.messageFormat=aFormat;
  }

  /**
   *
   */
  getMessageFormat () {
    return (this.messageFormat);
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
   * Pad leading zeros to nonnegative n to generate len digits.
   * @param {integer} n nonnegative number to format
   * @param {integer} len minimum output length
   * @return {string} n with enough leading zeros to reach length len
   */
  lz(n, len) { // 
    let result="", nz=(n>0 ? len-Math.floor(Math.log10(n)) : len);
    while(--nz > 0) result+="0";
    return result+String(n);
  }

  /**
   * Format Date d to "yyyy-mm-dd HH:MM:SS.sss UTC". Uses lz().
   * @param {Date} d Date object to format
   * @return {string} string of the form above
   */
  formatDate(d) {
    return(
      lz(d.getUTCFullYear(), 4)+"-"+
      lz(d.getUTCMonth()+1, 2)+"-"+  // UTC month is 0-based
      lz(d.getUTCDate(), 2)+" "+
      lz(d.getUTCHours(), 2)+":"+
      lz(d.getUTCMinutes(), 2)+":"+
      lz(d.getUTCSeconds(), 2)+"."+
      lz(d.getUTCMilliseconds(), 3)+" "+
      "UTC"
    );
  }

  /**
   * Formats Date objects into Datashop's prefered format.
   * @param stamp A Date object.
   * @return  A String in the proper format
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
    s+=(msec<10?"00":(msec<100?"0":""))+msec;

    //s+=" UTC";

    return s;
  }

  /**
   * Formats Date objects into Datashop's prefered format.
   * @param stamp A Date object.
   * @return  A String in the proper format
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

  /**
  *
  */
  resetCustomFields () {
    this.ctatdebug ("resetCustomFields ()");

    this.customFieldNames=new Array ();
    this.customFieldValues=new Array ();
  }

  /**
   * Set custom fields. First argument can be:<ul>
   *   <li>an object, to add a custom field for each property {name: value}, or</li>
   *   <li>an array of custom field names, which implies 2nd argument is a 1:1 array of values</li>
   * </ul>
   * @param {Object} or [<string>] aCustomFieldNames
   * @param [<string>] <optional/> aCustomFieldValues
   */
  addCustomFields (aCustomFieldNames,aCustomFieldValues) {
    this.ctatdebug ("addCustomFields ()");

    if (!aCustomFieldNames) {
      return;
    }

    if(Array.isArray(aCustomFieldNames)) {
      if(!aCustomFieldValues || !Array.isArray(aCustomFieldValues)) {
        return;
      }
      for (var i=0;i<aCustomFieldNames.length;i++) {
        this.customFieldNames.push (aCustomFieldNames [i]);
        this.customFieldValues.push (aCustomFieldValues [i]);
      }
    } else {  // assume aCustomFieldNames is an object: add each property {name: value}
      for(let k in aCustomFieldNames) {
        this.addCustomField(k, aCustomFieldNames[k]);
      }
    }
  }

  /**
   *
   */
  addCustomField (aName,aValue) {
    this.ctatdebug ("addCustomfield ("+aName+","+aValue+")");

    this.customFieldNames.push (aName);
    this.customFieldValues.push (aValue);
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
