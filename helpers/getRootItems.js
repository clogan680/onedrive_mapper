const axios = require('axios');


async function getDrives(id, token) {
    let driveLink = `https://graph.microsoft.com/v1.0/users/${id}/drive/root`
    try {
        var getDrives = await axios.get(driveLink,
            {
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
            });
    } catch (error) { }
    return getDrives
}
module.exports = getDrives;