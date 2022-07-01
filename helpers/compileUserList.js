const getAllAzureUsers = require('./getAllAzureUsers');
const userConstructor = require('./userConstructor');

async function compileUserList() {
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
    return userArray
}
module.exports = compileUserList;