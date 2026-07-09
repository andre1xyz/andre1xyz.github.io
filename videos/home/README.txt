Sort clips into these folders — the folder controls tile size:

    videos/home/favorite/   -> large tile  (hero)
    videos/home/mid/        -> medium tile
    videos/home/low/        -> small tile

Homepage grid uses low-res previews. Lightbox uses full-quality originals.

Generate previews (requires ffmpeg):

    node scripts/generate-home-previews.js
    node scripts/sync-home-videos.js

Previews are written to preview/ inside each category, e.g.:

    videos/home/favorite/preview/MyClip.mp4

You can also copy compressed files there manually.

After adding, removing, or moving files:

    node scripts/sync-home-videos.js

Then reload the site. Grid tiles lazy-load preview files only when visible.
Clicking a tile always plays the full-resolution src from the category folder.
