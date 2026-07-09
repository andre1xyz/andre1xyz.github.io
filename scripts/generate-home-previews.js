const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const HOME_DIR = path.join(__dirname, '..', 'videos', 'home');
const CATEGORIES = ['favorite', 'mid', 'low'];
const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.m4v']);
const MAX_WIDTH = 640;
const CRF = 28;

function hasFfmpeg() {
    const result = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return result.status === 0;
}

function listSourceVideos(category) {
    const sourceDir = path.join(HOME_DIR, category);
    if (!fs.existsSync(sourceDir)) {
        return [];
    }

    return fs.readdirSync(sourceDir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && VIDEO_EXT.has(path.extname(entry.name).toLowerCase()))
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function needsPreview(sourcePath, previewPath) {
    if (!fs.existsSync(previewPath)) {
        return true;
    }

    const previewSize = fs.statSync(previewPath).size;
    if (previewSize < 1024) {
        return true;
    }

    return fs.statSync(sourcePath).mtimeMs > fs.statSync(previewPath).mtimeMs;
}

function generatePreview(sourcePath, previewPath) {
    fs.mkdirSync(path.dirname(previewPath), { recursive: true });

    const result = spawnSync('ffmpeg', [
        '-y',
        '-i', sourcePath,
        '-vf', `scale=${MAX_WIDTH}:-1`,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', String(CRF),
        '-an',
        previewPath,
    ], { stdio: 'inherit' });

    return result.status === 0;
}

if (!hasFfmpeg()) {
    console.error('ffmpeg not found. Install ffmpeg, then re-run this script.');
    console.error('Or place low-res copies manually in each category preview/ folder.');
    process.exit(1);
}

let created = 0;
let skipped = 0;
let failed = 0;

CATEGORIES.forEach((category) => {
    listSourceVideos(category).forEach((filename) => {
        const sourcePath = path.join(HOME_DIR, category, filename);
        const previewPath = path.join(HOME_DIR, category, 'preview', filename);

        if (!needsPreview(sourcePath, previewPath)) {
            skipped += 1;
            return;
        }

        console.log(`Encoding ${category}/${filename} -> preview/${filename}`);
        if (generatePreview(sourcePath, previewPath)) {
            created += 1;
        } else {
            failed += 1;
        }
    });
});

console.log(`Done. created=${created} skipped=${skipped} failed=${failed}`);
console.log('Run: node scripts/sync-home-videos.js');
