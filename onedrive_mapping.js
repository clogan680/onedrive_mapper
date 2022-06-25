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
    let allUsers = await compileUserList();
    var token = await getAzureToken();
    let total = process.hrtime();
    let timer = process.hrtime();
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function waiter() {
        console.log('Wait');
        await sleep(3000);
    }

    waiter()
    for (let i = 0; i < allUsers.length; i++) {
        try {
            let drives = await getAllDrives(allUsers[i].id, token)
            if (drives.data != undefined) {
                let csv = []
                let que = []
                var token = await getAzureToken();
                let driveRoot = await getRootItems(allUsers[i].id, token)
                let getChildren = await getChildItems(drives.data.value[0].id, driveRoot.data.id, token)

                for (let y = 0; y < getChildren.data.value.length; y++) {
                    que.push(getChildren.data.value[y])
                }
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
                            let newRow = await csvBuilder(allUsers[i].Email, que[x].parentReference.path, que[x].name, role[0], usersV2.siteUser.email)
                            console.log(newRow)
                            csv.push(newRow)
                        } else {
                            let usersV2Catch = getPermissions.data.value[y].grantedToIdentitiesV2
                            if (usersV2Catch == undefined) {
                                usersV2Catch = getPermissions.data.value[y].grantedToV2
                            }
                            if (Array.isArray(usersV2Catch) == true) {
                                for (let n = 0; n < usersV2Catch.length; n++) {
                                    let newRow = await csvBuilder(allUsers[i].Email, que[x].parentReference.path, que[x].name, role[0], usersV2Catch[n].siteUser.email)
                                    console.log(newRow)
                                    csv.push(newRow)
                                }
                            } else {
                                let newRow = await csvBuilder(allUsers[i].Email, que[x].parentReference.path, que[x].name, role[0], usersV2Catch.siteUser.email)
                                console.log(newRow)
                                csv.push(newRow)
                            }
                        }
                    }
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