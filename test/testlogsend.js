
import CTATLoggingLibrary from '../src/loglibrary/ctat-logginglibrary.js';

/**
 *
 */
export default function() { 
  
  var loggingLibrary = new CTATLoggingLibrary (false);


  loggingLibrary.setDatasetName("DataShop Unit Test");
  loggingLibrary.setdDtasetLevelName ("level1");
  loggingLibrary.setDatasetLevelType ("type1");
  loggingLibrary.setSchool ("Carnegie Mellon University");
  loggingLibrary.setPeriod ("1st");
  loggingLibrary.setDescription ("DataShop logger unit test");
  loggingLibrary.setInstructor ("Norman Bier");
  loggingLibrary.setProblemName ("problem1");
  loggingLibrary.setProblemContext ("Unit Test");
  loggingLibrary.setUserID ("anonymous");
  loggingLibrary.setLoggingURLQA ();

  loggingLibrary.startProblem ();

  return (true);
}
