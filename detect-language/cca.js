const LanguageDetect = require('languagedetect');

exports.main = async (event, callback) => {


    const textToAnalyze = event.inputFields.textToAnalyze;

    if (!textToAnalyze) throw new Error('textToAnalyze is not set, are you sure you put textToAnalyze in the "properties to include in code" ? ');


    const lngDetector = new LanguageDetect();

    const languageFound = lngDetector.detect(textToAnalyze,2);

    if(languageFound.length === 0) throw new Error('We failed to indentify the language');
    
    const [language, confidance]= languageFound[0];

    if(!language) throw new Error('Error when identifing the language');

    if(!confidance) throw new Error('Error when identifing the language no confidance data');


    callback({
        outputFields: {
            language,
            confidance
        }
    });

}