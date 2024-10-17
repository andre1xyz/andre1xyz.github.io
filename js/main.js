document.addEventListener('DOMContentLoaded', () => {
    const stardust1 = document.getElementById('stardust1');
    const stardust2 = document.getElementById('stardust2');
    const stardust3 = document.getElementById('stardust3');
    const stardust4 = document.getElementById('stardust4');
    const stardust5 = document.getElementById('stardust5');
    const expandButton = document.getElementById('expand-button');
    const expandIcon = document.getElementById('expand-icon');
    const videoPlayer = document.getElementById('video-player');
    const backgroundVideos = document.querySelectorAll('.background-video');

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xOffset = (clientX / window.innerWidth - 0.5) * 2;
        const yOffset = (clientY / window.innerHeight - 0.5) * 2;

        stardust1.style.transform = `translate3d(${xOffset * -10}px, ${yOffset * -10}px, 0) scale(1.4)`;
        stardust2.style.transform = `translate3d(${xOffset * -20}px, ${yOffset * -20}px, 0) scale(1.3)`;
        stardust3.style.transform = `translate3d(${xOffset * -30}px, ${yOffset * -30}px, 0) scale(1.2)`;
        stardust4.style.transform = `translate3d(${xOffset * -40}px, ${yOffset * -40}px, 0) scale(1.1)`;
        stardust5.style.transform = `translate3d(${xOffset * -50}px, ${yOffset * -50}px, 0) scale(1)`;
    });

    let isExpanded = false;
    expandButton.addEventListener('click', () => {
        if (!isExpanded) {
            videoPlayer.style.transform = 'scale(1.75)';
            videoPlayer.style.transition = 'transform 0.5s ease';
            expandButton.style.position = 'absolute';
            expandButton.style.bottom = '80px';
            expandButton.style.right = '30px';
            expandIcon.src = 'https://img.icons8.com/ios-filled/50/ffffff/collapse-arrow.png';

            // Move side videos to the center with animation
            backgroundVideos.forEach(video => {
video.style.transform = 'translateY(-50%) scale(1.1)';
video.style.transition = 'transform 0.5s ease, top 0.5s ease, left 0.5s ease, right 0.5s ease, margin-left 0.5s ease';
video.style.top = '50%';
if (video.classList.contains('left')) {
video.style.left = '50%';
video.style.right = 'auto';
} else if (video.classList.contains('right')) {
video.style.right = '50%';
video.style.left = 'auto';
}
video.style.marginLeft = '-10%';
});
        } else {
            videoPlayer.style.transform = 'scale(1)';
            videoPlayer.style.transition = 'transform 0.5s ease';
            expandButton.style.position = 'static';
            expandIcon.src = 'https://img.icons8.com/ios-filled/50/ffffff/expand-arrow.png';

            // Return side videos to original position with animation
            backgroundVideos.forEach(video => {
if (video.classList.contains('left')) {
video.style.transform = 'translateY(-50%) scale(1)';
video.style.transition = 'transform 0.5s ease, left 0.5s ease, margin-left 0.5s ease';
video.style.left = '2%';
video.style.marginLeft = '0';
} else if (video.classList.contains('right')) {
video.style.transform = 'translateY(-50%) scale(1)';
video.style.transition = 'transform 0.5s ease, right 0.5s ease, margin-left 0.5s ease';
video.style.right = '2%';
video.style.left = 'auto';
video.style.marginLeft = '0';
}
            });
        }
        isExpanded = !isExpanded;
    });

    const playPauseButton = document.getElementById('play-pause');
    const playIcon = document.getElementById('play-icon');
    const volumeSlider = document.getElementById('volume-slider');
    const muteButton = document.getElementById('mute');
    const muteIcon = document.getElementById('mute-icon');
    const timeSlider = document.getElementById('time-slider');
    const frameDisplay = document.getElementById('frame-display');
    const totalFramesDisplay = document.getElementById('total-frames');
    const fpsSelect = document.getElementById('fps-select');
    const customFpsInput = document.getElementById('custom-fps');
    const fullscreenButton = document.getElementById('fullscreen-button');
    const frameForwardButton = document.getElementById('frame-forward');
    const frameBackwardButton = document.getElementById('frame-backward');

    // Hide default controls and show custom controls
    videoPlayer.controls = false;

    playPauseButton.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
            playIcon.src = 'https://img.icons8.com/ios-filled/50/ffffff/pause.png';
        } else {
            videoPlayer.pause();
            playIcon.src = 'https://img.icons8.com/ios-filled/50/ffffff/play.png';
        }
    });

    volumeSlider.addEventListener('input', () => {
        videoPlayer.volume = volumeSlider.value;
        if (volumeSlider.value > 0) {
            videoPlayer.muted = false;
            muteIcon.src = 'https://img.icons8.com/ios-filled/50/ffffff/speaker.png';
        }
        volumeSlider.setAttribute('value', Math.round(volumeSlider.value * 100));
    });

    muteButton.addEventListener('click', () => {
        if (videoPlayer.muted) {
            videoPlayer.muted = false;
            muteIcon.src = 'https://img.icons8.com/ios-filled/50/ffffff/speaker.png';
        } else {
            videoPlayer.muted = true;
            muteIcon.src = 'https://img.icons8.com/ios-filled/50/ffffff/mute.png';
        }
    });

    muteButton.addEventListener('mouseover', () => {
        volumeSlider.style.display = 'block';
    });

    volumeSlider.addEventListener('mouseover', () => {
        volumeSlider.style.display = 'block';
    });

    muteButton.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!volumeSlider.matches(':hover')) {
                volumeSlider.style.display = 'none';
            }
        }, 200);
    });

    volumeSlider.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!muteButton.matches(':hover')) {
                volumeSlider.style.display = 'none';
            }
        }, 200);
    });

    videoPlayer.addEventListener('loadedmetadata', () => {
        let fps = parseInt(fpsSelect.value);
        if (fpsSelect.value === 'custom') {
            fps = parseInt(customFpsInput.value);
        }
        const totalFrames = Math.ceil(videoPlayer.duration * fps);
        timeSlider.max = totalFrames - 1;
        totalFramesDisplay.textContent = totalFrames;
    });

    videoPlayer.addEventListener('timeupdate', () => {
        let fps = parseInt(fpsSelect.value);
        if (fpsSelect.value === 'custom') {
            fps = parseInt(customFpsInput.value);
        }
        const currentFrame = Math.floor(videoPlayer.currentTime * fps);
        timeSlider.value = currentFrame;
        frameDisplay.textContent = currentFrame;
        const sliderThumbOffset = (currentFrame / timeSlider.max) * (timeSlider.offsetWidth - 15);
        frameDisplay.style.left = `${sliderThumbOffset + 7.5}px`;
    });

    timeSlider.addEventListener('input', () => {
        let fps = parseInt(fpsSelect.value);
        if (fpsSelect.value === 'custom') {
            fps = parseInt(customFpsInput.value);
        }
        const newTime = parseFloat(timeSlider.value) / fps;
        videoPlayer.currentTime = newTime;
        frameDisplay.textContent = Math.floor(newTime * fps);
    });

    fpsSelect.addEventListener('change', () => {
        if (fpsSelect.value === 'custom') {
            customFpsInput.style.display = 'inline';
        } else {
            customFpsInput.style.display = 'none';
            customFpsInput.value = fpsSelect.value;
        }
        updateSliderMax();
    });

    customFpsInput.addEventListener('input', () => {
        updateSliderMax();
    });

    function updateSliderMax() {
        let fps = parseInt(fpsSelect.value);
        if (fpsSelect.value === 'custom') {
            fps = parseInt(customFpsInput.value);
        }
        const totalFrames = Math.ceil(videoPlayer.duration * fps);
        timeSlider.max = totalFrames;
        totalFramesDisplay.textContent = totalFrames;
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            if (videoPlayer.requestFullscreen) {
                videoPlayer.requestFullscreen();
            } else if (videoPlayer.webkitRequestFullscreen) { /* Safari */
                videoPlayer.webkitRequestFullscreen();
            } else if (videoPlayer.msRequestFullscreen) { /* IE11 */
                videoPlayer.msRequestFullscreen();
            }
        }
    }

    // Event listener for fullscreen button
    fullscreenButton.addEventListener('click', toggleFullscreen);

    // Event listener for double-clicking the video to toggle fullscreen
    videoPlayer.addEventListener('dblclick', toggleFullscreen);

    frameForwardButton.addEventListener('click', () => {
        let fps = parseInt(fpsSelect.value);
        if (fpsSelect.value === 'custom') {
            fps = parseInt(customFpsInput.value);
        }
        const newFrame = parseInt(timeSlider.value) + 1;
        if (newFrame <= timeSlider.max) {
            timeSlider.value = newFrame;
            videoPlayer.currentTime = newFrame / fps;
        }
    });

    frameBackwardButton.addEventListener('click', () => {
        let fps = parseInt(fpsSelect.value);
        if (fpsSelect.value === 'custom') {
            fps = parseInt(customFpsInput.value);
        }
        const newFrame = parseInt(timeSlider.value) - 1;
        if (newFrame >= 0) {
            timeSlider.value = newFrame;
            videoPlayer.currentTime = newFrame / fps;
        }
    });
});

function swapVideo(clickedVideo, position) {
    const mainVideo = document.getElementById('video-player');
    const mainVideoSource = mainVideo.querySelector('source').src;
    const clickedVideoSource = clickedVideo.querySelector('source').src;

    // Set up movement transition effect
    mainVideo.style.transition = 'transform 0.5s ease, opacity 0.5s ease, box-shadow 0.5s ease';
    clickedVideo.style.transition = 'transform 0.5s ease, opacity 0.5s ease';

    // Apply horizontal and upward movement effect with scaling, opacity animation, and box-shadow glow
    if (position === 'left') {
        mainVideo.style.transform = 'translateX(-97%) translateY(9%) scale(0.51)';
        mainVideo.style.opacity = '0.5';
        mainVideo.style.boxShadow = '0 0 0px 0px #A5A692'; // Reduce glow during transition
        clickedVideo.style.transform = 'translateX(190%) translateY(-67%) scale(1.95)';
        clickedVideo.style.boxShadow = '0 0 10px 2px #A5A692'; // Increase glow during transition
        clickedVideo.style.opacity = '1';
    } else {
        mainVideo.style.transform = 'translateX(97%) translateY(9%) scale(0.51)';
        mainVideo.style.opacity = '0.5';
        mainVideo.style.boxShadow = '0 0 0px 0px #A5A692'; // Reduce glow during transition
        clickedVideo.style.transform = 'translateX(-190%) translateY(-67%) scale(1.95)';
        clickedVideo.style.boxShadow = '0 0 10px 2px #A5A692'; // Increase glow during transition
        clickedVideo.style.opacity = '1';
    }

    // Maintain position after swap
    setTimeout(() => {
        mainVideo.style.transform = 'translateX(0) translateY(0) scale(1)';
        mainVideo.style.opacity = '1';
        mainVideo.style.boxShadow = '0 0 20px 5px #A5A692'; // Restore original glow
        clickedVideo.style.transform = 'translateX(0) translateY(0) scale(1)';
        clickedVideo.style.opacity = '0.3';
        mainVideo.style.transition = 'transform 0.01s linear, opacity 0.001s linear, box-shadow 0s linear';  // Faster return transition
        clickedVideo.style.transition = 'transform 0.01s linear, opacity 0.001s linear';  // Faster return transition
    }, 500);

    setTimeout(() => {
        // Swap the video sources
        mainVideo.querySelector('source').src = clickedVideoSource;
        clickedVideo.querySelector('source').src = mainVideoSource;

        // Reset transformations
        mainVideo.style.transform = 'translateX(0) translateY(0) scale(1)';
        clickedVideo.style.transform = 'translateX(0) translateY(-50%) scale(1)';

        // Load the new sources
        mainVideo.load();
        clickedVideo.load();
    }, 500);
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = sectionId === 'home' ? 'block' : 'flex';
}

// Function to show different sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = sectionId === 'home' ? 'block' : 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('#home .home-content img');
    const welcomeText = document.querySelector('.welcome-text');
    const particlesContainer = document.getElementById('particles');
    let particles = [];

    // Get the position and height of the welcome text
    const textRect = welcomeText.getBoundingClientRect();

    // Calculate initial position below the welcome text
    let position = {
        x: window.innerWidth / 2 - logo.clientWidth / 2,
        y: textRect.bottom + 10 // 10 pixels below the text
    };

    let velocity = { x: 0, y: 0 }; // Start from rest
    let gravity = 0.5;
    let bounce = -0.7;
    let isDragging = false;
    let lastMousePosition = { x: 0, y: 0 };
    let dragStartTime = 0;
    let dragStartPosition = { x: 0, y: 0 };
    let rotation = 0; // Initialize rotation angle
    let angularVelocity = 0; // Initialize angular velocity

    // Prevent default drag behavior
    logo.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // **Create Particles**
    function createParticles() {
        const numParticles = 100; // Adjusted the number of particles
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random size between 3px and 5px
            const size = Math.random() * 2 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random position
            const particleX = Math.random() * (window.innerWidth - size);
            const particleY = Math.random() * (window.innerHeight - size);

            // Set position
            particle.style.left = `${particleX}px`;
            particle.style.top = `${particleY}px`;

            // Add particle to the container
            particlesContainer.appendChild(particle);

            // Add particle to the array with position data
            particles.push({
                element: particle,
                x: particleX,
                y: particleY,
                width: size,
                height: size,
            });
        }
    }

    createParticles();

    function animateLogo() {
        if (!isDragging) {
            velocity.y += gravity;
            position.x += velocity.x;
            position.y += velocity.y;

            // Apply friction to slow down over time
            velocity.x *= 0.99;
            velocity.y *= 0.99;
            angularVelocity *= 0.99; // Apply friction to angular velocity

            // Bounce off walls
            if (position.x < 0) {
                position.x = 0;
                velocity.x *= bounce;
                angularVelocity *= bounce; // Reverse rotation direction
            } else if (position.x > window.innerWidth - logo.clientWidth) {
                position.x = window.innerWidth - logo.clientWidth;
                velocity.x *= bounce;
                angularVelocity *= bounce; // Reverse rotation direction
            }

            if (position.y < 0) {
                position.y = 0;
                velocity.y *= bounce;
            } else if (position.y > window.innerHeight - logo.clientHeight) {
                position.y = window.innerHeight - logo.clientHeight;
                velocity.y *= bounce;
            }

            // Update rotation based on angular velocity
            rotation += angularVelocity;
        }

        // Apply transformations
        logo.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`;

        // Collision detection with welcome text
        checkCollisionWithText();

        // Collision detection with particles
        checkCollisionWithParticles();

        requestAnimationFrame(animateLogo);
    }

    function checkCollisionWithText() {
        // Get bounding rectangles
        const logoRect = logo.getBoundingClientRect();
        const textRect = welcomeText.getBoundingClientRect();

        // Check for collision
        if (
            logoRect.right > textRect.left &&
            logoRect.left < textRect.right &&
            logoRect.bottom > textRect.top &&
            logoRect.top < textRect.bottom
        ) {
            // Collision detected, resolve collision

            // Determine overlap on each axis
            const overlapX = Math.min(logoRect.right, textRect.right) - Math.max(logoRect.left, textRect.left);
            const overlapY = Math.min(logoRect.bottom, textRect.bottom) - Math.max(logoRect.top, textRect.top);

            // Adjust position based on the smallest overlap
            if (overlapX < overlapY) {
                // Horizontal collision
                if (velocity.x > 0) {
                    position.x -= overlapX;
                } else {
                    position.x += overlapX;
                }
                velocity.x *= bounce; // Reverse and reduce velocity
                angularVelocity *= bounce; // Reverse rotation direction
            } else {
                // Vertical collision
                if (velocity.y > 0) {
                    position.y -= overlapY;
                } else {
                    position.y += overlapY;
                }
                velocity.y *= bounce; // Reverse and reduce velocity
            }
        }
    }

    function checkCollisionWithParticles() {
        const logoRect = logo.getBoundingClientRect();

        particles = particles.filter(particle => {
            const particleRect = particle.element.getBoundingClientRect();

            // Check for collision
            if (
                logoRect.right > particleRect.left &&
                logoRect.left < particleRect.right &&
                logoRect.bottom > particleRect.top &&
                logoRect.top < particleRect.bottom
            ) {
                // Collision detected, play explosion animation
                particle.element.classList.add('explode');

                // Generate small particles
                createExplosionParticles(particleRect.left + particleRect.width / 2, particleRect.top + particleRect.height / 2);

                // Remove the particle after the animation completes
                particle.element.addEventListener('animationend', () => {
                    particle.element.parentNode.removeChild(particle.element);
                }, { once: true });

                return false; // Remove from particles array
            } else {
                return true; // Keep in particles array
            }
        });
    }

    function createExplosionParticles(x, y) {
        const numSmallParticles = 10; // Number of small particles to generate
        for (let i = 0; i < numSmallParticles; i++) {
            const smallParticle = document.createElement('div');
            smallParticle.classList.add('small-particle');

            // Set initial position
            smallParticle.style.left = `${x}px`;
            smallParticle.style.top = `${y}px`;

            // Random direction and distance
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 50 + 20; // Random distance between 20 and 70 pixels
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            // Set custom properties for animation
            smallParticle.style.setProperty('--dx', `${dx}px`);
            smallParticle.style.setProperty('--dy', `${dy}px`);

            // Add animation
            smallParticle.style.animation = `particle-move 0.5s forwards`;

            // Add to the particles container
            particlesContainer.appendChild(smallParticle);

            // Remove the small particle after the animation completes
            smallParticle.addEventListener('animationend', () => {
                smallParticle.parentNode.removeChild(smallParticle);
            });
        }
    }

    logo.addEventListener('mousedown', (e) => {
        isDragging = true;
        logo.style.cursor = 'grabbing';
        velocity = { x: 0, y: 0 };
        angularVelocity = 0; // Stop rotation during drag
        lastMousePosition = { x: e.clientX, y: e.clientY };
        dragStartTime = Date.now();
        dragStartPosition = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - lastMousePosition.x;
            const dy = e.clientY - lastMousePosition.y;
            position.x += dx;
            position.y += dy;

            // Update rotation based on horizontal mouse movement
            rotation += dx * 0.5; // Adjust multiplier for sensitivity

            lastMousePosition = { x: e.clientX, y: e.clientY };

            // Keep the logo within the window boundaries
            position.x = Math.max(0, Math.min(position.x, window.innerWidth - logo.clientWidth));
            position.y = Math.max(0, Math.min(position.y, window.innerHeight - logo.clientHeight));

            // Apply transformations
            logo.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`;
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            isDragging = false;
            logo.style.cursor = 'grab';

            const dragDuration = (Date.now() - dragStartTime) / 1000; // in seconds
            const dx = e.clientX - dragStartPosition.x;
            const dy = e.clientY - dragStartPosition.y;

            velocity.x = (dx / dragDuration) * 0.05; // Adjust the multiplier for sensitivity
            velocity.y = (dy / dragDuration) * 0.05;

            // Set angular velocity based on the horizontal velocity
            angularVelocity = velocity.x * 2; // Adjust multiplier for rotation speed
        }
    });

    window.addEventListener('resize', () => {
        // Adjust position if window is resized
        position.x = Math.max(0, Math.min(position.x, window.innerWidth - logo.clientWidth));
        position.y = Math.max(0, Math.min(position.y, window.innerHeight - logo.clientHeight));
    });

    // Set initial position and transformation
    logo.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`;

    animateLogo();
});