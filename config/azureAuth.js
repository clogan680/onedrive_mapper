require('dotenv').config();
module.exports =
{
    endpoint: process.env.endpoint,
    grant_type: process.env.grant_type,
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    scope: process.env.scope
}