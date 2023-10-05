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




/**
 * Handles errors thrown by axios requests and logs relevant information.
 *
 * @param {Error} error - The error object thrown by axios.
 */
/**
 * Handles errors thrown by axios requests and logs relevant information.
 *
 * @param {Error} error - The error object thrown by axios.
 */
const axiosErrorHandler = error => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser 
        // and an instance of http.ClientRequest in node.js
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
}