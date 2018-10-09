
import CTATLoggingLibrary from '../src/loglibrary/ctat-logginglibrary.js';

/**
 *
 */
export default function() { 
  
  var loggingLibrary = new CTATLoggingLibrary (false);

  loggingLibrary.setDatasetName("DataShop Unit Test");
  loggingLibrary.setDatasetLevelName ("level1");
  loggingLibrary.setDatasetLevelType ("type1");
  loggingLibrary.setSchool ("Carnegie Mellon University");
  loggingLibrary.setPeriod ("1st");
  loggingLibrary.setDescription ("DataShop logger unit test");
  loggingLibrary.setInstructor ("Norman Bier");
  loggingLibrary.setProblemName ("problem1");
  loggingLibrary.setProblemContext ("Unit Test");
  loggingLibrary.setUserID ("anonymous");
  loggingLibrary.setLoggingURLQA ();

/*
  CTATConfiguration.set("dataset_level_name1", "Unit1.0");
  CTATConfiguration.set("dataset_level_type1", "unit");
  CTATConfiguration.set("dataset_level_name2", "Section1.0");
  CTATConfiguration.set("dataset_level_type2", "section");  
*/

  return (true);
}
