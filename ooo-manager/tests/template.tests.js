require('dotenv').config(); // to remove if the Custom Coded Action does not use the API
const assert = require('assert');
const cca = require('../cca.js');


describe('formatPhoneNumber()', () => {


    it('should run the API call without rejections',  () => {

        assert.doesNotReject(cca.getPortalInfo())

    });


});