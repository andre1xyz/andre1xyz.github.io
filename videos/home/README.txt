Drop video clips here (.mp4, .mov, .webm).

They are picked up automatically — no manual edits in main.js.

After adding or removing files, refresh the manifest:

    node scripts/sync-home-videos.js

Then reload the site. Subfolders (e.g. output/) are ignored — only files
directly in this folder are used.

Tips:
- Short loopable clips work best in the background grid.
- Keep files compressed when possible (many clips = heavier page load).
