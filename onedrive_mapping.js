const axios = require('axios');
const qs = require('qs');
const getAllAzureUsers = require('./helpers/getAllAzureUsers');
const userConstructor = require('./helpers/userConstructor');
const getAzureToken = require('./helpers/getAzureToken');



async function constructUserList() {
    let userArray = [];
    let link = "https://graph.microsoft.com/v1.0/users"
    var azureUsers = await getAllAzureUsers(link);
    var nextLink = azureUsers.data['@odata.nextLink']
    while (nextLink) {
        for (let x = 0; x < azureUsers.data.value.length; x++) {
            let constructorObject = azureUsers.data.value[x]
            let userClean = await userConstructor(constructorObject);
            userArray.push(userClean)
        }
        var azureUsers = await getAllAzureUsers(nextLink);
        var nextLink = await azureUsers.data['@odata.nextLink']
    };
    for (let x = 0; x < azureUsers.data.value.length; x++) {
        let constructorObject = azureUsers.data.value[x]
        let userClean = await userConstructor(constructorObject);
        userArray.push(userClean)
    }
    let azureToken = await getAzureToken();
    console.log(azureToken);
    for (let x = 0; x < userArray.length; x++) {
        let getDrives = await axios.get(`https://graph.microsoft.com/v1.0/users/${userArray[x].id}/drives`,
            {
                headers: {
                    "Authorization": "Bearer " + azureToken,
                    "Content-Type": "application/json"
                },
            });
        console.log(getDrives);
    }
}


constructUserList();