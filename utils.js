/**
 * @name getKeyValueTypes
 * @description This function takes an object as parameter and returns an object with the keys and their types.
 * @param {Object} obj The object for which we want to get the keys and their types.
 * @return {Object} An object with the keys and their types.
 */
exports.getKeyValueTypes = (obj) => {
    const keyValueTypes = {};
    Object.keys(obj).forEach(key => {
        keyValueTypes[key] = typeof obj[key];
    });
    return keyValueTypes;
}
