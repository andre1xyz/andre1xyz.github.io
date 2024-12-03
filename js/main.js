// Moved 'videos' to global scope
const videos = {
    cartoon: {
        src: 'videos/cartoon.mp4',
        title: 'Cartoon'
    },
    vfx: {
        src: 'videos/vfx.mp4',
        title: 'VFX'
    }
};

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
    const videoTitle = document.getElementById('video-title');

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
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            const modelName = item.getAttribute('data-model');
            showSection('viewport', modelName);
        });
    });

    const loadViewportButton = document.getElementById('load-viewport-button');
    const loadViewportContainer = document.getElementById('load-viewport-container');
    const unityContainer = document.getElementById('unity-container');
    let unityInstance = null;
    let isUnityLoaded = false;

    loadViewportButton.addEventListener('click', () => {
        if (!isUnityLoaded) {
            loadUnityInstance();
            isUnityLoaded = true;
            loadViewportContainer.style.display = 'none';
        }
    });

    function loadUnityInstance() {
        const canvas = document.querySelector("#unity-canvas");
        const buildUrl = "Build";
        const loaderUrl = buildUrl + "/Viewport_Build.loader.js";
        const config = {
            arguments: [],
            dataUrl: buildUrl + "/Viewport_Build.data",
            frameworkUrl: buildUrl + "/Viewport_Build.framework.js",
            codeUrl: buildUrl + "/Viewport_Build.wasm",
            streamingAssetsUrl: "StreamingAssets",
            companyName: "andre1xyz",
            productName: "Viewport",
            productVersion: "0.1.0",
            showBanner: unityShowBanner,
        };

        const loadingBar = document.querySelector("#unity-loading-bar");
        loadingBar.style.display = "block";

        const script = document.createElement("script");
        script.src = loaderUrl;
        script.onload = () => {
            createUnityInstance(canvas, config, (progress) => {
                document.querySelector("#unity-progress-bar-full").style.width = 100 * progress + "%";
            }).then((instance) => {
                unityInstance = instance;
                loadingBar.style.display = "none";
                document.querySelector("#unity-fullscreen-button").onclick = () => {
                    unityInstance.SetFullscreen(1);
                };
            }).catch((message) => {
                alert(message);
            });
        };

        document.body.appendChild(script);
    }

    function unloadUnityInstance() {
        if (unityInstance) {
            unityInstance.Quit().then(() => {
                unityInstance = null;
                isUnityLoaded = false;
            });
        }
    }

    function show3DSection() {
        loadViewportContainer.style.display = 'flex'; // Show the button again
    }

    // Example of handling section changes
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            const targetSection = event.target.getAttribute('data-target');
            if (targetSection === '3D') {
                show3DSection();
            } else {
                unloadUnityInstance();
            }
        });
    });

    function unityShowBanner(msg, type) {
        const warningBanner = document.querySelector("#unity-warning");
        function updateBannerVisibility() {
            warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        const div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.style = 'background: red; padding: 10px;';
        else {
            if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
            setTimeout(function() {
                warningBanner.removeChild(div);
                updateBannerVisibility();
            }, 5000);
        }
        updateBannerVisibility();
    }

});

function swapVideo(clickedVideo, position) {
    const mainVideo = document.getElementById('video-player');
    const videoTitle = document.getElementById('video-title');
    const mainVideoSource = mainVideo.querySelector('source');
    const clickedVideoSource = clickedVideo.querySelector('source');

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
        const tempSrc = mainVideoSource.getAttribute('src');
        mainVideoSource.setAttribute('src', clickedVideoSource.getAttribute('src'));
        clickedVideoSource.setAttribute('src', tempSrc);

        // Swap data-type attributes
        const mainVideoType = mainVideo.getAttribute('data-type');
        const clickedVideoType = clickedVideo.getAttribute('data-type');
        mainVideo.setAttribute('data-type', clickedVideoType);
        clickedVideo.setAttribute('data-type', mainVideoType);

        // Update the video title based on the main video's new data-type
        const newMainVideoType = mainVideo.getAttribute('data-type');
        if (videos[newMainVideoType]) {
            videoTitle.textContent = videos[newMainVideoType].title;
        } else {
            videoTitle.textContent = 'Unknown Title';
        }

        // Reset transformations
        mainVideo.style.transform = 'translateX(0) translateY(0) scale(1)';
        clickedVideo.style.transform = 'translateX(0) translateY(-50%) scale(1)';

        // Load the new sources
        mainVideo.load();
        clickedVideo.load();

        // Optionally, play the main video
        mainVideo.play();
    }, 500);
}


let isThreeInitialized = false;

function showSection(sectionId, modelName = null) {
    console.log(`showSection called with sectionId: ${sectionId}, modelName: ${modelName}`);

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
        targetSection.style.display = sectionId === 'home' ? 'block' : 'flex';
    } else {
        console.error(`Section with ID '${sectionId}' not found.`);
        return;
    }

    if (sectionId === 'viewport') {
            document.getElementById('character-grid').style.display = 'flex';
            document.getElementById('loading-indicator').style.display = 'none';
            document.getElementById('bottom-buttons').style.display = 'none';
            const characterGrid = document.getElementById('character-grid');
            const loadingIndicator = document.getElementById('loading-indicator');
            const bottomButtons = document.getElementById('bottom-buttons');
    
            if (characterGrid) characterGrid.style.display = 'flex';
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            if (bottomButtons) bottomButtons.style.display = 'none';
    //     if (!isThreeInitialized) {
    //         document.getElementById('character-grid').style.display = 'none';
    //         document.getElementById('loading-indicator').style.display = 'block';

    //         loadViewportJS(modelName, () => {
    //             document.getElementById('loading-indicator').style.display = 'none';
    //             document.getElementById('character-grid').style.display = 'none';
    
    //         });
    //     } 
    //     else {
    //         initializeViewport(modelName);
    //     }
    }
}

function loadSelected(modelName) {
    if (!isThreeInitialized) {

        loadViewportJS(modelName, () => {
            document.getElementById('loading-indicator').style.display = 'none';
            document.getElementById('character-grid').style.display = 'none';
            document.getElementById('bottom-buttons').style.display = 'block';

        });
        console.error(`Hola el '${modelName}' llamado.`);
    } else {
        initializeViewport(modelName);
    }
}

function loadViewportJS(modelName, callback) {
    if (isThreeInitialized) {
        initializeViewport(modelName);
        callback();
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'js/viewport.js'; // Ensure this path is correct
    script.type = 'module';
    script.onload = () => {
        isThreeInitialized = true;
        initializeViewport(modelName);
        callback();
    };
    script.onerror = () => {
        console.error('Failed to load viewport.js');
    };
    document.head.appendChild(script);
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


document.addEventListener('DOMContentLoaded', () => {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const projectsGrid = document.querySelector('.projects-grid');

    function loadProjects(category) {
        // Clear the grid
        projectsGrid.innerHTML = '';

        // Get the projects for the selected category
        const selectedProjects = projects[category];

        // Generate HTML for each project
        selectedProjects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.classList.add('project-item');

            // Optional: Add click event to open project details
            projectItem.addEventListener('click', () => {
                showProjectDetails(project);
            });

            projectItem.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="title">${project.title}</div>
            `;

            projectsGrid.appendChild(projectItem);
        });
    }

    // Add click event listeners to tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove 'active' class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add 'active' class to the clicked tab
            tab.classList.add('active');

            // Load the selected category projects
            const category = tab.getAttribute('data-category');
            loadProjects(category);
        });
    });

    // Load the default category (Feature Film) on page load
    loadProjects('feature-film');
});



// Function to display project details (optional)
function showProjectDetails(project) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const closeButton = document.querySelector('.close-button');

    modalTitle.textContent = project.title;
    modalImage.src = project.image;
    modalDescription.textContent = project.description || 'No description available.';

    modal.style.display = 'block';

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside of content
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

const projects = {
    'feature-film': [
        {
            title: 'Snow White - 2025',
            image: 'images/SnowWhite_Poster.jpg',
            description: 'A brief description of the project.',
            // Add more details if needed
        },
        // {
        //     title: 'Feature Film Project 2',
        //     image: 'images/feature-film2.jpg',
        // },
        // Add more projects
    ],
    'videogames': [
        {
            title: 'One Military Camp - 2022',
            image: 'images/OneMilitaryCamp_VT.png',
        },
        // {
        //     title: 'Videogame Project 2',
        //     image: 'images/videogame2.jpg',
        // },
        // Add more projects
    ],
    'tv-show': [
        {
            title: 'What if...? Season 2 - 2022',
            image: 'images/What_If...__season_2_poster.jpeg',
        },
        // {
        //     title: 'TV Show Project 2',
        //     image: 'images/tv-show2.jpg',
        // },
        // Add more projects
    ],
};