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

// Homepage grid — videos auto-loaded from videos/home/videos.json
// Run: node scripts/sync-home-videos.js  (after adding clips to videos/home/)
let homeShowcaseVideos = [];

const HOME_VIDEO_EXTENSIONS = /\.(mp4|mov|webm|m4v)$/i;

function titleFromVideoFilename(filename) {
    const base = filename.replace(/\.[^.]+$/, '');
    return base
        .replace(/__/g, ' — ')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function inferHomePreviewSrc(src) {
    const match = src.match(/^videos\/home\/(favorite|mid|low)\/([^/]+)$/);
    if (!match) {
        return null;
    }
    return `videos/home/${match[1]}/preview/${match[2]}`;
}

function normalizeHomeVideoEntry(entry) {
    const validSizes = new Set(['lg', 'md', 'sm']);

    if (typeof entry === 'string') {
        const filename = entry.split('/').pop();
        const src = entry.startsWith('videos/') ? entry : `videos/home/${entry}`;
        return {
            src,
            previewSrc: inferHomePreviewSrc(src),
            title: titleFromVideoFilename(filename),
            size: 'sm',
        };
    }

    if (entry && entry.src) {
        const filename = entry.src.split('/').pop();
        const size = validSizes.has(entry.size) ? entry.size : 'sm';
        return {
            src: entry.src,
            previewSrc: entry.previewSrc || inferHomePreviewSrc(entry.src),
            title: entry.title || titleFromVideoFilename(filename),
            size,
        };
    }

    return null;
}

function attachHomeTileVideo(video) {
    if (video.dataset.attached === 'true') {
        return;
    }

    const previewSrc = video.dataset.previewSrc;
    const fullSrc = video.dataset.fullSrc;
    if (!previewSrc && !fullSrc) {
        return;
    }

    video.dataset.attached = 'true';

    const setSource = (url) => {
        if (!url || video.src === url) {
            return;
        }
        video.src = url;
        video.load();
    };

    if (previewSrc) {
        setSource(previewSrc);
        video.addEventListener('error', function onPreviewError() {
            video.removeEventListener('error', onPreviewError);
            if (fullSrc && video.src !== fullSrc) {
                setSource(fullSrc);
            }
        });
        return;
    }

    setSource(fullSrc);
}

const HOME_TILE_LOAD_LIMIT = 4;
let homeTileLoadsActive = 0;
const homeTileLoadQueue = [];

function drainHomeTileLoadQueue() {
    while (homeTileLoadsActive < HOME_TILE_LOAD_LIMIT && homeTileLoadQueue.length) {
        const job = homeTileLoadQueue.shift();
        if (!job.video.isConnected) {
            continue;
        }

        homeTileLoadsActive += 1;
        attachHomeTileVideo(job.video);

        const release = () => {
            homeTileLoadsActive = Math.max(0, homeTileLoadsActive - 1);
            if (job.play) {
                job.video.play().catch(() => {});
            }
            drainHomeTileLoadQueue();
        };

        if (job.video.readyState >= 2) {
            release();
        } else {
            job.video.addEventListener('loadeddata', release, { once: true });
            job.video.addEventListener('error', release, { once: true });
        }
    }
}

function queueHomeTileVideo(video, play = true) {
    if (video.dataset.attached === 'true') {
        if (play) {
            video.play().catch(() => {});
        }
        return;
    }

    if (homeTileLoadQueue.some((job) => job.video === video)) {
        return;
    }

    homeTileLoadQueue.push({ video, play });
    drainHomeTileLoadQueue();
}

function parseHomeDirectoryListing(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const links = [...doc.querySelectorAll('a[href]')]
        .map((a) => decodeURIComponent(a.getAttribute('href') || ''))
        .filter((href) => HOME_VIDEO_EXTENSIONS.test(href) && !href.includes('/'));

    return [...new Set(links)]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((filename) => normalizeHomeVideoEntry(`videos/home/${filename}`))
        .filter(Boolean);
}

async function loadHomeShowcaseVideos() {
    try {
        const response = await fetch('videos/home/videos.json');
        if (response.ok) {
            const data = await response.json();
            const list = Array.isArray(data) ? data : data.videos;
            if (Array.isArray(list)) {
                // Order comes straight from videos.json — no shuffling, so the
                // layout is stable and controllable across reloads.
                return list.map(normalizeHomeVideoEntry).filter(Boolean);
            }
        }
    } catch {
        // manifest missing or blocked — try directory listing (local dev servers)
    }

    try {
        const response = await fetch('videos/home/');
        if (response.ok) {
            const html = await response.text();
            const fromListing = parseHomeDirectoryListing(html);
            if (fromListing.length) {
                return fromListing;
            }
        }
    } catch {
        // static hosts (e.g. GitHub Pages) cannot list directories
    }

    return [];
}

function getVideoMime(src) {
    if (src.endsWith('.mov')) {
        return 'video/quicktime';
    }
    if (src.endsWith('.webm')) {
        return 'video/webm';
    }
    return 'video/mp4';
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
    initHomeVideoGrid();
    initToolsImageLightbox();
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

// Shared control wiring used by both the Showreel player and the homepage
// video lightbox, so the play/pause/scrub/volume/fullscreen behavior (and
// its fixes) only need to live in one place.
function wireBasicVideoControls(refs) {
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
        fullscreenTarget
    } = refs;

    const centerPlayIcon = centerPlay ? centerPlay.querySelector('i') : null;
    const fsTarget = fullscreenTarget || playerShell;
    let controlsHideTimer = null;
    let isScrubbing = false;
    let wasPlayingBeforeScrub = false;

    function updatePlayState() {
        const playing = !videoPlayer.paused && !videoPlayer.ended;
        playerShell.classList.toggle('is-playing', playing);
        playerShell.classList.toggle('is-paused', !playing);
        const iconClass = playing ? 'fas fa-pause' : 'fas fa-play';
        if (playIcon) playIcon.className = iconClass;
        if (centerPlayIcon) centerPlayIcon.className = iconClass;
        if (playPauseButton) playPauseButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
        if (centerPlay) centerPlay.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    }

    function updateMuteIcon() {
        if (!muteIcon) return;
        if (videoPlayer.muted || videoPlayer.volume === 0) {
            muteIcon.className = 'fas fa-volume-mute';
        } else if (videoPlayer.volume < 0.5) {
            muteIcon.className = 'fas fa-volume-down';
        } else {
            muteIcon.className = 'fas fa-volume-up';
        }
    }

    function updateTimeDisplay() {
        if (currentTimeEl) currentTimeEl.textContent = formatVideoTime(videoPlayer.currentTime);
        if (durationTimeEl) durationTimeEl.textContent = formatVideoTime(videoPlayer.duration);

        if (timeSlider) {
            if (Number.isFinite(videoPlayer.duration) && videoPlayer.duration > 0) {
                timeSlider.max = String(videoPlayer.duration);
            }
            if (!isScrubbing) {
                timeSlider.value = String(videoPlayer.currentTime);
            }
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

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        }

        if (fsTarget.requestFullscreen) {
            fsTarget.requestFullscreen();
        } else if (fsTarget.webkitRequestFullscreen) {
            fsTarget.webkitRequestFullscreen();
        } else if (fsTarget.msRequestFullscreen) {
            fsTarget.msRequestFullscreen();
        }
    }

    function updateFullscreenIcon() {
        if (!fullscreenIcon) return;
        const isFullscreen = Boolean(document.fullscreenElement);
        fullscreenIcon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
        if (fullscreenButton) {
            fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Fullscreen');
        }
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
        if (currentTimeEl) currentTimeEl.textContent = formatVideoTime(nextTime);
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

    if (playPauseButton) {
        playPauseButton.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });
    }
    if (centerPlay) {
        centerPlay.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            videoPlayer.volume = parseFloat(volumeSlider.value);
            if (videoPlayer.volume > 0) {
                videoPlayer.muted = false;
            }
            updateMuteIcon();
        });
    }

    if (muteButton) {
        muteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            videoPlayer.muted = !videoPlayer.muted;
            if (!videoPlayer.muted && videoPlayer.volume === 0) {
                videoPlayer.volume = 0.5;
                if (volumeSlider) volumeSlider.value = 0.5;
            }
            updateMuteIcon();
        });
    }

    if (timeSlider) {
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
    }

    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFullscreen();
        });
    }
    videoPlayer.addEventListener('dblclick', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenIcon);

    videoPlayer.addEventListener('durationchange', updateTimeDisplay);
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

    return { updatePlayState, updateTimeDisplay, updateMuteIcon, revealControls, togglePlay };
}

function initShowreelPlayer(els) {
    const {
        playerShell,
        videoPlayer,
        reelTabs,
        yearSwitcher
    } = els;

    const source = videoPlayer.querySelector('source');
    let currentType = videoPlayer.dataset.type || 'vfx';
    let currentYear = getLatestShowreelYear(currentType);
    let yearFallbackUsed = false;

    playerShell.classList.add('is-paused');

    const controls = wireBasicVideoControls(els);

    const playerOverlay = document.getElementById('player-overlay');
    if (playerOverlay) {
        playerOverlay.addEventListener('click', (e) => e.stopPropagation());
    }

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
        controls.updatePlayState();
        renderYearSwitcher();

        if (resume) {
            videoPlayer.play().catch(() => {});
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

    reelTabs.forEach((tab) => {
        tab.addEventListener('click', () => switchReel(tab.dataset.type));
    });

    videoPlayer.addEventListener('loadedmetadata', () => {
        yearFallbackUsed = false;
    });
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

    setActiveReelTab(currentType);
    loadCurrentReel();
}

function initHomeVideoGrid() {
    const grid = document.getElementById('home-video-grid');
    if (!grid) {
        return;
    }

    loadHomeShowcaseVideos().then((videos) => {
        homeShowcaseVideos = videos;
        if (!homeShowcaseVideos.length) {
            return;
        }

        renderHomeVideoGrid(grid);
        initVideoLightbox();
    });
}

const HOME_DISC_TIER = {
    lg: { scaleMin: 1.08, scaleMax: 1.22, heightMul: 1.0 },
    md: { scaleMin: 0.76, scaleMax: 0.86, heightMul: 0.78 },
    sm: { scaleMin: 0.5, scaleMax: 0.6, heightMul: 0.55 },
};

function homeDiscDeterministicSeed(index, salt = 0) {
    return (((index + 1) * 2654435761 + salt * 1597334677) >>> 0) % 1000 / 1000;
}

function getHomeDiscBaseHeight(viewportWidth, viewportHeight) {
    return Math.max(52, Math.min(viewportWidth / 12, viewportHeight / 6.5));
}

function homeDiscScalePlacements(placements, packCenterX, packCenterY, clusterCenterX, clusterCenterY, fitScale) {
    return placements.map(({ entry, rect }) => {
        const tileCenterX = (rect.left + rect.right) / 2;
        const tileCenterY = (rect.top + rect.bottom) / 2;
        const finalCenterX = packCenterX + (tileCenterX - clusterCenterX) * fitScale;
        const finalCenterY = packCenterY + (tileCenterY - clusterCenterY) * fitScale;
        const scaledW = rect.width * fitScale;
        const scaledH = rect.height * fitScale;

        return {
            entry,
            rect: homeDiscRectFromCenter(finalCenterX, finalCenterY, scaledW, scaledH),
        };
    });
}

function homeDiscHasOverlap(rects, gap) {
    for (let i = 0; i < rects.length; i += 1) {
        for (let j = i + 1; j < rects.length; j += 1) {
            if (homeDiscRectsOverlap(rects[i], rects[j], gap)) {
                return true;
            }
        }
    }
    return false;
}

function getHomeDiscTileSize(index, size, baseHeight) {
    const tier = HOME_DISC_TIER[size] || HOME_DISC_TIER.sm;
    const scale = tier.scaleMin + homeDiscDeterministicSeed(index, 1) * (tier.scaleMax - tier.scaleMin);
    const aspect = 2.0 + homeDiscDeterministicSeed(index, 2) * 0.65;
    const height = baseHeight * tier.heightMul * scale;
    const width = height * aspect;
    return { w: width, h: height };
}

function homeDiscRectFromCenter(cx, cy, width, height) {
    return {
        left: cx - width / 2,
        top: cy - height / 2,
        right: cx + width / 2,
        bottom: cy + height / 2,
        width,
        height,
    };
}

function homeDiscRectsOverlap(a, b, gap) {
    return !(
        a.right + gap <= b.left
        || b.right + gap <= a.left
        || a.bottom + gap <= b.top
        || b.bottom + gap <= a.top
    );
}

function homeDiscEllipseDist(x, y, cx, cy, aspect) {
    return Math.hypot((x - cx) / aspect, y - cy);
}

function* homeDiscPlacementCandidates(width, height, placedRects, cx, cy, aspect, viewportWidth, viewportHeight) {
    yield { x: cx, y: cy, dist: 0 };

    const step = Math.max(2, Math.min(width, height) * 0.08);
    const maxRadius = Math.min(viewportWidth, viewportHeight) * 0.58;
    const boundX = maxRadius * aspect;
    const boundY = maxRadius;
    const gridPoints = [];

    for (let y = -boundY; y <= boundY; y += step) {
        for (let x = -boundX; x <= boundX; x += step) {
            const dist = Math.hypot(x / aspect, y);
            if (dist <= maxRadius) {
                gridPoints.push({
                    x: cx + x,
                    y: cy + y,
                    dist,
                });
            }
        }
    }

    gridPoints.sort((a, b) => a.dist - b.dist);

    const snapPoints = [];
    placedRects.forEach((rect) => {
        [
            { x: rect.right + width / 2, y: rect.top + rect.height / 2 },
            { x: rect.left - width / 2, y: rect.top + rect.height / 2 },
            { x: rect.left + rect.width / 2, y: rect.top - height / 2 },
            { x: rect.left + rect.width / 2, y: rect.bottom + height / 2 },
            { x: rect.right + width / 2, y: rect.top },
            { x: rect.right + width / 2, y: rect.bottom },
            { x: rect.left - width / 2, y: rect.top },
            { x: rect.left - width / 2, y: rect.bottom },
            { x: rect.left, y: rect.top - height / 2 },
            { x: rect.right, y: rect.top - height / 2 },
            { x: rect.left, y: rect.bottom + height / 2 },
            { x: rect.right, y: rect.bottom + height / 2 },
        ].forEach((anchor) => {
            snapPoints.push({
                x: anchor.x,
                y: anchor.y,
                dist: homeDiscEllipseDist(anchor.x, anchor.y, cx, cy, aspect),
            });
        });
    });

    snapPoints.sort((a, b) => a.dist - b.dist);

    for (const point of snapPoints) {
        yield point;
    }
    for (const point of gridPoints) {
        yield point;
    }
}

function findHomeDiscTilePosition(width, height, placedRects, cx, cy, gap, viewportWidth, viewportHeight) {
    const aspect = viewportWidth / viewportHeight;

    for (const point of homeDiscPlacementCandidates(
        width,
        height,
        placedRects,
        cx,
        cy,
        aspect,
        viewportWidth,
        viewportHeight
    )) {
        const candidate = homeDiscRectFromCenter(point.x, point.y, width, height);
        const collides = placedRects.some((rect) => homeDiscRectsOverlap(candidate, rect, gap));
        if (!collides) {
            return candidate;
        }
    }

    return null;
}

function sortHomeDiscEntries(baseEntries) {
    const tiers = { lg: [], md: [], sm: [] };
    baseEntries.forEach((entry) => {
        const bucket = tiers[entry.size] || tiers.sm;
        bucket.push(entry);
    });

    return [...tiers.lg, ...tiers.md, ...tiers.sm].map((entry, index) => ({
        entry,
        index,
    }));
}

function buildHomeDiscPack(baseEntries, viewportWidth, viewportHeight) {
    const baseHeight = getHomeDiscBaseHeight(viewportWidth, viewportHeight);
    const packCenterX = viewportWidth / 2;
    const packCenterY = viewportHeight / 2;
    const placedRects = [];
    const placements = [];
    const packGap = 3;

    sortHomeDiscEntries(baseEntries).forEach(({ entry, index }) => {
        const tileDims = getHomeDiscTileSize(index, entry.size, baseHeight);
        const rect = findHomeDiscTilePosition(
            tileDims.w,
            tileDims.h,
            placedRects,
            packCenterX,
            packCenterY,
            packGap,
            viewportWidth,
            viewportHeight
        );
        if (!rect) {
            return;
        }
        placedRects.push(rect);
        placements.push({ entry, rect });
    });

    if (!placements.length) {
        return null;
    }

    let minLeft = Infinity;
    let minTop = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;

    placedRects.forEach((rect) => {
        minLeft = Math.min(minLeft, rect.left);
        minTop = Math.min(minTop, rect.top);
        maxRight = Math.max(maxRight, rect.right);
        maxBottom = Math.max(maxBottom, rect.bottom);
    });

    const clusterWidth = maxRight - minLeft;
    const clusterHeight = maxBottom - minTop;
    const clusterCenterX = (minLeft + maxRight) / 2;
    const clusterCenterY = (minTop + maxBottom) / 2;
    let fitScale = Math.min(
        viewportWidth / clusterWidth,
        viewportHeight / clusterHeight
    ) * 0.99;

    let scaledPlacements = homeDiscScalePlacements(
        placements,
        packCenterX,
        packCenterY,
        clusterCenterX,
        clusterCenterY,
        fitScale
    );

    while (
        homeDiscHasOverlap(scaledPlacements.map(({ rect }) => rect), packGap)
        && fitScale > 0.75
    ) {
        fitScale *= 0.98;
        scaledPlacements = homeDiscScalePlacements(
            placements,
            packCenterX,
            packCenterY,
            clusterCenterX,
            clusterCenterY,
            fitScale
        );
    }

    return {
        virtualW: viewportWidth,
        virtualH: viewportHeight,
        packAspect: viewportWidth / viewportHeight,
        packGap,
        scaledPlacements,
    };
}

function applyHomeDiscTileStyles(scaledPlacements) {
    scaledPlacements.forEach(({ entry, rect }) => {
        entry.tile.style.left = `${Math.round(rect.left)}px`;
        entry.tile.style.top = `${Math.round(rect.top)}px`;
        entry.tile.style.width = `${Math.round(rect.width)}px`;
        entry.tile.style.height = `${Math.round(rect.height)}px`;
    });
}

function fitHomeDiscStage(stage, grid, cache) {
    const gridWidth = grid.clientWidth;
    const gridHeight = grid.clientHeight;
    if (!gridWidth || !gridHeight || !cache) {
        return;
    }

    const scale = Math.min(
        gridWidth / cache.virtualW,
        gridHeight / cache.virtualH
    ) * 0.99;
    const offsetX = (gridWidth - cache.virtualW * scale) / 2;
    const offsetY = (gridHeight - cache.virtualH * scale) / 2;

    stage.style.width = `${cache.virtualW}px`;
    stage.style.height = `${cache.virtualH}px`;
    stage.style.left = `${offsetX}px`;
    stage.style.top = `${offsetY}px`;
    stage.style.transform = `scale(${scale})`;
}

// Full pack on first load / big aspect change. Resize only scales the stage
// wrapper (one transform) until resize settles, then optional repack.
function layoutHomeVideoDisc(grid, stage, baseEntries, { repack = false } = {}) {
    const viewportWidth = grid.clientWidth;
    const viewportHeight = grid.clientHeight;
    if (!viewportWidth || !viewportHeight || !baseEntries.length) {
        return;
    }

    const needsRepack = repack
        || !grid.__homeDiscCache
        || !grid.__homeDiscCache.scaledPlacements.length;

    if (needsRepack) {
        const cache = buildHomeDiscPack(baseEntries, viewportWidth, viewportHeight);
        if (!cache) {
            return;
        }
        grid.__homeDiscCache = cache;
        applyHomeDiscTileStyles(cache.scaledPlacements);
    }

    fitHomeDiscStage(stage, grid, grid.__homeDiscCache);
}

function createHomeVideoTile(item, index) {
    const size = item.size || 'sm';
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = `home-video-tile tile-${size}`;
    tile.setAttribute('aria-label', `Play ${item.title || 'video'}`);
    tile.dataset.index = String(index);

    const video = document.createElement('video');
    video.dataset.previewSrc = item.previewSrc || inferHomePreviewSrc(item.src) || '';
    video.dataset.fullSrc = item.src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.disablePictureInPicture = true;
    video.disableRemotePlayback = true;
    video.setAttribute('aria-hidden', 'true');
    video.addEventListener('error', () => {
        tile.remove();
    });

    const hint = document.createElement('span');
    hint.className = 'home-video-tile-hint';
    hint.innerHTML = '<i class="fas fa-expand" aria-hidden="true"></i>';
    tile.appendChild(video);
    tile.appendChild(hint);

    if (item.title) {
        const label = document.createElement('span');
        label.className = 'home-video-tile-label';
        label.textContent = item.title;
        tile.appendChild(label);
    }

    tile.addEventListener('click', () => {
        openVideoLightbox(index, tile.getBoundingClientRect());
    });

    return { tile, video, size };
}

function bindHomeGridResize(grid, stage, baseEntries) {
    if (grid.dataset.resizeBound === 'true') {
        return;
    }

    grid.dataset.resizeBound = 'true';

    let resizeRaf = 0;
    let resizeEndTimer = null;

    const syncLayoutFast = () => {
        layoutHomeVideoDisc(grid, stage, baseEntries, { repack: false });
    };

    const syncLayoutFull = () => {
        const width = grid.clientWidth;
        const height = grid.clientHeight;
        const aspect = width / height;
        const cachedAspect = grid.__homeDiscCache?.packAspect ?? aspect;
        const aspectDelta = Math.abs(aspect - cachedAspect);
        const sizeDelta = grid.__homeDiscCache
            ? Math.max(
                Math.abs(width - grid.__homeDiscCache.virtualW) / grid.__homeDiscCache.virtualW,
                Math.abs(height - grid.__homeDiscCache.virtualH) / grid.__homeDiscCache.virtualH
            )
            : 1;

        const shouldRepack = aspectDelta > 0.14 || sizeDelta > 0.28;
        layoutHomeVideoDisc(grid, stage, baseEntries, { repack: shouldRepack });
    };

    window.addEventListener('resize', () => {
        if (resizeRaf) {
            cancelAnimationFrame(resizeRaf);
        }
        resizeRaf = requestAnimationFrame(() => {
            syncLayoutFast();
            resizeRaf = 0;
        });

        clearTimeout(resizeEndTimer);
        resizeEndTimer = window.setTimeout(syncLayoutFull, 280);
    });
}

function renderHomeVideoGrid(grid) {
    grid.innerHTML = '';

    const stage = document.createElement('div');
    stage.className = 'home-video-grid-stage';
    grid.appendChild(stage);

    const tileVideos = [];
    let observer = null;

    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    const priority = Number(video.dataset.loadPriority || 99);
                    window.setTimeout(() => {
                        if (!video.isConnected) {
                            return;
                        }
                        queueHomeTileVideo(video, true);
                    }, priority * 35);
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.35, rootMargin: '0px' });
    }

    function watchVideo(video, loadPriority) {
        video.dataset.loadPriority = String(loadPriority);
        tileVideos.push(video);
        if (observer) {
            observer.observe(video);
        } else {
            queueHomeTileVideo(video, true);
        }
    }

    const baseEntries = homeShowcaseVideos.map((item, index) => {
        const entry = createHomeVideoTile(item, index);
        stage.appendChild(entry.tile);
        watchVideo(entry.video, index);
        return entry;
    });

    const syncLayout = () => {
        layoutHomeVideoDisc(grid, stage, baseEntries, { repack: true });
    };

    requestAnimationFrame(syncLayout);
    bindHomeGridResize(grid, stage, baseEntries);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            return;
        }
        tileVideos.forEach((video) => {
            if (video.isConnected && video.paused) {
                const rect = video.getBoundingClientRect();
                const inView = rect.bottom > 0 && rect.top < window.innerHeight;
                if (inView) {
                    queueHomeTileVideo(video, true);
                }
            }
        });
    });

    window.__resumeHomeVideoGrid = () => {
        tileVideos.forEach((video) => {
            if (!video.isConnected || !video.paused) {
                return;
            }
            const rect = video.getBoundingClientRect();
            const inView = rect.bottom > 0 && rect.top < window.innerHeight;
            if (inView) {
                queueHomeTileVideo(video, true);
            }
        });
    };
}

let openVideoLightbox = () => {};

function initVideoLightbox() {
    const lightbox = document.getElementById('video-lightbox');
    const backdrop = document.getElementById('lightbox-backdrop');
    const shell = document.getElementById('lightbox-player-shell');
    const video = document.getElementById('lightbox-video');
    const closeButton = document.getElementById('lightbox-close');
    const prevButton = document.getElementById('lightbox-prev');
    const nextButton = document.getElementById('lightbox-next');
    const titleEl = document.getElementById('lightbox-title');

    if (!lightbox || !shell || !video) {
        return;
    }

    const controls = wireBasicVideoControls({
        playerShell: shell,
        videoPlayer: video,
        centerPlay: document.getElementById('lightbox-center-play'),
        playPauseButton: document.getElementById('lightbox-play-pause'),
        playIcon: document.getElementById('lightbox-play-icon'),
        volumeSlider: document.getElementById('lightbox-volume-slider'),
        muteButton: document.getElementById('lightbox-mute'),
        muteIcon: document.getElementById('lightbox-mute-icon'),
        timeSlider: document.getElementById('lightbox-time-slider'),
        currentTimeEl: document.getElementById('lightbox-current-time'),
        durationTimeEl: document.getElementById('lightbox-duration-time'),
        fullscreenButton: document.getElementById('lightbox-fullscreen-button'),
        fullscreenIcon: document.getElementById('lightbox-fullscreen-icon'),
        fullscreenTarget: shell
    });

    const source = video.querySelector('source');
    let currentIndex = 0;
    let lastOriginRect = null;

    const playerOverlay = document.getElementById('lightbox-player-overlay');
    if (playerOverlay) {
        playerOverlay.addEventListener('click', (e) => e.stopPropagation());
    }

    function loadEntry(index, { resume = false } = {}) {
        const entry = homeShowcaseVideos[index];
        if (!entry || !source) {
            return;
        }

        currentIndex = index;
        source.src = entry.src;
        source.type = getVideoMime(entry.src);
        video.load();
        controls.updatePlayState();
        if (titleEl) {
            titleEl.textContent = entry.title || '';
        }

        const multiple = homeShowcaseVideos.length > 1;
        if (prevButton) prevButton.style.display = multiple ? '' : 'none';
        if (nextButton) nextButton.style.display = multiple ? '' : 'none';

        if (resume) {
            video.play().catch(() => {});
        }
    }

    function goTo(index) {
        const total = homeShowcaseVideos.length;
        const nextIndex = (index + total) % total;
        loadEntry(nextIndex, { resume: true });
    }

    function animateOpen(originRect) {
        shell.style.transition = 'none';
        shell.style.transform = 'translate(0, 0) scale(1, 1)';
        shell.style.opacity = '0';

        requestAnimationFrame(() => {
            const finalRect = shell.getBoundingClientRect();
            if (originRect && finalRect.width && finalRect.height) {
                const scaleX = originRect.width / finalRect.width;
                const scaleY = originRect.height / finalRect.height;
                const originX = originRect.left + originRect.width / 2;
                const originY = originRect.top + originRect.height / 2;
                const finalX = finalRect.left + finalRect.width / 2;
                const finalY = finalRect.top + finalRect.height / 2;

                shell.style.transform = `translate(${originX - finalX}px, ${originY - finalY}px) scale(${scaleX}, ${scaleY})`;
            }

            requestAnimationFrame(() => {
                shell.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease';
                shell.style.transform = 'translate(0, 0) scale(1, 1)';
                shell.style.opacity = '1';
                lightbox.classList.add('is-visible');
            });
        });
    }

    function animateClose(onDone) {
        lightbox.classList.remove('is-visible');
        const originRect = lastOriginRect;

        if (originRect) {
            const finalRect = shell.getBoundingClientRect();
            const scaleX = originRect.width / finalRect.width;
            const scaleY = originRect.height / finalRect.height;
            const originX = originRect.left + originRect.width / 2;
            const originY = originRect.top + originRect.height / 2;
            const finalX = finalRect.left + finalRect.width / 2;
            const finalY = finalRect.top + finalRect.height / 2;

            shell.style.transition = 'transform 0.35s ease, opacity 0.3s ease';
            shell.style.transform = `translate(${originX - finalX}px, ${originY - finalY}px) scale(${scaleX}, ${scaleY})`;
            shell.style.opacity = '0';
        }

        setTimeout(onDone, 320);
    }

    function openAt(index, originRect) {
        lastOriginRect = originRect || null;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        loadEntry(index);
        animateOpen(originRect);
    }

    function close() {
        video.pause();
        animateClose(() => {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
            source.removeAttribute('src');
            video.load();
        });
    }

    if (closeButton) closeButton.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    if (prevButton) prevButton.addEventListener('click', () => goTo(currentIndex - 1));
    if (nextButton) nextButton.addEventListener('click', () => goTo(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) {
            return;
        }
        if (e.key === 'Escape') {
            close();
        } else if (e.key === 'ArrowLeft') {
            goTo(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goTo(currentIndex + 1);
        }
    });

    openVideoLightbox = openAt;
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

function initToolsImageLightbox() {
    const trigger = document.getElementById('tools-image-trigger');
    const lightbox = document.getElementById('image-lightbox');
    const backdrop = document.getElementById('image-lightbox-backdrop');
    const closeButton = document.getElementById('image-lightbox-close');
    const lightboxImg = document.getElementById('image-lightbox-img');
    const toolsImg = document.querySelector('.tools-image');

    if (!trigger || !lightbox || !lightboxImg || !toolsImg) {
        return;
    }

    const viewportPadding = 24;

    function fitLightboxImage() {
        const naturalWidth = lightboxImg.naturalWidth;
        const naturalHeight = lightboxImg.naturalHeight;
        if (!naturalWidth || !naturalHeight) {
            return;
        }

        const maxWidth = window.innerWidth - viewportPadding;
        const maxHeight = window.innerHeight - viewportPadding;
        const ratio = naturalWidth / naturalHeight;

        let width = maxWidth;
        let height = width / ratio;

        if (height > maxHeight) {
            height = maxHeight;
            width = height * ratio;
        }

        lightboxImg.style.width = `${Math.floor(width)}px`;
        lightboxImg.style.height = `${Math.floor(height)}px`;
    }

    function openLightbox() {
        const src = toolsImg.currentSrc || toolsImg.src;
        lightboxImg.alt = toolsImg.alt;
        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        const showLightbox = () => {
            fitLightboxImage();
            requestAnimationFrame(() => {
                lightbox.classList.add('is-visible');
            });
        };

        lightboxImg.onload = showLightbox;
        lightboxImg.src = src;

        if (lightboxImg.complete) {
            showLightbox();
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        window.setTimeout(() => {
            if (!lightbox.classList.contains('is-visible')) {
                lightbox.classList.remove('is-open');
                lightboxImg.removeAttribute('src');
                lightboxImg.onload = null;
                lightboxImg.style.width = '';
                lightboxImg.style.height = '';
            }
        }, 300);
    }

    trigger.addEventListener('click', openLightbox);
    backdrop?.addEventListener('click', closeLightbox);
    closeButton?.addEventListener('click', closeLightbox);
    lightboxImg.addEventListener('click', closeLightbox);

    window.addEventListener('resize', () => {
        if (lightbox.classList.contains('is-open')) {
            fitLightboxImage();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });
}

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

    if (sectionId === 'home' && typeof window.__resumeHomeVideoGrid === 'function') {
        window.__resumeHomeVideoGrid();
    }
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

