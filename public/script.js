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
    videoGrid.append(video);
}