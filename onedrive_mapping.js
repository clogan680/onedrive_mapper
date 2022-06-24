
const getAzureToken = require('./helpers/getAzureToken');
const compileUserList = require('./helpers/compileUserList');
const getAllDrives = require('./helpers/getAllDrives');
const getRootItems = require('./helpers/getRootItems');
const getChildItems = require('./helpers/getChildItems');
const getChildrenData = require('./helpers/getchildrenData');
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
                console.log(allUsers[i].Email, '------------------------------')

                for (let y = 0; y < getChildren.data.value.length; y++) {
                    que.push(getChildren.data.value[y])
                }
                while (que.length > 0) {
                    for (let x = 0; x < que.length; x++) {
                        // console.log(que[x])

                        let getPermissions = await getItemPermissions(drives.data.value[0].id, que[x].id, token)
                        console.log(que[x].name, 'NAME OF ITEM ------------------------------------------------------------------')
                        console.log
                        var folder
                        try {
                            folder = que[x].folder.childCount
                            // console.log(folder, 'FOLDER-----------')
                        } catch (error) {
                            folder = 0
                        }
                        if (folder > 0) {

                            console.log(folder, 'FOLDER HAS CHILDREN-------------')
                            let getChildren = await getChildItems(drives.data.value[0].id, que[x].id, token)
                            for (let z = 0; z < getChildren.data.value.length; z++) {
                                que.push(getChildren.data.value[z])
                            }

                        }
                        que.shift(que[x])
                    }
                }
                // let childrenData = await getChildrenData(drives.data.value[0].id, getChildren.data.value, token)
                // console.log(getChildren.data.value)
                // let getPermissions = await getItemPermissions(drives.data.value[0].id, driveRoot.data.id, token)
                // console.log(getPermissions.data.value)
            }
        } catch (error) { }
    };
};
getDrives();