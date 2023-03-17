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
