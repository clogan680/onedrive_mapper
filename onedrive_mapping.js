
const getAzureToken = require('./helpers/getAzureToken');
const compileUserList = require('./helpers/compileUserList');
const getAllDrives = require('./helpers/getAllDrives');
const getRootItems = require('./helpers/getRootItems');
const getChildItems = require('./helpers/getChildItems');
const getItemPermissions = require('./helpers/getItemPermissions');




let que = [];



async function getDrives() {
    let allUsers = await compileUserList();
    let token = await getAzureToken();
    for (let i = 0; i < allUsers.length; i++) {
        try {
            let drives = await getAllDrives(allUsers[i].id, token)
            if (drives.data != undefined) {
                let driveRoot = await getRootItems(allUsers[i].id, token)
                let getChildren = await getChildItems(drives.data.value[0].id, driveRoot.data.id, token)

                for (let y = 0; y < getChildren.data.value.length; y++) {
                    que.push(getChildren.data.value[y])
                }
                while (que.length > 0) {
                    for (let x = 0; x < que.length; x++) {

                        let getPermissions = await getItemPermissions(drives.data.value[0].id, que[x].id, token)

                        for (let y = 0; y < getPermissions.data.value.length; y++) {
                            let role = getPermissions.data.value[y].roles
                            if (role[0] == 'owner') {
                                let usersV2 = getPermissions.data.value[y].grantedToV2

                                console.log(allUsers[i].Email)
                                console.log(que[x].parentReference.path)
                                console.log(que[x].name)
                                console.log(role[0])
                                console.log(usersV2.user.email)
                            } else {
                                let usersV2Catch = getPermissions.data.value[y].grantedToIdentitiesV2
                                if (usersV2Catch == undefined) {
                                    usersV2Catch = getPermissions.data.value[y].grantedToV2
                                }
                                if (Array.isArray(usersV2Catch) == true) {
                                    console.log(usersV2Catch.length)
                                    for (let n = 0; n < usersV2Catch.length; n++) {
                                        console.log(allUsers[i].Email)
                                        console.log(que[x].parentReference.path)
                                        console.log(que[x].name)
                                        console.log(role[0])
                                        let usersChecker = usersV2Catch[n]
                                        console.log(usersV2Catch[n].siteUser.email)
                                    }
                                } else {
                                    console.log(allUsers[i].Email)
                                    console.log(que[x].parentReference.path)
                                    console.log(que[x].name)
                                    console.log(role[0])
                                    console.log(usersV2Catch.siteUser.email)
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
};
getDrives();