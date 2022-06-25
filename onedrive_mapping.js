
const getAzureToken = require('./helpers/getAzureToken');
const compileUserList = require('./helpers/compileUserList');
const getAllDrives = require('./helpers/getAllDrives');
const getRootItems = require('./helpers/getRootItems');
const getChildItems = require('./helpers/getChildItems');
const getItemPermissions = require('./helpers/getItemPermissions');
const csvBuilder = require('./helpers/csvBuilder');
const converter = require('json-2-csv');
const fs = require('fs');



let que = [];
let csv = []



async function getDrives() {
    let allUsers = await compileUserList();
    var token = await getAzureToken();
    let start = process.hrtime();
    for (let i = 0; i < allUsers.length; i++) {
        try {
            let drives = await getAllDrives(allUsers[i].id, token)
            if (drives.data != undefined) {
                var token = await getAzureToken();
                let driveRoot = await getRootItems(allUsers[i].id, token)
                let getChildren = await getChildItems(drives.data.value[0].id, driveRoot.data.id, token)

                for (let y = 0; y < getChildren.data.value.length; y++) {
                    que.push(getChildren.data.value[y])
                }
                while (que.length > 0) {
                    for (let x = 0; x < que.length; x++) {
                        console.log(process.hrtime(start))
                        let getPermissions = await getItemPermissions(drives.data.value[0].id, que[x].id, token)
                        for (let y = 0; y < getPermissions.data.value.length; y++) {
                            let role = getPermissions.data.value[y].roles
                            if (role[0] == 'owner') {
                                let usersV2 = getPermissions.data.value[y].grantedToV2
                                let newRow = await csvBuilder(allUsers[i].Email, que[x].parentReference.path, que[x].name, role[0], usersV2.user.email)
                                console.log(newRow)
                                csv.push(newRow)
                            } else {
                                let usersV2Catch = getPermissions.data.value[y].grantedToIdentitiesV2
                                if (usersV2Catch == undefined) {
                                    usersV2Catch = getPermissions.data.value[y].grantedToV2
                                }
                                if (Array.isArray(usersV2Catch) == true) {
                                    console.log(usersV2Catch.length)
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
                            // console.log(folder, 'FOLDER HAS CHILDREN-------------')
                            let getChildren = await getChildItems(drives.data.value[0].id, que[x].id, token)
                            for (let z = 0; z < getChildren.data.value.length; z++) {
                                que.push(getChildren.data.value[z])
                            }
                        }
                        que.shift(que[x])
                    }
                }
            }
        } catch (error) { }
    };
    converter.json2csv(csv, (err, csv) => {
        if (err) {
            throw err;
        }
        // write CSV to a file
        fs.writeFileSync('onedrive_map.csv', csv);

    });
};
getDrives();