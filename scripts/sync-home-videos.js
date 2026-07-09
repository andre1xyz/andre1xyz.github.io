const fs = require('fs');
const path = require('path');

const HOME_DIR = path.join(__dirname, '..', 'videos', 'home');
const OUTPUT = path.join(HOME_DIR, 'videos.json');
const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.m4v']);

// Folder you drop a clip into controls its tile size on the homepage.
// This is the single source of truth for size — move a file between
// folders and re-run this script to change how big it appears.
const CATEGORY_SIZE = {
    favorite: 'lg',
    mid: 'md',
    low: 'sm',
};
const CATEGORY_ORDER = ['favorite', 'mid', 'low'];

function titleFromFilename(filename) {
    const base = path.basename(filename, path.extname(filename));
    return base
        .replace(/__/g, ' — ')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function loadExistingManifest() {
    if (!fs.existsSync(OUTPUT)) {
        return new Map();
    }

    try {
        const data = JSON.parse(fs.readFileSync(OUTPUT, 'utf8'));
        const list = Array.isArray(data) ? data : data.videos;
        if (!Array.isArray(list)) {
            return new Map();
        }

        return new Map(list.map((entry) => [entry.src, entry]));
    } catch {
        return new Map();
    }
}

function listVideoFiles(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }

    return fs.readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && VIDEO_EXT.has(path.extname(entry.name).toLowerCase()))
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

const existing = loadExistingManifest();

function getPreviewSrc(category, filename) {
    if (!category) {
        return null;
    }

    const previewPath = path.join(HOME_DIR, category, 'preview', filename);
    if (!fs.existsSync(previewPath)) {
        return null;
    }

    return `videos/home/${category}/preview/${filename}`;
}

function buildEntry(category, filename) {
    const src = category
        ? `videos/home/${category}/${filename}`
        : `videos/home/${filename}`;
    const previous = existing.get(src);
    const previewSrc = getPreviewSrc(category, filename) || previous?.previewSrc || null;
    const entry = {
        src,
        title: previous?.title || titleFromFilename(filename),
        // Folder is the source of truth for category-based clips, so it always
        // wins over a stale size from a previous manifest run.
        size: category ? CATEGORY_SIZE[category] : (previous?.size || 'sm'),
    };

    if (previewSrc) {
        entry.previewSrc = previewSrc;
    }

    return entry;
}

// Queue up each category's files separately, then round-robin merge them so
// the final order alternates sizes instead of clumping all "favorite" clips
// together — deterministic every run, no randomization at page load.
const queues = CATEGORY_ORDER.map((category) => ({
    category,
    files: listVideoFiles(path.join(HOME_DIR, category)),
}));

const manifest = [];
let remaining = true;
while (remaining) {
    remaining = false;
    queues.forEach(({ category, files }) => {
        const filename = files.shift();
        if (filename) {
            manifest.push(buildEntry(category, filename));
            remaining = true;
        }
    });
}

// Backwards compatible: any loose clips left directly in videos/home/ (not
// sorted into a category folder yet) still get picked up, defaulting to "sm".
const rootFiles = listVideoFiles(HOME_DIR);
rootFiles.forEach((filename) => manifest.push(buildEntry(null, filename)));

fs.writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${manifest.length} videos to ${OUTPUT}`);
console.log(`  favorite/lg: ${manifest.filter((v) => v.size === 'lg').length}`);
console.log(`  mid/md:      ${manifest.filter((v) => v.size === 'md').length}`);
console.log(`  low/sm:      ${manifest.filter((v) => v.size === 'sm').length}`);
console.log(`  previews:    ${manifest.filter((v) => v.previewSrc).length}`);
