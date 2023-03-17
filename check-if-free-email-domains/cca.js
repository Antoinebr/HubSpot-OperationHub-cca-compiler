const freeEmailDomains = require('free-email-domains')



exports.main = async (event, callback) => {

    
    const email = event.inputFields.email;

    if (!email) throw new Error('email is not set, are you sure you put email in the "properties to include in code" ? ');


    const emailDomain = email.split('@')[1];
    const isFreeEmail = freeEmailDomains.includes(emailDomain); 


    callback({
        outputFields: {
            isFreeEmail,
            email
        }
    });

}
