const users = [];

//Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}


//Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//User leaves chat
function userLeaves(id) {
    const index = users.findIndex(user => user.id === id); //finds the user in the array after they leave

    //and then if user is found, remove them from array and return the user to disconnect function 
    //so that we can print which user left
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

}

//Get Room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeaves
}