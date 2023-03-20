const firstnames = require('./firstnames.js');

exports.main = async (event, callback) => {

    let firstName = event.inputFields.firstName;

    if (!firstName) throw new Error('firstName is not set, are you sure you put firstName in the "properties to include in code" ? ');
    const result = (firstnames[firstName]) ? firstnames[firstName] : false;


    const email = event.inputFields.email;
    if (!email) throw new Error('email is not set, are you sure you put email in the "properties to include in code" ? ');

    const emailWithoutDomain = email.split('@')[0];

    const chunks = splitString(emailWithoutDomain).map(chunk => capitalizeString(chunk));

    const firstNameFound = [];

    for (const chunk of chunks) {

        if (firstnames[chunk]) {
            firstNameFound.push(chunk);
        }
    }

    callback({
        outputFields: {
            gender: result ? result.gender : "N/A",
            firstName: firstNameFound.length > -1 ? firstNameFound[0] : "N/A"
        }
    });

}


/**
 * Splits a string into an array of parts based on delimiters such as commas, dashes, underscores, dots, and forward slashes.
 *
 * @param {string} str - The string to be split.
 * @returns {array} - An array of the split string parts.
 */
const splitString = (str) => {
    return str.split(/[\s,\\-_./]+/);
}

exports.splitString = splitString;


/**
 * Capitalizes the first character of a string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
const capitalizeString = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalizeString = capitalizeString;