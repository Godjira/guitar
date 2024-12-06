document.addEventListener('DOMContentLoaded', function () {
    const wrappers = document.querySelectorAll('.audio-container-wrapper');
    let loadedContainers = 0;

    wrappers.forEach(wrapper => {
        const audioFolderPath = wrapper.dataset.audioFolder;

        fetch(`${audioFolderPath}/info.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(audioInfo => {
                return fetch('../../../templates/audio-container.html')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.text();
                    })
            .then(data => {
                        wrapper.innerHTML = data;

                        const audioElement = wrapper.querySelector('audio source');
                        if (audioElement) {
                            audioElement.src = `${audioFolderPath}/${audioInfo.audioFile}`;
                        }

                        const titleElement = wrapper.querySelector('.audio-title');
                        if (titleElement && audioInfo.title) {
                            titleElement.textContent = audioInfo.title;
                        }

                        const descriptionElement = wrapper.querySelector('.audio-description');
                        if (descriptionElement && audioInfo.description) {
                            descriptionElement.textContent = audioInfo.description;
                        }
                        
                        const toggleSection = wrapper.querySelector('.toggle-section');
                        const toggleButton = wrapper.querySelector('.toggle-button');
                        const toggleContent = wrapper.querySelector('.toggle-content');
                        
                        if (audioInfo.toggleContent && toggleSection && toggleButton && toggleContent) {
                            const toggleTitle = toggleButton.querySelector('.toggle-title');
                            const toggleText = toggleContent.querySelector('.toggle-text');
                            
                            if (toggleTitle) {
                                toggleTitle.textContent = audioInfo.toggleContent.title;
                            }
                            
                            if (toggleText) {
                                toggleText.textContent = audioInfo.toggleContent.text;
                            }
                            
                            const imageContainer = toggleContent.querySelector('.toggle-image');
                            if (imageContainer) {
                                if (audioInfo.toggleContent.image) {
                                    const img = document.createElement('img');
                                    img.src = `${audioFolderPath}/${audioInfo.toggleContent.image}`;
                                    img.alt = audioInfo.title;
                                    imageContainer.appendChild(img);
                                    imageContainer.style.display = 'block';
                                } else {
                                    imageContainer.style.display = 'none';
                                }
                            }

                            toggleButton.addEventListener('click', () => {
                                const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
                                toggleButton.setAttribute('aria-expanded', !isExpanded);
                                toggleContent.hidden = isExpanded;
                            });

                            toggleSection.style.display = 'block';
                        } else if (toggleSection) {
                            toggleSection.style.display = 'none';
                        }

                        loadedContainers++;

                        // Initialize GreenAudioPlayer
                        if (loadedContainers === wrappers.length) {
                            GreenAudioPlayer.init({
                                selector: '.green-audio-player',
                                stopOthersOnPlay: true,
                                loop: true
                            });
                        }
                    });
            })
            .catch(error => {
                console.error('Error loading audio container:', error);
                wrapper.innerHTML = `<p>Error loading audio: ${error.message}</p>`;
            });
    });
});