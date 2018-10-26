
import CTATLoggingLibrary from '../src/loglibrary/ctat-logginglibrary.js';
import CTATGuid from '../src/tools/ctat-guid.js'

/**
 *
 */
export default function() { 

  var loggingLibrary = new CTATLoggingLibrary (false);
  var guidGenerator=new CTATGuid ();

  loggingLibrary.setLogFormat ("XAPI"); 
  loggingLibrary.setLoggingURL ("http://localhost:9092"); // Kafka port

  loggingLibrary.setDatasetName("DataShop Unit Test");
  loggingLibrary.setDatasetLevelName ("Unit1.0");
  loggingLibrary.setDatasetLevelType ("Unit");
  loggingLibrary.setSchool ("Carnegie Mellon University");
  loggingLibrary.setPeriod ("1");
  loggingLibrary.setDescription ("DataShop logger unit test");
  loggingLibrary.setInstructor ("Norman Bier");
  loggingLibrary.setProblemName ("problem1");
  loggingLibrary.setProblemContext ("Unit Test");
  loggingLibrary.setContextName (guidGenerator.guid ());
  loggingLibrary.setUserID ("nbier");

  loggingLibrary.startProblem ();

  var transactionID=loggingLibrary.logInterfaceAttempt ("textinput1","UpdateTextField","Hello World");

  loggingLibrary.logResponse (transactionID,"textinput1","UpdateTextField","Hello World","RESULT","CORRECT","You got it!");
 
  return (true);
}
