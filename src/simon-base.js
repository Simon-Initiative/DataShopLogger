
var useDebugging=false;
var useDebuggingBasic=true;

/**
 *
 */
export default class SimonBase {
	
	/**
	 * 
	 */
	constructor (aClassName, aName) {
	  this.className=aClassName;
	  this.name=aName;
	}

	getClassName () {
    return (this.className);
	}

	// A lot of people accidentally use the function above with a lowercase N. Hence
	// this backup
	getClassname () {
    return (this.className);
	}

	setClassName(aClass) {
    this.className=aClass;
	}

  setName (sName) {
	  this.name=sName;
	}

	getName () {
    return (this.name);
	}

	getUseDebugging() {
    return (this.useDebugging);
	}

  setUseDebugging(aValue) {
	  useDebugging=aValue;
	}

	/**
	 *
	 */
	toHHMMSS (aValue) {
	  var sec_num = parseInt(aValue, 10); // don't forget the second param
	  var hours   = Math.floor(sec_num / 3600);
	  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	  var seconds = sec_num - (hours * 3600) - (minutes * 60);

	  if (hours   < 10) {hours   = "0"+hours;}
	  if (minutes < 10) {minutes = "0"+minutes;}
	  if (seconds < 10) {seconds = "0"+seconds;}
	  
	  return hours+':'+minutes+':'+seconds;
	}

	/**
	*
	*/
	simondebug (msg) {
	  if(!useDebugging) {
      //console.log ("Logging disabled!");
		  return;
   	}

	  var aMessage=msg;

	  if (useDebuggingBasic) {
      this.simondebugInternal (aMessage,"UnknownClass");
		  return;
    }

    if (msg===null) {
      aMessage="No message provided";
    }
		
	  this.simondebugInternal (aMessage,this.getClassName());
	}

  /**
  *
  */
  ctatdebug (msg) {
    this.simondebug (msg);
  }  

	/**
	*
	*/
	debugObject (object) {
	  //var output='';
	  var index=0;

	  for (var property in object) {
	    //output += property + ': ' + object[property]+'; \n ';
		  this.simondebug ("("+index+")" + property + ': ' + object[property]);

		  index++;
	  }
	}

	/**
	*
	*/
	simondebugInternal (msg,sClassName) {

    if(!useDebugging) {
      //console.log ("Logging disabled!");
      return;
    }

	  var aMessage=msg;
	  var txt="No msg assigned yet";

	  if (aMessage===null || aMessage===undefined) {
      aMessage="No message!";
    }

    if (aMessage==="") {
	    aMessage="Empty message!";
	  }

	  if (sClassName===null) {
      sClassName="UndefinedClass";
    }

    if (this.className=!null) {
      sClassName=this.className;
    }

    if (aMessage===null) {
      aMessage="No message";
    }

    txt=this.formatLogMessage (sClassName,this.getName (),aMessage);

    
    console.log (txt);
	}

	/**
	*
	*/
	simondebugObjectShallow (object) {
      var output = '';

      for (var property in object) {
	    output += property + ', ';
      }

	  this.simondebugInternal ("Object: " + output,"Global");
	}

	/**
	*
	*/
	urldecode(str) {
	  return decodeURIComponent((str+'').replace(/\+/g, '%20'));
	}

	/**
	*
	*/
	entitiesConvert (str) {
	  this.simondebug ("entitiesConvert ()");

	  return (this.urldecode (unescape (str)));
 	}

 	/**
	*
	*/
	entitiesGenerate (str) {
      var temper=str;

	  return (temper);
 	}

	/**
	*
	*/
	formatLogMessage (aClass,anInstance,aMessage) {
      //var now = new Date();

      if (aClass===null) {
        aClass="unknownclass";
      }

      if (anInstance===null) {
        anInstance="nullinstance";
      }

      //var formatted=this.htmlEncode (aMessage);
      var formatted=aMessage;

      //var txt="["+now.format("hh:MM:ss")+"] ["+aClass+":"+anInstance+"] "+formatted;
      var txt="["+aClass+":"+anInstance+"] "+formatted;

      return (txt);
	}
}
