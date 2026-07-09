// Showreel library — add new years here when you upload reels
const showreelLibrary = {
    vfx: {
        2026: 'videos/vfx_2026.mp4',
        2025: 'videos/vfx.mp4'
    },
    cartoon: {
        2026: 'videos/cartoon_2026.mp4',
        2025: 'videos/cartoon.mp4'
    }
};


function getShowreelYears(type) {
    return Object.keys(showreelLibrary[type] || {})
        .map(Number)
        .sort((a, b) => b - a);
}

function getLatestShowreelYear(type) {
    const years = getShowreelYears(type);
    return years[0] ?? null;
}

function getShowreelSrc(type, year) {
    return showreelLibrary[type]?.[year] ?? null;
}

document.addEventListener('DOMContentLoaded', () => {
    const stardust1 = document.getElementById('stardust1');
    const stardust2 = document.getElementById('stardust2');
    const stardust3 = document.getElementById('stardust3');
    const stardust4 = document.getElementById('stardust4');
    const stardust5 = document.getElementById('stardust5');
    const playerShell = document.getElementById('player-shell');
    const videoPlayer = document.getElementById('video-player');
    const centerPlay = document.getElementById('center-play');
    const playPauseButton = document.getElementById('play-pause');
    const playIcon = document.getElementById('play-icon');
    const volumeSlider = document.getElementById('volume-slider');
    const muteButton = document.getElementById('mute');
    const muteIcon = document.getElementById('mute-icon');
    const timeSlider = document.getElementById('time-slider');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    const fullscreenButton = document.getElementById('fullscreen-button');
    const fullscreenIcon = document.getElementById('fullscreen-icon');
    const reelTabs = document.querySelectorAll('.reel-tab');
    const yearSwitcher = document.getElementById('year-switcher');

    if (videoPlayer && playerShell) {
        initShowreelPlayer({
            playerShell,
            videoPlayer,
            centerPlay,
            playPauseButton,
            playIcon,
            volumeSlider,
            muteButton,
            muteIcon,
            timeSlider,
            currentTimeEl,
            durationTimeEl,
            fullscreenButton,
            fullscreenIcon,
            reelTabs,
            yearSwitcher
        });
    }
    initStardustParallax(stardust1, stardust2, stardust3, stardust4, stardust5);
});

function initStardustParallax(...layers) {
    const stardustLayers = layers.filter(Boolean);
    if (!stardustLayers.length) {
        return;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    function parallaxEnabled() {
        return !motionQuery.matches && !mobileQuery.matches;
    }

    function applyParallax(clientX, clientY) {
        const xOffset = (clientX / window.innerWidth - 0.5) * 2;
        const yOffset = (clientY / window.innerHeight - 0.5) * 2;
        const scales = [1.4, 1.3, 1.2, 1.1, 1];
        const strengths = [10, 20, 30, 40, 50];

        stardustLayers.forEach((layer, index) => {
            layer.style.transform = `translate3d(${xOffset * -strengths[index]}px, ${yOffset * -strengths[index]}px, 0) scale(${scales[index]})`;
        });
    }

    function resetParallax() {
        stardustLayers.forEach((layer) => {
            layer.style.removeProperty('transform');
        });
    }

    function syncParallaxState() {
        if (!parallaxEnabled()) {
            resetParallax();
        } else {
            applyParallax(window.innerWidth / 2, window.innerHeight / 2);
        }
    }

    syncParallaxState();

    let lastClientX = null;
    let lastClientY = null;

    document.addEventListener('mousemove', (e) => {
        if (!parallaxEnabled()) {
            return;
        }

        // Ignore the first mouse event on load (browser reports cursor position and shifts layout).
        if (lastClientX === null) {
            lastClientX = e.clientX;
            lastClientY = e.clientY;
            applyParallax(window.innerWidth / 2, window.innerHeight / 2);
            return;
        }

        if (e.clientX === lastClientX && e.clientY === lastClientY) {
            return;
        }

        lastClientX = e.clientX;
        lastClientY = e.clientY;
        applyParallax(e.clientX, e.clientY);
    });

    const handleMotionPreferenceChange = () => {
        lastClientX = null;
        lastClientY = null;
        syncParallaxState();
    };

    motionQuery.addEventListener('change', handleMotionPreferenceChange);
    mobileQuery.addEventListener('change', handleMotionPreferenceChange);
    window.addEventListener('resize', () => {
        if (!parallaxEnabled()) {
            resetParallax();
            return;
        }
        applyParallax(lastClientX ?? window.innerWidth / 2, lastClientY ?? window.innerHeight / 2);
    });
}

function formatVideoTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '0:00';
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function initShowreelPlayer(els) {
    const {
        playerShell,
        videoPlayer,
        centerPlay,
        playPauseButton,
        playIcon,
        volumeSlider,
        muteButton,
        muteIcon,
        timeSlider,
        currentTimeEl,
        durationTimeEl,
        fullscreenButton,
        fullscreenIcon,
        reelTabs,
        yearSwitcher
    } = els;

    const centerPlayIcon = centerPlay.querySelector('i');
    const source = videoPlayer.querySelector('source');
    let controlsHideTimer = null;
    let isScrubbing = false;
    let wasPlayingBeforeScrub = false;

    let currentType = videoPlayer.dataset.type || 'vfx';
    let currentYear = getLatestShowreelYear(currentType);
    let yearFallbackUsed = false;

    function renderYearSwitcher() {
        if (!yearSwitcher) {
            return;
        }

        const years = getShowreelYears(currentType);
        yearSwitcher.innerHTML = '';

        years.forEach((year) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'year-tab';
            button.dataset.year = String(year);
            button.textContent = String(year);
            button.setAttribute('aria-pressed', year === currentYear ? 'true' : 'false');
            if (year === currentYear) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => switchYear(year));
            yearSwitcher.appendChild(button);
        });
    }

    function setActiveReelTab(type) {
        reelTabs.forEach((tab) => {
            const active = tab.dataset.type === type;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }

    function loadCurrentReel({ resume = false } = {}) {
        const src = getShowreelSrc(currentType, currentYear);
        if (!src || !source) {
            return;
        }

        source.src = src;
        videoPlayer.dataset.type = currentType;
        videoPlayer.dataset.year = String(currentYear);
        videoPlayer.load();
        updatePlayState();
        renderYearSwitcher();

        if (resume) {
            videoPlayer.play().catch(() => {});
        }
    }

    function updatePlayState() {
        const playing = !videoPlayer.paused && !videoPlayer.ended;
        playerShell.classList.toggle('is-playing', playing);
        playerShell.classList.toggle('is-paused', !playing);
        const iconClass = playing ? 'fas fa-pause' : 'fas fa-play';
        playIcon.className = iconClass;
        centerPlayIcon.className = iconClass;
        playPauseButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
        centerPlay.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    }

    function updateMuteIcon() {
        if (videoPlayer.muted || videoPlayer.volume === 0) {
            muteIcon.className = 'fas fa-volume-mute';
        } else if (videoPlayer.volume < 0.5) {
            muteIcon.className = 'fas fa-volume-down';
        } else {
            muteIcon.className = 'fas fa-volume-up';
        }
    }

    function updateTimeDisplay() {
        currentTimeEl.textContent = formatVideoTime(videoPlayer.currentTime);
        durationTimeEl.textContent = formatVideoTime(videoPlayer.duration);

        if (Number.isFinite(videoPlayer.duration) && videoPlayer.duration > 0) {
            timeSlider.max = String(videoPlayer.duration);
        }

        if (!isScrubbing) {
            timeSlider.value = String(videoPlayer.currentTime);
        }
    }

    function togglePlay() {
        if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play().catch(() => {});
        } else {
            videoPlayer.pause();
        }
    }

    function revealControls() {
        playerShell.classList.add('show-controls');
        clearTimeout(controlsHideTimer);
        if (!videoPlayer.paused) {
            controlsHideTimer = setTimeout(() => {
                playerShell.classList.remove('show-controls');
            }, 2800);
        }
    }

    function switchYear(year) {
        if (year === currentYear) {
            return;
        }

        const wasPlaying = !videoPlayer.paused;
        currentYear = year;
        loadCurrentReel({ resume: wasPlaying });
    }

    function switchReel(type) {
        if (!showreelLibrary[type] || currentType === type) {
            return;
        }

        const wasPlaying = !videoPlayer.paused;
        currentType = type;

        const years = getShowreelYears(type);
        if (!years.includes(currentYear)) {
            currentYear = years[0];
        }

        setActiveReelTab(type);
        loadCurrentReel({ resume: wasPlaying });
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        }

        if (playerShell.requestFullscreen) {
            playerShell.requestFullscreen();
        } else if (playerShell.webkitRequestFullscreen) {
            playerShell.webkitRequestFullscreen();
        } else if (playerShell.msRequestFullscreen) {
            playerShell.msRequestFullscreen();
        }
    }

    function updateFullscreenIcon() {
        const isFullscreen = Boolean(document.fullscreenElement);
        fullscreenIcon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
        fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Fullscreen');
    }

    function beginScrub() {
        if (isScrubbing) {
            return;
        }

        isScrubbing = true;
        wasPlayingBeforeScrub = !videoPlayer.paused;
        if (wasPlayingBeforeScrub) {
            videoPlayer.pause();
        }
        playerShell.classList.add('show-controls');
        clearTimeout(controlsHideTimer);
    }

    function scrubTo(value) {
        const duration = videoPlayer.duration;
        if (!Number.isFinite(duration) || duration <= 0) {
            return;
        }

        const nextTime = Math.min(duration, Math.max(0, parseFloat(value)));
        videoPlayer.currentTime = nextTime;
        currentTimeEl.textContent = formatVideoTime(nextTime);
    }

    function endScrub() {
        if (!isScrubbing) {
            return;
        }

        isScrubbing = false;
        if (wasPlayingBeforeScrub) {
            videoPlayer.play().catch(() => {});
        }
        wasPlayingBeforeScrub = false;
        updateTimeDisplay();
    }

    videoPlayer.controls = false;
    videoPlayer.disableRemotePlayback = true;
    playerShell.classList.add('is-paused');

    setActiveReelTab(currentType);
    loadCurrentReel();

    playPauseButton.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });
    centerPlay.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    volumeSlider.addEventListener('input', () => {
        videoPlayer.volume = parseFloat(volumeSlider.value);
        if (videoPlayer.volume > 0) {
            videoPlayer.muted = false;
        }
        updateMuteIcon();
    });

    muteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        videoPlayer.muted = !videoPlayer.muted;
        if (!videoPlayer.muted && videoPlayer.volume === 0) {
            videoPlayer.volume = 0.5;
            volumeSlider.value = 0.5;
        }
        updateMuteIcon();
    });

    // 'input' fires continuously while dragging/clicking (mouse, touch, or keyboard),
    // 'change' fires once when the interaction ends — this covers every input method
    // without needing to juggle separate mouse/pointer/touch listeners.
    timeSlider.addEventListener('input', () => {
        beginScrub();
        scrubTo(timeSlider.value);
    });
    timeSlider.addEventListener('change', () => {
        scrubTo(timeSlider.value);
        endScrub();
    });
    timeSlider.addEventListener('click', (e) => e.stopPropagation());

    const playerOverlay = document.getElementById('player-overlay');
    if (playerOverlay) {
        playerOverlay.addEventListener('click', (e) => e.stopPropagation());
    }

    fullscreenButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFullscreen();
    });
    videoPlayer.addEventListener('dblclick', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenIcon);

    reelTabs.forEach((tab) => {
        tab.addEventListener('click', () => switchReel(tab.dataset.type));
    });

    videoPlayer.addEventListener('loadedmetadata', () => {
        yearFallbackUsed = false;
        updateTimeDisplay();
    });
    videoPlayer.addEventListener('durationchange', updateTimeDisplay);
    videoPlayer.addEventListener('error', () => {
        if (yearFallbackUsed) {
            return;
        }

        const years = getShowreelYears(currentType);
        const fallbackYear = years.find((year) => year < currentYear);
        if (!fallbackYear) {
            return;
        }

        yearFallbackUsed = true;
        currentYear = fallbackYear;
        loadCurrentReel();
    });
    videoPlayer.addEventListener('timeupdate', updateTimeDisplay);
    videoPlayer.addEventListener('play', () => {
        updatePlayState();
        revealControls();
    });
    videoPlayer.addEventListener('pause', () => {
        updatePlayState();
        playerShell.classList.add('show-controls');
        clearTimeout(controlsHideTimer);
    });
    videoPlayer.addEventListener('ended', updatePlayState);

    playerShell.addEventListener('mousemove', revealControls);
    playerShell.addEventListener('touchstart', revealControls, { passive: true });

    updateMuteIcon();
    updatePlayState();
    updateTimeDisplay();
}

window.switchReel = function switchReel(type) {
    const videoPlayer = document.getElementById('video-player');
    if (!videoPlayer) {
        return;
    }
    const tab = document.querySelector(`.reel-tab[data-type="${type}"]`);
    if (tab) {
        tab.click();
    }
};

let activeSectionId = 'home';

function updateNavActive(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkSection = link.getAttribute('data-section');
        link.classList.toggle('active', linkSection === sectionId);
    });
}

function showSection(sectionId) {
    if (sectionId === activeSectionId) {
        return;
    }

    const sections = document.querySelectorAll('.section');
    const targetSection = document.getElementById(sectionId);

    if (!targetSection) {
        console.error(`Section with ID '${sectionId}' not found.`);
        return;
    }

    sections.forEach(section => {
        section.classList.remove('section-visible');
        section.style.display = 'none';
    });

    targetSection.style.display = sectionId === 'home' ? 'block' : 'flex';
    requestAnimationFrame(() => {
        targetSection.classList.add('section-visible');
    });

    activeSectionId = sectionId;
    updateNavActive(sectionId);
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
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.classList.add('section-visible');
    }
    updateNavActive('home');

    const categoryTabs = document.querySelectorAll('.category-tab');
    const projectsGrid = document.querySelector('.projects-grid');

    function getProjectThumbnailHTML(project) {
        if (project.image) {
            const iconClass = project.icon || 'fas fa-film';
            return `
                <div class="project-thumb">
                    <img src="${project.image}" alt="${project.title}" loading="lazy" onerror="handleProjectImageError(this, '${iconClass}')">
                </div>
            `;
        }

        const iconClass = project.icon || 'fas fa-film';
        return `
            <div class="project-thumb">
                <div class="project-icon-fallback" aria-hidden="true">
                    <i class="${iconClass}"></i>
                </div>
            </div>
        `;
    }

    function loadProjects(category) {
        projectsGrid.innerHTML = '';

        const selectedProjects = projects[category] || [];

        selectedProjects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.classList.add('project-item');

            projectItem.addEventListener('click', () => {
                showProjectDetails(project);
            });

            projectItem.innerHTML = `
                ${getProjectThumbnailHTML(project)}
                <div class="title">
                    ${project.title}
                    ${project.inProgress ? '<span class="project-badge">In Progress</span>' : ''}
                </div>
            `;

            projectsGrid.appendChild(projectItem);
        });
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');
            loadProjects(category);
        });
    });

    loadProjects('feature-film');
});

function handleLogoError(img) {
    img.style.display = 'none';
    const fallback = img.parentElement.querySelector('.experience-logo-fallback');
    if (fallback) {
        fallback.style.display = 'flex';
    }
}

function handleProjectImageError(img, iconClass) {
    const thumb = img.closest('.project-thumb');
    const fallback = document.createElement('div');
    fallback.className = 'project-icon-fallback';
    fallback.setAttribute('aria-hidden', 'true');
    fallback.innerHTML = `<i class="${iconClass}"></i>`;

    if (thumb) {
        thumb.innerHTML = '';
        thumb.appendChild(fallback);
    } else {
        img.replaceWith(fallback);
    }
}

function setModalMedia(project) {
    const modalMedia = document.getElementById('modal-media');
    modalMedia.innerHTML = '';

    if (project.image) {
        const img = document.createElement('img');
        img.id = 'modal-image';
        img.alt = project.title;
        img.loading = 'lazy';
        img.src = project.image;
        img.onerror = () => {
            modalMedia.innerHTML = `
                <div class="modal-icon-fallback" aria-hidden="true">
                    <i class="${project.icon || 'fas fa-film'}"></i>
                </div>
            `;
        };
        modalMedia.appendChild(img);
        return;
    }

    modalMedia.innerHTML = `
        <div class="modal-icon-fallback" aria-hidden="true">
            <i class="${project.icon || 'fas fa-film'}"></i>
        </div>
    `;
}

let modalListenersBound = false;

function showProjectDetails(project) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeButton = document.querySelector('.close-button');

    modalTitle.textContent = project.title;
    setModalMedia(project);

    if (project.descriptionHtml) {
        modalDescription.innerHTML = project.descriptionHtml;
    } else {
        modalDescription.textContent = project.description || 'No description available.';
    }

    modal.style.display = 'block';

    if (!modalListenersBound) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        modalListenersBound = true;
    }
}

const projects = {
    'feature-film': [
        {
            title: 'Prostokvashino - 2026',
            icon: 'fas fa-film',
            image: 'images/Prostokvashino_Poster.jpg',
            descriptionHtml: 'Lead Animator at Asymmetric Studios on this live-action/animated family feature. Led character animation for the CG animal cast in a modern adaptation of the classic Soviet cartoon. <a href="https://www.imdb.com/title/tt32019321/" target="_blank" rel="noopener noreferrer">View on IMDb</a>.',
        },
        {
            title: 'Prostokvashino in Winter',
            icon: 'fas fa-snowflake',
            inProgress: true,
            description: 'In progress. Lead Animator at Asymmetric Studios on the winter chapter of the Prostokvashino universe.',
        },
        {
            title: 'The Tale of Tsar Saltan - 2026',
            icon: 'fas fa-crown',
            image: 'images/TsarSaltan_Poster.jpg',
            descriptionHtml: 'Lead Animator at Asymmetric Studios on this Russian fantasy feature. Oversaw character animation for a large-scale production blending live action with visual effects. <a href="https://www.imdb.com/title/tt29952017/" target="_blank" rel="noopener noreferrer">View on IMDb</a>.',
        },
        {
            title: 'Little Brownie Kuzya 2 - 2026',
            icon: 'fas fa-hat-wizard',
            image: 'images/LittleBrownieKuzya2_Poster.jpg',
            descriptionHtml: 'Lead Animator at Asymmetric Studios on this Russian family fantasy sequel. <a href="https://www.imdb.com/title/tt32045419/" target="_blank" rel="noopener noreferrer">View on IMDb</a>.',
        },
        {
            title: 'Pinocchio and the Water of Life - 2026',
            icon: 'fas fa-tree',
            image: 'images/PinocchioWaterOfLife_Poster.jpg',
            descriptionHtml: 'Lead Animator at Asymmetric Studios on this animated fantasy feature directed by Viktor Lakisov. <a href="https://www.imdb.com/title/tt6986324/" target="_blank" rel="noopener noreferrer">View on IMDb</a>.',
        },
        {
            title: 'Snow White - 2025',
            image: 'images/SnowWhite_Poster.jpg',
            descriptionHtml: 'Worked on Snow White for over two years as a Senior Animator at MPC London. Animated animals and humanoid characters using mocap and keyframe techniques, and built personal tools to improve the animation workflow. Focused on realistic performances grounded in real-life reference. <a href="https://www.imdb.com/title/tt6208148/" target="_blank" rel="noopener noreferrer">View on IMDb</a>.',
        },
    ],
    'videogames': [
        {
            title: 'One Military Camp - 2022',
            image: 'images/OneMilitaryCamp_VT.png',
            description: 'Main Animator / Rigger at Abylight Studios in Barcelona for one year. Created keyframe humanoid animation, looping character and prop cycles, and adapted multiple characters to a shared rig.',
        },
    ],
    'tv-show': [
        {
            title: 'Manyunya - 2021',
            icon: 'fas fa-tv',
            image: 'images/Manyunya_Poster.jpg',
            descriptionHtml: 'Animator at Asymmetric Studios on this Russian comedy-adventure series based on the novels by Narine Abgaryan. <a href="https://www.imdb.com/title/tt27949758/" target="_blank" rel="noopener noreferrer">View on IMDb</a>.',
        },
        {
            title: 'What if...? Season 2 - 2022',
            image: 'images/What_If...__season_2_poster.jpeg',
            description: 'Animator at Stellar Creative Lab for a month on Marvel\'s What If...? Season 2. Keyframe humanoid animation in a more cartoony style.',
        },
    ],
    'commercial': [
        {
            title: 'NerdWallet - "Genius Beluga" (Super Bowl LIX, 2025)',
            icon: 'fas fa-whale',
            image: 'images/NerdWallet_GeniusBeluga.png',
            descriptionHtml: 'Freelance Senior 3D Animator on NerdWallet\'s first Super Bowl commercial. CG animation on the beluga whale mascot (agency Deutsch, dir. Tom Kuntz, voiced by Kieran Culkin). <a href="https://www.youtube.com/watch?v=JcZ5uXIjqE4" target="_blank" rel="noopener noreferrer">Watch the ad</a>.',
        },
    ],
};

