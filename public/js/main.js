const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const roomUsers = document.getElementById('users');


//get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

//JOin chatroom
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputRoomUsers(users);
})


//Message from server
socket.on('message', message => {

    outputMessage(message);

    //scroll to bottomm every time we get a message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage', msg);

    //clear input after emitting chat message to the sever
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Output message to dom
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}


//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

function outputRoomUsers(users) {
    roomUsers.innerHTML = `
    ${users.map(user =>`<li>${user.username}</li>`).join('')}
    `;
}