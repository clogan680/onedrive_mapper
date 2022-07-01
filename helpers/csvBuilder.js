async function csvConstructor(owner, path, docName, permission, user) {
    let returnObject = {
        owner: owner,
        path: path,
        docName: docName,
        permission: permission,
        user: user,
    };
    return returnObject;
}
module.exports = csvConstructor