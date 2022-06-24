const axios = require('axios');
const qs = require('qs');
const getAllAzureUsers = require('./helpers/getAllAzureUsers');
const userConstructor = require('./helpers/userConstructor');
const getAzureToken = require('./helpers/getAzureToken');
const compileUserList = require('./helpers/compileUserList');
const getAllDrives = require('./helpers/getAllDrives');



let csvBuilder = [];



async function getDrives() {
    let allUsers = await compileUserList();
    let token = await getAzureToken();
    for (let x = 0; x < allUsers.length; x++) {
        try {
            let drives = await getAllDrives(allUsers[x].id, token)
            if (drives.data != undefined) {
                console.log(drives.data)
                
            }
        } catch (error) { }
    };
};
getDrives();