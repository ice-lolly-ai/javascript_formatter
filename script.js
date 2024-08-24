document.addEventListener('DOMContentLoaded', () => {
    const videoSources = [
        'vids/wealth_1_pure.mp4',
        'vids/wealth_2_pure.mp4'
    ];

    const initialVideoCount = 3; // Set your initial video count here
    let videoElements = []; // To store video elements
    let sizeSliderDirection = 1; // Direction for size slider animation
    let isDarkMode = false;

    // New variables
    const showControls = false; // Set this to `true` to show controls, `false` to hide
    const backgroundImageUrl = 'vids/cur_1.png';  // Set your background image URL here
    const videoOpacity = 0.1; // Set your desired video opacity (0.0 to 1.0)

    // Define variables to select the slider elements
    const videoSizeInput = document.getElementById('videoSize');
    const videoSpeedInput = document.getElementById('videoSpeed');
    const numVideosInput = document.getElementById('numVideos');
    const randomizeButton = document.getElementById('randomizeButton');
    const toggleDarkModeButton = document.getElementById('toggleDarkMode');
    const controls = document.getElementById('controls'); // Select the controls container

    // Function to toggle the visibility of controls
    function toggleControlsVisibility() {
        if (showControls) {
            controls.style.display = 'block';
        } else {
            controls.style.display = 'none';
        }
    }

    // Function to set the background image
    function setBackgroundImage() {
        document.body.style.backgroundImage = `url(${backgroundImageUrl})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }

    // Function to update the video opacity
    function updateVideoOpacity() {
        videoElements.forEach(video => {
            video.style.opacity = videoOpacity;
        });
    }

    // Initialize videos
    function initializeVideos(count) {
        const container = document.getElementById('video-container');
        container.innerHTML = ''; // Clear any existing videos

        for (let i = 0; i < count; i++) {
            const video = document.createElement('video');
            video.className = 'video-player';
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.src = videoSources[i % videoSources.length];
            video.style.opacity = videoOpacity; // Set the initial opacity
            container.appendChild(video);
            videoElements.push(video);
            startBouncingAnimation(video);
        }
    }

    // Function to update the video size
    function updateVideoSize() {
        const size = videoSizeInput.value + 'px';
        videoElements.forEach(video => {
            video.style.width = size;
            video.style.height = size;
        });
        randomizeVideos(); // Reapply random positions to ensure visibility
    }

    // Function to update the video speed
    function updateVideoSpeed() {
        const speed = videoSpeedInput.value;
        videoElements.forEach(video => {
            video.playbackRate = parseFloat(speed); // Ensure it's a float
        });
    }

    // Function to update the number of videos
    function updateNumVideos() {
        const numVideos = numVideosInput.value;
        const currentCount = videoElements.length;

        if (numVideos > currentCount) {
            for (let i = currentCount; i < numVideos; i++) {
                const video = document.createElement('video');
                video.className = 'video-player';
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.src = videoSources[i % videoSources.length];
                video.style.opacity = videoOpacity; // Set the opacity for new videos
                document.getElementById('video-container').appendChild(video);
                videoElements.push(video);
                startBouncingAnimation(video);
            }
        } else if (numVideos < currentCount) {
            for (let i = currentCount; i > numVideos; i--) {
                const video = videoElements.pop();
                video.parentElement.removeChild(video);
            }
        }

        // Update sliders when number of videos changes
        videoSizeInput.value = parseFloat(videoSizeInput.value) * 1.01;
        videoSpeedInput.value = parseFloat(videoSpeedInput.value) * 1.01;
        updateVideoSize();
        updateVideoSpeed();
    }

    function randomizeVideos() {
        videoElements.forEach(video => {
            startBouncingAnimation(video);
        });
    }

    function startBouncingAnimation(video) {
        const videoContainer = document.getElementById('video-container');
        const containerWidth = videoContainer.clientWidth;
        const containerHeight = videoContainer.clientHeight;
        const videoWidth = video.offsetWidth;
        const videoHeight = video.offsetHeight;

        let dx = Math.random() * 4 - 2;
        let dy = Math.random() * 4 - 2;

        function animate() {
            let x = parseFloat(video.style.left || 0);
            let y = parseFloat(video.style.top || 0);

            x += dx;
            y += dy;

            if (x <= 0 || x + videoWidth >= containerWidth) {
                dx = -dx;
            }
            if (y <= 0 || y + videoHeight >= containerHeight) {
                dy = -dy;
            }

            video.style.left = `${x}px`;
            video.style.top = `${y}px`;

            requestAnimationFrame(animate);
        }

        video.style.position = 'absolute';
        video.style.left = `${Math.random() * (containerWidth - videoWidth)}px`;
        video.style.top = `${Math.random() * (containerHeight - videoHeight)}px`;

        animate();
    }

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
    }

    function animateSizeSlider() {
        const min = parseFloat(videoSizeInput.min);
        const max = parseFloat(videoSizeInput.max);
        const step = parseFloat(videoSizeInput.step);
        let current = min;

        function moveSlider() {
            if (sizeSliderDirection === 1) {
                current += step;
                if (current >= max) {
                    current = max;
                    sizeSliderDirection = -1; // Change direction to left
                }
            } else {
                current -= step;
                if (current <= min) {
                    current = min;
                    sizeSliderDirection = 1; // Change direction to right
                }
            }
            videoSizeInput.value = current;
            updateVideoSize();
            requestAnimationFrame(moveSlider);
        }

        moveSlider();
    }

    // Initial setup
    setBackgroundImage(); // Set the background image
    toggleControlsVisibility(); // Show or hide controls based on `showControls`
    initializeVideos(initialVideoCount);
    updateVideoSize();
    updateVideoSpeed();
    randomizeVideos();
    updateVideoOpacity(); // Set the initial opacity of videos
    animateSizeSlider(); // Start the slider animation

    // Event Listeners
    videoSizeInput.addEventListener('input', updateVideoSize);
    videoSpeedInput.addEventListener('input', updateVideoSpeed);
    numVideosInput.addEventListener('change', updateNumVideos);
    randomizeButton.addEventListener('click', randomizeVideos);
    toggleDarkModeButton.addEventListener('click', toggleDarkMode);
});
