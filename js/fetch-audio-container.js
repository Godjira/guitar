document.addEventListener('DOMContentLoaded', function () {
    const audioSource = "audio/melody_001/audio.mp3"; // Example source string

    fetch(`audio-container.html?audioSource=${encodeURIComponent(audioSource)}`)
        .then(response => response.text())
        .then(data => {
            const wrapper = document.getElementById('audio-container-wrapper');

            wrapper.innerHTML = data;

            // Initialize GreenAudioPlayer after content is loaded
            GreenAudioPlayer.init({
                selector: '.green-audio-player',
                stopOthersOnPlay: true
            });
        })
        .catch(error => console.error('Error loading audio container:', error));
});
