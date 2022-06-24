const axios = require('axios');


async function getDrives(driveID, itemsID, token) {

    let driveLink = `https://graph.microsoft.com/v1.0/drives/${driveID}/items/${itemsID}/children`
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