const axios = require('axios');
const qs = require('qs');
const getAllAzureUsers = require('./helpers/getAllAzureUsers');
const userConstructor = require('./helpers/userConstructor');
const getAzureToken = require('./helpers/getAzureToken');
const compileUserList = require('./helpers/compileUserList');
const getAllDrives = require('./helpers/getAllDrives');
const getRootItems = require('./helpers/getRootItems');
const getChildItems = require('./helpers/getChildItems');
const getItemPermissions = require('./helpers/getItemPermissions');




let csvBuilder = [];



async function getDrives() {
    let allUsers = await compileUserList();
    let token = await getAzureToken();
    for (let x = 0; x < allUsers.length; x++) {
        try {
            let drives = await getAllDrives(allUsers[x].id, token)
            if (drives.data != undefined) {
                let driveRoot = await getRootItems(allUsers[x].id, token)
                let getChildren = await getChildItems(drives.data.value[0].id, driveRoot.data.id, token)
                console.log(allUsers[x].Email, '------------------------------')
                console.log(getChildren.data.value)
                let getPermissions = await getItemPermissions(drives.data.value[0].id, driveRoot.data.id, token)
                console.log(getPermissions.data.value)
            }
        } catch (error) { }
    };
};
getDrives();