
import CTATLoggingLibrary from '../src/loglibrary/ctat-logginglibrary.js';
import CTATGuid from '../src/tools/ctat-guid.js'

/**
 *
 */
export default function() { 

  var loggingLibrary = new CTATLoggingLibrary (false);
  var guidGenerator=new CTATGuid ();

  loggingLibrary.setLogFormat ("CTAT"); // This is the default 
  loggingLibrary.setLoggingURLQA ();

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

  /*
  <?xml version="1.0" encoding="UTF-8"?>
  <log_session_start timezone="UTC" date_time="2018/10/09 12:58:33.661" auth_token="" session_id="ctat_session_04267954-44fa-41c6-8bf2-a7fc4477e2b4" user_guid="anonymous" class_id="" treatment_id="" assignment_id="" info_type="tutor_message.dtd"/>

  <?xml version="1.0" encoding="UTF-8"?>
  <context_message context_message_id="292af37d-6b9c-a7ca-e456-f85892c745b0" name="START_PROBLEM">
    <meta>
      <user_id>anonymous</user_id>
      <session_id>ctat_session_54b8cf48-3b4a-4a12-b6f0-c788f3db69ba</session_id>
      <time>2018-10-09 16:24:18.800</time>
      <time_zone>UTC</time_zone>
    </meta>
    <class>
      <name>undefined</name>
      <school>Carnegie Mellon University</school>
      <period>1</period>
      <description>DataShop logger unit test</description>
      <instructor>Norman Bier</instructor>
    </class>
    <dataset>
      <name>DataShop Unit Test</name>
      <level type="Unit">
        <name>Unit1.0</name>
        <problem>
          <name>problem1</name>
          <context>Unit Test</context>
        </problem>
      </level>
    </dataset>
  </context_message>
  */

  loggingLibrary.startProblem ();

  /*
  <?xml version="1.0" encoding="UTF-8"?>
  <tool_message context_message_id="undefined">
    <semantic_event transaction_id="81127064-c729-5846-61f7-5a1cb3c48c21" name="ATTEMPT" />
    <event_descriptor>
      <selection>textinput1</selection>
      <action>UpdateTextField</action>
      <input><![CDATA[Hello World]]></input>
    </event_descriptor>
    <custom_field>
      <name>tool_event_time</name>
      <value>2018-10-09 12:58:33.664 UTC</value>
    </custom_field>
  </tool_message>
  */

  var transactionID=loggingLibrary.logInterfaceAttempt ("textinput1","UpdateTextField","Hello World");

  /*
  <?xml version="1.0" encoding="UTF-8"?>
  <tutor_message context_message_id="undefined">
    <semantic_event transaction_id="81127064-c729-5846-61f7-5a1cb3c48c21" name="RESULT" />
    <event_descriptor>
      <selection>textinput1</selection>
      <action>UpdateTextField</action>
      <input><![CDATA[Hello World]]></input>
    </event_descriptor>
    <action_evaluation>CORRECT</action_evaluation>
    <tutor_advice><![CDATA[You got it!]]></tutor_advice>
    <custom_field>
      <name>tutor_event_time</name>
      <value>2018-10-09 12:58:33.665 UTC</value>
    </custom_field>
  </tutor_message>
  */

  loggingLibrary.logResponse (transactionID,"textinput1","UpdateTextField","Hello World","RESULT","CORRECT","You got it!");
 
  return (true);
}
