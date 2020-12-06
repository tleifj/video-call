const socket = io();
// Get video grid
const videoGrid = document.getElementById('video-grid');
console.log(videoGrid);
// Create video element
const myVideo = document.createElement('video');
// Make created video muted so we don't hear ourselves
myVideo.muted = true;

// Get the users video and audio
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    // Add our video to screen
    addVideoStream(myVideo, stream);

    // When a call comes in, answer and send stream
    myPeer.on('call', call => {
        call.answer(stream);

        // Creates a new video element to add to our page
        const video = document.createElement('video');

        
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })
    // When a user is connected, create a call and add video
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
    });
});

// Connect to Peer server on port 3002
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3002'
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);

})

function addVideoStream(video, stream) {
    // Set video source to the stream
    video.srcObject = stream;

    // Once it's loaded, play it
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    // Adds video to grid of videos
    videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
    // Creates a PeerJS call
    const call = myPeer.call(userId, stream);

    // Creates a new video element to add to our page
    const video = document.createElement('video');

    // On stream, add user's video to our page
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })

    // When call ends, remove video element from screen
    call.on('close', () => {
        video.remove();
    })
}