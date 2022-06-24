const getItemPermissions = require('./getItemPermissions');


async function childrenDataGrab(driveID, childArray, token) {
                // console.log(childArray)
                for (let x = 0; x < childArray.length; x++) {
                    let getPermissions = await getItemPermissions(driveID, childArray[x].id, token)
                    for (let y = 0; y < getPermissions.data.value.length; y++) {
                        let role = getPermissions.data.value[y].roles

                        let usersV2 = getPermissions.data.value[y].grantedToV2
                        let users = getPermissions.data.value[y].grantedTo

                        let usersIV2 = getPermissions.data.value[y].grantedToIdentitiesV2
                        let usersI = getPermissions.data.value[y].grantedToIdentities
                        console.log(role, 'ROLE -----------')
                        console.log(usersV2, 'USERS V2 -------------')
                        console.log(users, 'USERS ------------')
                        console.log(usersIV2, 'USERS Identity V2 -------------')
                        console.log(usersI, 'USERS Identity ------------')

                    }
                    console.log(childArray[x].name, 'ITEM NAME ----------------------------')
                    // console.log(childArray[x], 'ITEM INFO ----------------------------')
                    try {
                        console.log(childArray[x].folder, 'FOLDER-----------')
                    } catch (error) {
                        // do nothing
                    }
                    // console.log(childArray[x].folder.childCount, 'CHILD COUNT IF FOLDER ----------------------------')
                    // console.log(childArray[x].shared.scope, 'SHARING SCOPE ----------------------------')

                }
}
module.exports = childrenDataGrab
