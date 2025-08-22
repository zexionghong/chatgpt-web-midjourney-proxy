# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue.js web application that serves as a ChatGPT web interface with integrated Midjourney proxy and multiple AI service capabilities. It's built with Vue 3, TypeScript, and includes both a frontend (client) and backend (service) component.

## Architecture

### Frontend (Vue 3 Application)
- **Framework**: Vue 3 + TypeScript + Vite
- **UI Library**: Naive UI for components
- **State Management**: Pinia stores
- **Router**: Vue Router with hash-based routing
- **Build Tool**: Vite with TypeScript compilation
- **Styling**: Less + Tailwind CSS

### Backend (Node.js Service)
- **Framework**: Express.js + TypeScript
- **Build Tool**: tsup for TypeScript compilation
- **Proxy Services**: Multiple AI service proxies (OpenAI, Midjourney, Suno, Luma, etc.)
- **File Handling**: Multer for uploads, AWS SDK for R2 storage

## Key Commands

### Development
```bash
# Install dependencies
pnpm install

# Start development server (frontend only)
pnpm dev

# Start with type checking
pnpm buildold

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check
pnpm type-check
```

### Backend Service
```bash
cd service
pnpm install
# Backend is built with tsup and runs on port 3002
```

### Build and Deploy
```bash
# Production build
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

### Frontend (`src/`)
- `views/chat/` - ChatGPT interface components
- `views/mj/` - Midjourney-related components  
- `views/suno/` - Suno music AI components
- `views/luma/` - Luma video AI components
- `views/viggle/` - Viggle dance AI components
- `views/wav/` - Real-time audio processing
- `store/` - Pinia state management
- `api/` - API service layers for different AI services
- `components/` - Reusable Vue components
- `router/` - Vue Router configuration

### Backend (`service/`)
- `src/index.ts` - Main Express server
- `src/chatgpt/` - ChatGPT API integration
- `src/middleware/` - Authentication and rate limiting
- `src/myfun.ts` - AI service proxy functions

## Development Guidelines

### Code Style
- TypeScript is used throughout the project
- ESLint configuration with `@antfu/eslint-config`
- Follows Vue 3 Composition API patterns
- Uses Pinia for state management over Vuex

### AI Service Integration
The application integrates with multiple AI services through proxy patterns:
- ChatGPT/OpenAI via `/openapi/*` routes
- Midjourney via `/mjapi/*` routes  
- Suno music AI via `/sunoapi/*` routes
- Luma video AI via `/luma/*` routes
- Various other video/image/audio AI services

### File Upload Handling
- Supports multiple upload methods (local, R2 storage, custom server)
- Handles multipart forms for image/audio file processing
- Environment variables control upload behavior

### Environment Configuration
Key environment variables:
- `OPENAI_API_KEY` and `OPENAI_API_BASE_URL` for ChatGPT
- `MJ_SERVER` and `MJ_API_SECRET` for Midjourney proxy
- Various AI service endpoints (SUNO_SERVER, LUMA_SERVER, etc.)
- Upload and storage configuration (API_UPLOADER, R2_*)

### Testing
No specific test framework is configured. When adding tests, examine the package.json and existing codebase to determine the appropriate testing approach.

## Important Notes

- The application uses hash-based routing (`createWebHashHistory`)
- Proxy configuration in vite.config.ts handles API routing during development
- The backend runs on port 3002, frontend dev server on port 8090
- Multiple layouts are used for different AI service interfaces
- File uploads are handled both in frontend and backend depending on configuration