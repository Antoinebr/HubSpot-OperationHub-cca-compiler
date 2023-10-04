const format = require('@sturdynut/i18n-phone-formatter');

exports.main = async (event, callback) => {

    
    const phoneNumber = event.inputFields.phoneNumber;

    if (!phoneNumber) throw new Error('phoneNumber is not set, are you sure you put phoneNumber in the "properties to include in code" ? ');


    const countryCode = event.inputFields.countryCode;

    if (!countryCode) throw new Error('countryCode is not set, are you sure you put country in the "properties to include in code" ? ');

    
    const formatedNumberFR = format.formatE164(countryCode, phoneNumber); // +14155552671


    callback({
        outputFields: {
            formatedNumberFR
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
