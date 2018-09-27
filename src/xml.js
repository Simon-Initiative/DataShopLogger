/**
 * 
 */

import $ from 'jquery';
import SimonBase from './simon-base.js';

/**
 *
 */
export default class CTATXML extends SimonBase {

  /**
   *
   */
  constructor () {
    super ();
    
	  this.xmlDoc=null;
  }	
	
  /**
   *
   */
  parse (aMessage) {
    return (this.parseXML (aMessage));
  }

  /**
   *
   */
  parseXML (aMessage) {
    this.olidebug ("parseXML ()");

    try {
      if(typeof($)!=='undefined') {
        //this.olidebug ("Parse in a JQuery environment ...");
        this.xmlDoc = $.parseXML(aMessage);
      } else if(typeof(XMLParser)!=='undefined') {
        //this.olidebug ("Parse in a NodeJS environment ...");
        this.xmlDoc = new XMLParser().parseFromString(aMessage);
      } else {
        this.olidebug ("Bottoming out, no parser configured!");
      }
    } catch (err) {
      //console.log("error - > "+err);

      if (this.xmlDoc!=null) {
        this.olidebug ("JQuery could not process the provided XML: " + err.message + " ("+this.xmlDoc.parseError.errorCode+") ("+this.xmlDoc.parseError.reason + ") (" + this.xmlDoc.parseError.line + ")");
      } else {
        this.olidebug ("JQuery could not process the provided XML (this.xmlDoc==null): " + err.message);
      }

      return (null);
    }

    // this.olidebug ("Parsing complete, checking and converting ...");
 
    if (this.xmlDoc==null) {
      this.olidebug ("Unspecified error parsing xml message. this.xmlDoc is null");

      return (null);
    }

    //this.olidebug ("parseXML () done");
    return (this.xmlDoc.documentElement);
  }
  
  /**
   *
   */
  getElementName (anElement) {
   return (anElement.nodeName);
  }
	
  /**
   *
   */
  getElementValue (anElement) {
    return (anElement.nodeValue);
  }
  
  /**
   *
   */
  getElementChildren (anElement) {
    //Skips #text nodes (dhruv)
    var children = [];

    for (var i = 0 ; i<anElement.childNodes.length; i++) {
      if(anElement.childNodes[i].nodeType == 1) {
        children.push(anElement.childNodes[i]);
      } 
    }

    return (children);
  }
  
  /**
   * This method can handle the following cases:
   *
   * <Action>UpdateTextField</Action>
   *
   * <Action>
   *	   <value>UpdateTextField</value>
   * </Action>
   */
  getNodeTextValue (aNode) {
    //this.olidebug ("getNodeTextValue ()");

    if (aNode==null) {
      //this.olidebug ("Node argument is null");
	  return ("");
    }

    if (aNode.childNodes==null) {
      //this.olidebug ("Node does not have any children");
      return (aNode.nodeValue);
    }

    if (aNode.childNodes.length==0) {
      //this.olidebug ("Node has children size of 0");
      return ("");
    }

    //this.olidebug ("First do a check to see if it has a 'value' sub element");

    var entries=aNode.childNodes;

    for (var t=0;t<entries.length;t++) {
      var entry=entries [t];

      //console.log ("entry.nodeName: " + entry.nodeName + ", entry.childNodes.length: " + entry.childNodes.length);

      if ((entry.nodeName=="value") || (entry.nodeName=="Value")) {
        if(entry.childNodes.length==1) {
          //console.log ("Data: ("+entry.childNodes[0].nodeName+")" + entry.childNodes[0].nodeValue);

          return (entry.childNodes[0].nodeValue);
        } else {
          if(entry.childNodes.length==0) {
            //console.log ("Bottoming out? " + aNode.childNodes[0].nodeValue);

            return (aNode.childNodes[0].nodeValue);
          } else {
            //console.log ("Data: ("+entry.childNodes[1].nodeName+")" + entry.childNodes[1].nodeValue);
            return (entry.childNodes[1].nodeValue);
          }
        }
      }
    }

    //this.olidebug ("Bottoming out ...");

    return (aNode.childNodes[0].nodeValue);
  }

  /**
   *
   */
  getElementAttr(anElement, attr) {
    //return (anElement.getAttribute(attr));

    if (!anElement.attributes) {
      this.olidebug ("Warning: Element " + anElement.nodeName + " does not have any attributes");
      return ("");
    }

    //this.listElementAttr (anElement);

    for (var i=0;i<anElement.attributes.length;i++) {
      if (anElement.attributes [i].nodeName==attr) {
        return (anElement.attributes [i].nodeValue);
      }
    }

    return ("");
  }

  /**
   *
   */
  listElementAttr (anElement) {
    this.olidebug ("Listing " + anElement.attributes.length + " attributes for element " + anElement.nodeName + " ...");

    for (var i=0;i<anElement.attributes.length;i++) {
      this.olidebug (i + " name: " +  anElement.attributes [i].nodeName + ", value: " + anElement.attributes [i].nodeValue);
    }
  }
  
  /**
   * @param {object} element to print
   * @return {string} readable version of argument
   */
   stringify (anObject) {
     return this.xmlToString (anObject);
   }
   
  /**
   *
   */
  xmlToString(xmlData) {
    this.olidebug ("xmlToString ()");

    if (xmlData==null) {
      this.olidebug ("Error: xml data is null");
      return (null);
    }

    var output = (new XMLSerializer()).serializeToString(xmlData);

    return (output);
  }
}
