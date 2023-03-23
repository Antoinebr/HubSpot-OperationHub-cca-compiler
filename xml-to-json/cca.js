const convert = require('xml-js');

exports.main = async (event, callback) => {


    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<TestScenario>
   <TestSuite name="TS_EdgeHome">
      <TestCaseName name="tc_Login">dt_EdgeCaseHome,dt_EdgeCaseRoute</TestCaseName>
      <TestCaseName name="tc_Logout">dt_EdgeCaseRoute</TestCaseName>
   </TestSuite>
   <TestSuite name="TS_EdgePanel">
      <TestCaseName name="tc_AddContract">dt_EdgeCaseHome,dt_EdgeCaseSpectrum</TestCaseName>
   </TestSuite>
      <TestSuite name="TS_EdgeRoute">
      <TestCaseName name="tc_VerifyContract">dt_EdgeCaseRoute</TestCaseName>
      <TestCaseName name="tc_Payment">dt_EdgeCaseRoute</TestCaseName>
   </TestSuite>
   <TestSuite name="TS_EdgeSpectrum">
      <TestCaseName name="tc_ClientFeedback">dt_EdgeCaseSpectrum</TestCaseName>
   </TestSuite>
</TestScenario>`;

    var result = convert.xml2json(xmlString, { compact: true, spaces: 4 });

    console.log(result)

    callback({
        outputFields: {

        }
    });

}