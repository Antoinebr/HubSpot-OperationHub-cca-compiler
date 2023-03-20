require('dotenv').config(); // to remove if the Custom Coded Action does not use the API
const assert = require('assert');
const cca = require('../cca.js');



describe('split string', () => {

    it.skip('should split an email based on a dash ', () => {


        const result = cca.splitString("Peter-OBriens");

        console.log(result);
        
    })

});


describe('integration', () => {


    it('should find Antoine as a firstname and a M gender',  () => {

        const events = {
            inputFields: {
                firstName : "Antoine",
                lastName : "Brossault",
                email: "antoine.brossault@fake.com"
            }
        }

        cca.main(events,output => {

            const {gender, firstName} = output.outputFields;

            console.log(output.outputFields)

            return assert.deepEqual(output, { gender: 'M', firstName: 'Antoine' })

        })

    });



    it('should find Camille as a firstname and a ?F gender', async () => {

        const events = {
            inputFields: {
                firstName: "Camille",
                lastName: "Rukloko",
                email: "Camille.Rukloko@fake.com"
            }
        }


        await cca.main(events, output => {

            const { gender, firstName } = output.outputFields;

            console.log( { gender, firstName })

            output = output.outputFields;

            return assert.deepEqual(output, { gender: '?F', firstName: 'Camille' })

        });


    });

    it('should find Peter as a firstname and a M gender', async () => {

        const events = {
            inputFields: {
                firstName: "Peter",
                lastName: "Obriens",
                email: "Peter-OBriens@fake.com"
            }
        }


        await cca.main(events, output => {

            const { gender, firstName } = output.outputFields;

            console.log( { gender, firstName })

            output = output.outputFields;

            return assert.deepEqual(output, { gender: 'M', firstName: 'Peter' })

        });


    });


});