# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Development Server
- Development server runs on http://localhost:3000
- Uses Turbopack for faster builds via `--turbopack` flag
- Hot reload enabled for all files

### Testing & Quality
```bash
# Lint TypeScript and React code
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

## Project Architecture

### Application Type
This is a **Next.js 15 App Router** application - an AI-powered documentation chat and analysis tool named "docs-wiki". It provides an interactive chat interface for learning frameworks, documentation, programming languages, and concepts.

### High-Level Architecture

**Frontend (Next.js App)**
- **Chat Interface**: Real-time AI conversation with multiple model selection
- **Document Ingestion**: Upload files, URLs, and documents for AI analysis
- **Local Storage**: IndexedDB for persistent chat history and threads
- **Authentication**: Clerk integration for user management
- **UI Framework**: Shadcn/ui components with Radix UI primitives

**Backend Integration**
- Communicates with external Python backend via API routes
- Backend URL configured via `NEXT_PUBLIC_BACKEND_URL` environment variable
- Supports streaming responses for chat functionality

### Key Components Architecture

**Chat System**
- `ChatInterface` (components/chat-interface.tsx): Main chat UI with message handling, model selection, and user limits
- `MessageRenderer` (components/message-renderer.tsx): Markdown renderer with syntax highlighting, math (KaTeX), and Mermaid diagrams
- `ModelSelector` (components/model-selector.tsx): Dropdown for AI model selection (GPT-5, Claude Sonnet 4, Grok, etc.)

**Data Flow**
- `lib/indexed-db.ts`: Client-side database using IndexedDB for chat persistence
- `app/api/chat/route.ts`: Proxy API route to backend chat service
- `app/api/ingest/route.ts`: File/URL upload handler forwarding to backend

**UI Architecture**
- `components/sidebar.tsx`: Collapsible navigation with chat history
- `components/artifact.tsx`: Sliding panel for code artifacts and Excalidraw integration  
- `components/inputForm.tsx`: Multi-step form for topic selection and document ingestion
- `components/theme-provider.tsx`: Dark/light theme system via next-themes

### Routing & Pages

**App Router Structure**
- `/` - Landing page with InputForm for starting new learning sessions
- `/chat` - Main chat interface with sidebar and artifact panel
- `/chat?threadId=X` - Load specific chat thread
- `/chat?topic=X&prompt=Y` - Start chat with pre-filled topic/prompt

### Authentication & User Management
- Uses Clerk for authentication (`@clerk/nextjs`)
- Anonymous users limited to 20 messages before sign-in required
- Protected routes handled by `middleware.ts`

### Styling & UI System

**Design System**
- Tailwind CSS 4 with CSS variables for theming
- Shadcn/ui components following "new-york" style
- Geist font family (sans and mono) from Vercel
- Framer Motion for smooth animations

**Component Library Structure**
- `components/ui/` - Base UI components (Button, Input, Tabs, etc.)
- Path aliases configured: `@/components`, `@/lib`, `@/app`

### Environment Configuration

**Required Environment Variables**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000  # Backend API base URL
CLERK_PUBLISHABLE_KEY=pk_...                   # Clerk auth public key  
CLERK_SECRET_KEY=sk_...                        # Clerk auth secret key
```

### TypeScript Configuration
- Strict mode enabled with ES2017 target
- Path mapping configured for `@/*` imports
- Next.js plugin integrated for optimal TypeScript support

### Key Dependencies
- **UI**: @radix-ui components, lucide-react icons, framer-motion
- **Markdown**: react-markdown with rehype/remark plugins for code highlighting, math, and diagrams
- **Database**: idb for IndexedDB wrapper
- **Auth**: @clerk/nextjs for authentication
- **Styling**: tailwindcss, next-themes for theme management

### Development Notes

**Local Development Workflow**
1. Ensure backend service is running on configured port
2. Set up Clerk authentication keys
3. Run `npm run dev` for hot-reload development
4. Chat history persists locally via IndexedDB

**Component Development**
- Follow Shadcn/ui patterns for new components
- Use Radix UI primitives for accessibility
- Implement responsive design with Tailwind breakpoints
- Support both light/dark themes

**API Integration**
- All backend calls go through Next.js API routes for CORS handling
- Streaming responses supported for real-time chat
- Error handling includes user-friendly messages

**File Upload System**
- Supports PDF, DOC, DOCX, TXT, MD files
- FormData forwarding to backend for processing
- Topic categorization: Math/STEM, Software Engineering, Computer Science
