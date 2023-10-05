const axios = require('axios');

const GoogleSpreadsheet = require('google-spreadsheet');
const { JWT } = require('google-auth-library');



/*
 *
 * Edit your Secret Name here  
 */
const SECRET_NAME = "privateAppTokenServicePortalAntoine"


const SECRET_NAME_TO_USE = SECRET_NAME ? SECRET_NAME : "privateAppToken";

const axiosConfig = {
    headers: {
        authorization: `Bearer ${process.env[SECRET_NAME_TO_USE]}`
    }
};


if(!process.env[SECRET_NAME_TO_USE]) throw new Error('Your private APP token is missing... did you forget to add one ? Double check for typos too !');

if(process.env[SECRET_NAME_TO_USE] === "") throw new Error('Your private APP token is empty... did you forget to add one ?');

exports.main = async (event, callback) => {

    let backupUserAvailable = null;

    const ownerId = event.inputFields.ownerId;

    if (!ownerId) throw new Error('ownerId is not set, are you sure you put owner with ownerId as name in the "properties to include in code" ? ');

    // convert onwnerId in email address 
    const ownerInfos = await getUserDataById(ownerId).catch(axiosErrorHandler);

    if (!ownerInfos.data) throw new Error(`We failed to find the user with id ${ownerInfos}`);

    const ownerEmail = ownerInfos.data.email;

    console.log(`${ownerEmail} is the owner of this object`);

    console.log(`Checking if ${ownerEmail} is OOO`);

    const SCOPES = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
    ];


    if (event.inputFields.clientEmail === "") throw new Error('clientEmail is empty, did you add a clientEmail ?');
    if (!event.inputFields.clientEmail) throw new Error('clientEmail is not set, did you add the custom block to set the clientEmail ?');


    if (event.inputFields.privateKey === "") throw new Error('privateKey is empty, did you add a privateKey ?');
    if (!event.inputFields.privateKey) throw new Error('privateKey is not set, did you add the custom block to set the privateKey ?');


    const jwt = new JWT({
        email: event.inputFields.clientEmail,
        key: event.inputFields.privateKey,
        scopes: SCOPES,
    });


    if (!event.inputFields.sheetId) throw new Error('sheetId is not set, did you add the custom block to set the properties ?');

    if (event.inputFields.sheetId === "") throw new Error('sheetId is empty, did you add a sheet id ?');


    const sheetId = event.inputFields.sheetId;


    const doc = new GoogleSpreadsheet.GoogleSpreadsheet(sheetId, jwt);

    await doc.loadInfo(); // loads document properties and worksheets

    console.log(`The connected spreadhsheet title is ${doc.title}`);


    const sheet = doc.sheetsByTitle.ooo;

    const rows = await sheet.getRows();

    const ownerEmailWeSearch = ownerEmail;

    console.log('We are searching ', ownerEmailWeSearch);

    const { user } = findUserInSpreadSheetByEmail(rows, ownerEmailWeSearch)

    if (!user) {
        console.log(`${ownerEmailWeSearch} is not in the OOO spreadsheet`)
        return
    }

    const { oooStartDate, oooEndDate, backupIndividual, backupTeam } = user;

    const isOOO = isTheUserCurentlyOOO(oooStartDate, oooEndDate)

    if (isOOO) console.log(`${ownerEmailWeSearch} is currently OOO From ${oooStartDate} until ${oooEndDate}`);

    // We set the return value with the backup individual we found in the spreashSheet
    backupUserAvailable = backupIndividual;


    const userFound = await getUserInfosByEmail("steve_support@demospot.org").catch(axiosErrorHandler);

    if (userFound.data && userFound.data.results && userFound.data.results.length > 0) {

        const { userId } = userFound.data.results[0];

        backupUserAvailable = userId;
    }


    // If there's no backupIndividual but a team is set as a backup 
    if (isOOO && backupIndividual === "" && backupTeam !== "") {

        console.log(`The owner is OOO, and there's no backupIndividual set but a team ${backupTeam} is set as backup`);

        const teams = await getTeams().catch(axiosErrorHandler);


        if (teams.data && teams.data.results) {

            // Isolate the backup team data for the OOO individual
            const backupTeamFound = teams.data.results.filter(team => team.name === backupTeam);

            // Let's remove the OOO individual from the userId List
            const usersAvailable = [...backupTeamFound[0].userIds, ...backupTeamFound[0].secondaryUserIds].filter(userId => userId !== ownerId);

            console.log(`Users in the team : `, usersAvailable)

            // return a random user from the list 
            const randomUserId = usersAvailable[Math.floor(Math.random() * ((usersAvailable.length - 1) - 0 + 1)) + 0];

            console.log(`Random userId ${randomUserId}`);


            let isBackupUserFromTeamOOO = null;

            console.log(`Testing if ${randomUserId} is OOO too...`);

            isBackupUserFromTeamOOO = await isUserIdOOO(randomUserId, rows);

            console.log(`Random userId ${randomUserId} OOO status is ${isBackupUserFromTeamOOO}`);

            // if the backupUser in the team is not OOO than set the user as the available backup
            if (!isBackupUserFromTeamOOO) {
                backupUserAvailable = randomUserId;
            }


            while (isBackupUserFromTeamOOO === true) {

                console.log(`The backup user from the team is also OOO... looking for an other backup in the team`);

                const randomUserId = usersAvailable[Math.floor(Math.random() * ((usersAvailable.length - 1) - 0 + 1)) + 0];

                isBackupUserFromTeamOOO = await isUserIdOOO(randomUserId, rows);

                if (!isBackupUserFromTeamOOO) {
                    backupUserAvailable = randomUserId;
                }

                console.log(`Random userId ${randomUserId} OOO status is ${isBackupUserFromTeamOOO}`);

            }



        }

    }



    callback({
        outputFields: {
            isOOO,
            backupUserAvailable
        }
    });

}



const isUserIdOOO = async (userid, rows) => {

    if (!userid) throw new Error('userid is not passed as a paramater');

    const backupUserFromTeam = await getUserById(userid).catch(axiosErrorHandler);

    if (backupUserFromTeam.data) {

        const { email } = backupUserFromTeam.data;

        console.log(`Checking if ${email} is OOO...`);

        try {



            const { user } = findUserInSpreadSheetByEmail(rows, email)

            if (!user) {
                console.log(`${email} is not in the OOO spreadsheet`)
                return false
            }

            if (user) console.log(`${email} is in the OOO spreadsheet, checking the date...`);

            if (!user.oooStartDate || !user.oooEndDate) throw new Error(`There's no oooStartDate or oooEndDate in the spreasheet for ${email}`)

            if (user.oooStartDate === "") throw new Error(`There's no oooStartDate in the spreasheet for ${email}`)

            if (user.oooEndDate === "") throw new Error(`There's no oooEndDate in the spreasheet for ${email}`)

            const isOOO = isTheUserCurentlyOOO(user.oooStartDate, user.oooEndDate);

            console.log(`Is the backup individual OOO ? ${isOOO}`);

            return isOOO;

        } catch (error) {

            console.log(error);

            return false;

        }

    }
}

const isTheUserCurentlyOOO = (oooStartDate, oooEndDate) => {
    return (Date.now() > dateToTimestamp(oooStartDate) && Date.now() < dateToTimestamp(oooEndDate)) ? true : false;
}


const findUserInSpreadSheetByEmail = (rows, emailWeSearch) => {

    const ownerFound = [...rows].filter(row => row._rawData[0] === emailWeSearch);

    if (ownerFound.length === 0) {

        console.log(`${emailWeSearch} is not in the OOO list`);

        return { user: false }
    }

    // console.log(ownerFound)
    const oooStartDate = ownerFound[0]._rawData[1];

    const oooEndDate = ownerFound[0]._rawData[2];

    const backupIndividual = ownerFound[0]._rawData[3];

    const backupTeam = ownerFound[0]._rawData[4];

    return {
        user: {
            oooStartDate,
            oooEndDate,
            backupIndividual,
            backupTeam
        }

    }

}


const dateToTimestamp = (dateString) => {

    if (!dateString) throw new Error(`dateString is not set we got ${typeof dateString}`)
    const dateParts = dateString.split("-");
    const dateObject = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    return dateObject.getTime();
}

const getUserDataById = async (ownerId) => {
    const endPoint = `https://api.hubapi.com/crm/v3/owners/${ownerId}`;
    const data = await axios.get(endPoint, axiosConfig);
    return data;
}

const getUserById = async (userId) => {
    const endPoint = `https://api.hubapi.com/settings/v3/users/${userId}`;
    const data = await axios.get(endPoint, axiosConfig);
    return data;
}

const getTeams = async () => {
    const endPoint = `https://api.hubapi.com/settings/v3/users/teams`;
    const data = await axios.get(endPoint, axiosConfig);
    return data;
}

const getUserInfosByEmail = async (email) => {

    if (!email) throw new Error(`email is not set we got ${typeof email}`)

    if (email === "") throw new Error(`email is empty we`)

    const endPoint = `https://api.hubapi.com/crm/v3/owners/?email=${email}&limit=1&archived=false`;
    const data = await axios.get(endPoint, axiosConfig);
    return data;

}

/**
 * Handles errors thrown by axios requests and logs relevant information.
 *
 * @param {Error} error - The error object thrown by axios.
 */
/**
 * Handles errors thrown by axios requests and logs relevant information.
 *
 * @param {Error} error - The error object thrown by axios.
 */
const axiosErrorHandler = error => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser 
        // and an instance of http.ClientRequest in node.js
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
}