# RED FOX DOOM QUEST

Classic-1990s-inspired browser FPS prototype for RED FOX. Original procedural graphics and code; no DOOM game assets are included.

## Embed
Keep the existing `<div class="oPos nobr"></div>` on the task page and insert:

```html
<script src="https://cdn.jsdelivr.net/gh/RedLine142/redfox-doom-quest@COMMIT/redfox-doom-quest.js"></script>
```

Replace COMMIT with the published commit hash.

## Controls
- WASD: move and strafe
- Left/right arrows: rotate
- Click the game canvas to capture mouse; mouse movement rotates view
- Left mouse / Space: fire
- E: use nearby doors / inspect wall codes
- Shift: run
- 1 / 2: pistol / shotgun
- Esc: pause

## Prototype scope
Compact responsive game panel, raycasting maze, 3 lives, pistol and shotgun, two enemy types, health/ammo pickups, interactive doors, three code inscriptions and an exit condition. The code inscriptions are client-side and visible to a determined source-code reader; server-side answer validation is required for secure quest codes.

## Local preview
Open index.html through a local static web server.
