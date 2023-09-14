
const GoogleSpreadsheet = require('google-spreadsheet');



const { JWT } = require('google-auth-library');

const creds = require('./key.json'); // the file saved above

exports.main = async (event, callback) => {

    
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ];
  
  const jwt = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });


  const doc = new GoogleSpreadsheet.GoogleSpreadsheet('1HdBKHz0PYrtZyt2HRcEnL7xOzd-xADWeR_sVwZpz8zk', jwt);



  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);
  //await doc.updateProperties({ title: 'Golf Bag - 2023' }).catch(console.log)


  

    callback({
        outputFields: {
            tile: doc.title
        }
    });

}
