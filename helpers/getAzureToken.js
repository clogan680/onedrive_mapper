const axios = require('axios');
const qs = require('qs');
const azureAuth = require('../config/azureAuth.json');

async function getAzureToken() {

    const endpoint = azureAuth.endpoint;
    const requestParams = {
        grant_type: azureAuth.grant_type,
        client_id: azureAuth.client_id,
        client_secret: azureAuth.client_secret,
        scope: azureAuth.scope
    };

    axios.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded';

    let authenticate = await axios.post(endpoint, qs.stringify(requestParams))
    return authenticate.data.access_token;
}
module.exports = getAzureToken;