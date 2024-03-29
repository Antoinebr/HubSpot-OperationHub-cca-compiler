const util = require('util');
const exec = util.promisify(require('child_process').exec);

// takes the file name from the CLI args
process.argv.splice(0, 2);

let [folderName = false] = process.argv;


if (!folderName) throw new error('Missing folder Name ! Provide the folderName as a first Command Line Interface argument');

(async () => {


    const { stdout, stderr } = await exec(`npx ncc build ./${folderName}/cca.js -o ./${folderName}/dist -m `);

    console.log(stdout)

    return stdout;

})(); 




