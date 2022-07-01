const getAzureToken = require('./helpers/getAzureToken');
const compileUserList = require('./helpers/compileUserList');
const getAllDrives = require('./helpers/getAllDrives');
const getRootItems = require('./helpers/getRootItems');
const getChildItems = require('./helpers/getChildItems');
const getItemPermissions = require('./helpers/getItemPermissions');
const csvBuilder = require('./helpers/csvBuilder');
const converter = require('json-2-csv');
const fs = require('fs');


async function getDrives() {
    // Grab and create array of all users
    const allUsers = await compileUserList();
    var token = await getAzureToken();
    // Create timers, 1 for total time, 1 for token resets
    let total = process.hrtime();
    let timer = process.hrtime();
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function waiter() {
        console.log('Starting');
        await sleep(3000);
    }
    waiter()
    // for each user grab drive data
    for (let i = 0; i < allUsers.length; i++) {
        try {
            let drives = await getAllDrives(allUsers[i].id, token)
            // check if user has a valid drive
            if (drives.data != undefined) {
                let csv = []
                let que = []
                // get root of user's drive
                let driveRoot = await getRootItems(allUsers[i].id, token)
                // user root to get base level children items (what you see when landing on onedrive gui first level)
                let getChildren = await getChildItems(drives.data.value[0].id, driveRoot.data.id, token)
                // for each child, add it to our que
                for (let y = 0; y < getChildren.data.value.length; y++) {
                    que.push(getChildren.data.value[y])
                }
                console.log(que.length, '-----QUE LENGTH')
                // for each item in que, get the details, and push relevant info to csv list
                for (let x = 0; x < que.length; x++) {
                    console.log(x, '-----CURRENT INDEX')
                    console.log(process.hrtime(timer)[0], '-----TOKEN TIMER')
                    if (process.hrtime(timer)[0] > 3000) {
                        var token = await getAzureToken();
                        console.log('Getting TOKEN')
                        timer = process.hrtime();
                    }
                    console.log(process.hrtime(total)[0], '-----TOTAL TIME')
                    let getPermissions = await getItemPermissions(drives.data.value[0].id, que[x].id, token)
                    for (let y = 0; y < getPermissions.data.value.length; y++) {
                        let role = getPermissions.data.value[y].roles
                        let link = getPermissions.data.value[y].link
                        if (link != undefined) {
                            let newRow = await csvBuilder(allUsers[i].Email, que[x].parentReference.path, que[x].name, link.type, link.webUrl)
                            console.log(newRow)
                            csv.push(newRow)
                        }
                        if (role[0] == 'owner') {
                            let usersV2 = getPermissions.data.value[y].grantedToV2
                            if (usersV2 == undefined) {
                                usersV2 = getPermissions.data.value[y].grantedToIdentitiesV2
                            }
                            try {
                                var sharedUser = usersV2.siteUser.email
                            } catch (error) {
                                sharedUser = usersV2.user.email
                            }

                            let newRow = await csvBuilder(allUsers[i].Email, que[x].parentReference.path, que[x].name, role[0], sharedUser)
                            console.log(newRow)
                            csv.push(newRow)
                        } else {
                            let usersV2Catch = getPermissions.data.value[y].grantedToIdentitiesV2
                            if (usersV2Catch == undefined) {
                                usersV2Catch = getPermissions.data.value[y].grantedToV2
                            }
                            if (Array.isArray(usersV2Catch) == true) {
                                for (let n = 0; n < usersV2Catch.length; n++) {
                                    try {
                                        var sharedUser = usersV2Catch[n].siteUser.email
                                    } catch (error) {
                                        sharedUser = usersV2Catch[n].user.email
                                    }
                                    let newRow = await csvBuilder(allUsers[i].Email, que[x].parentReference.path, que[x].name, role[0], sharedUser)
                                    console.log(newRow)
                                    csv.push(newRow)
                                }
                            } else {
                                try {
                                    var sharedUser = usersV2Catch.siteUser.email
                                } catch (error) {
                                    sharedUser = usersV2Catch.user.email
                                }

                                let newRow = await csvBuilder(allUsers[i].Email, que[x].parentReference.path, que[x].name, role[0], sharedUser)
                                console.log(newRow)
                                csv.push(newRow)
                            }
                        }
                    }
                    // check if item has children. If it does, add each child to the end of the que
                    var folder
                    try {
                        folder = que[x].folder.childCount
                    } catch (error) {
                        folder = 0
                    }
                    if (folder > 0) {
                        let getMore = await getChildItems(drives.data.value[0].id, que[x].id, token)
                        for (let z = 0; z < getMore.data.value.length; z++) {
                            que.push(getMore.data.value[z])
                        }
                    }
                    console.log(que.length, '-----QUE LENGTH')
                }
                converter.json2csv(csv, (err, csv) => {
                    if (err) {
                        throw err;
                    }
                    // write CSV to a file
                    fs.writeFileSync(`./csvList/${allUsers[i].Email}_mapping.csv`, csv);

                });
            }
        } catch (error) { }
    };
};
getDrives();