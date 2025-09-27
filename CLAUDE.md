# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 3D retro music demo machine built with React Three Fiber and Vite. It features an interactive 3D scene with clickable cartridges that play music tracks, a retro gaming console aesthetic, and various post-processing effects.

## Critical Version Constraints

**⚠️ DO NOT UPDATE these packages without testing cinematic mode:**
```json
{
  "dependencies": {
    "three": "0.154.0",
    "@react-three/fiber": "8.13.5",
    "@react-three/postprocessing": "2.0.5"
  },
  "overrides": {
    "postprocessing": "6.34.0"
  }
}
```

These specific versions are required for shader compatibility. See `SHADER_COMPATIBILITY_FIX.md` for details.

## Code Conventions

### Minimalist Philosophy
- **File size**: Keep all files under 500 lines
- **Code style**: Elegant, minimal, no unnecessary complexity
- **Comments**: Avoid unless absolutely necessary
- **Patterns**: Use existing patterns (useSpring, useFrame, etc.)

### Current File Sizes
- `App.jsx`: 422 lines (main orchestrator)
- Components: 22-156 lines each
- Total codebase: ~800 lines

### Architecture Principles
- Prefer composition over complex hierarchies
- Keep state management simple and centralized in App.jsx
- Use React hooks and functional components exclusively
- Leverage React Three Fiber's declarative approach

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (with host access)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run for CodeSandbox environment
npm run sandbox
```

## Testing Checklist

Before any changes:
1. ✅ Start dev server: `npm run dev`
2. ✅ Toggle "Cinematic mode (heavy)" ON
3. ✅ Check browser console for shader errors
4. ✅ Verify cartridge animations work
5. ✅ Test on both desktop and mobile views

## Architecture

### Core Dependencies
- **React Three Fiber** (`@react-three/fiber`): 3D rendering framework
- **Drei** (`@react-three/drei`): Helper components for R3F
- **Post-processing** (`@react-three/postprocessing`): Visual effects
- **Leva**: Debug controls for 3D scene parameters
- **react-jinke-music-player**: Audio player component

### Project Structure
- **App.jsx**: Main application component managing:
  - Cartridge state and active music selection
  - Modal for initial user interaction
  - Desktop/mobile responsive modes
  - Effect composer toggle for performance optimization
  - Integration with Contentful CMS for dynamic cartridge data

- **3D Components**:
  - `Console.jsx`: Gaming console 3D model (22 lines)
  - `Cartridge.jsx`: Interactive music cartridge components (65 lines)
  - `Room.jsx`: Environment 3D scene with GLTF models (156 lines)
  - `RugPortal.jsx`: Portal effect component (26 lines)
  - `PortalScene.jsx`: Portal scene implementation (106 lines)

### Key Features
1. **Dynamic Content Loading**: Fetches cartridge data from Contentful CMS including positions, covers, and music sources
2. **Interactive 3D Scene**: Click cartridges to play/pause music with sound effects
3. **Performance Modes**: Toggle between cinematic (heavy) and basic (light) rendering modes
4. **Responsive Design**: Adapts UI between desktop and mobile layouts
5. **Cartridge Animations**: Spring-based animations with audio feedback (sfx)

### External Services
- **Contentful CMS**: Stores cartridge metadata and assets
  - Space ID: `cmls592r3a51`
  - Content Type: `cartridges`
  - Fields: key, name, position, cover, stickerCover, musicSrc

### Audio Player Events
- `onAudioPlayTrackChange(currentPlayId, audioLists, audioInfo)`: Track change handler
- `onAudioPlay()`: Playback start handler
- Player ref provides access to: `audio`, `updatePlayIndex()`, `play()`, `pause()`