const getAzureToken = require('./getAzureToken');
const axios = require('axios');

async function getAllAzureUsers(link) {
    let azureToken = await getAzureToken();
    let azureusers = await axios.get(link,
        {
            headers: {
                "Authorization": "Bearer " + azureToken,
                "Content-Type": "application/json"
            },
        })
    return azureusers
}
module.exports = getAllAzureUsers;