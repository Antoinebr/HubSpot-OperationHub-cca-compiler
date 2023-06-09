require('dotenv').config();
const utils = require('./utils.js');



// takes the file name from the CLI args
process.argv.splice(0, 2);

let [fileName = false] = process.argv;


if (!fileName) throw new error('Missing fileName URL ! Provide the fileName as a first Command Line Interface argument');

const eventFile = fileName.replace('/cca.js', '/event.js');

let event = null;

try {
    event = require(eventFile).events;
} catch (error) {
    throw new Error(`Looks like the event file is missing, we failed to call ${eventFile}`);
}


if (!event.inputFields) throw new Error('event.inputFields Has to be defined');



const cca = require(fileName);

cca.main(event, output => {

    console.log('\n', 'The output of the Custom Coded Action is : ')
    console.table(output.outputFields);

    console.log('\n', 'The types are : ')
    console.table(utils.getKeyValueTypes(output.outputFields));
});