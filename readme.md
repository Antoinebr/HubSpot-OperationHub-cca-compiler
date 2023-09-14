# HubSpot OperationsHub Custom Coded Action compiler


The idea of this is to provides a "framework" to work locally on your Custom Coded Action and execute it in the same context as HubSpot. 

You can write your Custom Coded Action locally, as I mocked the specific functions and limitations that exist with Operations Hub pro.


**This project allows use the librairies you want even if they are not supported by HubSpot** [list of allowed librairies here](https://developers.hubspot.com/docs/api/workflows/custom-code-actions#:~:text=Node.js%20supported%20libraries)



## Use case example

Let's say you want to create a Custom Coded Action to detect if a phone number is correctly formated. The first option is to write the logic yourself, but this is quite inneficient. A better approach would be to look for an open source module online. Unfortunately with the Custom Coded Actions you can't import any library, as you can't just run "npm installs". 
This project offers a solution to this issue, you can install the librairies you want locally, and the project will put everything in one file that will work in HubSpot. 

## How to use

Clone the project and install the dependencies by running : 

```
npm install 
```

Then create a .env file at the root of the project with your privateAppToken 

```
privateAppToken = "sdfsd-dsfsdf-wwxcwx-ffdsdfdsf-fsdffdsfs"
```

Side note : you can name your private app Token the way you want, but you will have to adapt the variable name in your Custom Coded Action. 

### Create a new project 


You have to initialize a new project by calling, this will create a new folder. 

```
npm run init <nameOfYourProject>
```

Like :

```
npm run init my-new-custom-coded-action
```

The template created contains a file named cca.js, this is where you write your code. 



```JavaScript 
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

```

The event.js file represent the properties you can include in code. 


```JavaScript
exports.events = {
    // object: {
    //     objectId: 3401
    // },
    inputFields: {
        phoneNumber : "0698432387",
        countryCode: "FR"
    }
}
```

In this example to access phoneNumber, you have to use : 

```JavaScript
 const domainName = event.inputFields.phoneNumber;
```

Then execute the code by calling : 

```bash
node run.js ./name-of-the-folder/file-name.js 
```

or 

```bash
npm run cca ./get-siret-from-domain-name/cca.js
```

## node modules 

You can install the node modules you want by doing something like : 

``` 
npm install @sturdynut/i18n-phone-formatter
```

And in your code : 

```
const format = require('@sturdynut/i18n-phone-formatter');
```

And build the project by running 

```
npm run build name-of-the-folder
```

This will create a ```dist/``` folder inside your project


## How to deploy ?

Unfortunately there's no automated deployement, so copy and paste the ```dist/index.js``` content in the  Custom Coded Action block. 