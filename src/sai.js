/**
 *
 */
export default class SAI {
    
    /**
     * 
     */
    constructor (aSelection,anAction,anInput) {
      this.selectionArray=[];
      this.actionArray=[];
      this.inputArray=[];

      this.selectionArray[0]=aSelection;
      this.actionArray[0]=anAction;
      this.inputArray[0]=anInput;      
    }

    /**
    *
    */
    toXMLString() {
        var formatter="";

        for (var i=0;i<this.selectionArray.length;i++) {
            var tempSelection=this.selectionArray [i];
            formatter+=("<selection>"+tempSelection+"</selection>");
        }

        formatter+="<action>"+this.actionArray[0];

        for (var j=1;j<this.actionArray.length;j++) {
            formatter+="</action><action>"+this.actionArray[j];
        }

        formatter+="</action>";

        for (var k=0;k<this.inputArray.length;k++) {
            var arg=this.inputArray [k];

            formatter+="<input><![CDATA["+arg+"]]></input>";
        }

        return (formatter);
    }
}