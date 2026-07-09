const fs = require('fs');
const path = require('path');

const HOME_DIR = path.join(__dirname, '..', 'videos', 'home');
const OUTPUT = path.join(HOME_DIR, 'videos.json');
const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.m4v']);

function titleFromFilename(filename) {
    const base = path.basename(filename, path.extname(filename));
    return base
        .replace(/__/g, ' — ')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const files = fs.readdirSync(HOME_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && VIDEO_EXT.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const manifest = files.map((filename) => ({
    src: `videos/home/${filename}`,
    title: titleFromFilename(filename),
}));

fs.writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${manifest.length} videos to ${OUTPUT}`);
