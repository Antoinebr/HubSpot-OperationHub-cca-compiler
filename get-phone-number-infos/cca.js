const { phone } = require('phone');

exports.main = async (event, callback) => {


    const contactPhoneNumber = event.inputFields.phoneNumber;

    if (!contactPhoneNumber) throw new Error('phoneNumber is not set, are you sure you put phoneNumber in the "properties to include in code" ? ');


    const phoneNumberInfos = phone(contactPhoneNumber);

    const { isValid, phoneNumber, countryIso2, countryIso3, countryCode } = phoneNumberInfos;


    callback({
        outputFields: {
            isValid,
            phoneNumber,
            countryIso2,
            countryIso3,
            countryCode
        }
    });

}