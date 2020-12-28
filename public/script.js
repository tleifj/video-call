const socket = io();
// Get video grid
const videoGrid = document.getElementById('video-grid');
// Create video element
const myVideo = document.createElement('video');
// Make created video muted so we don't hear ourselves
myVideo.muted = true;


// Keep track of all the calls we're connected to.
const peers = {};

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

    console.log(stream.getAudioTracks());

    const audioMute = document.getElementById('audio-mute');
    audioMute.addEventListener('click', function() {
        stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
        this.classList.toggle('video-control--active')
    })

    const videoMute = document.getElementById('video-mute');
    videoMute.addEventListener('click', function() {
        stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
        this.classList.toggle('video-control--active')
    })

    

});

// Listen for user disconnected
socket.on('user-disconnected', userId => {
    console.log('disconnected');
    // Closes the call with that user
    if (peers[userId]) {
        peers[userId].close();
    }
    
});
// Connect to Peer server on port 3002
const myPeer = new Peer()



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

    // Add call to list of calls connected to
    peers[userId] = call;

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
