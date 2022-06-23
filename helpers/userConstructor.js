
async function userConstructor(constructorObject) {
    let returnObject = {
        id: constructorObject.id,
        Email: constructorObject.userPrincipalName,
        first_name: constructorObject.givenName,
        last_name: constructorObject.surname,
        title: constructorObject.jobTitle,
    };
    return returnObject;
}
module.exports = userConstructor