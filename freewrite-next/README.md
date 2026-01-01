# Freewrite (Next.js + Tauri)

A distraction-free writing app for freewriting sessions, rebuilt with Next.js and Tauri.

## Features

- **Timed Writing Sessions**: Set a timer (0-45 minutes) and write without distraction
- **Auto-save**: Entries are automatically saved as you type
- **Entry History**: Browse and manage your past entries
- **AI Integration**: Send entries to ChatGPT or Claude for reflection
- **PDF Export**: Export any entry as a PDF
- **Font Customization**: Choose from Lato, Arial, System, or Serif fonts
- **Light/Dark Mode**: Toggle between light and dark themes
- **Backspace Control**: Optionally disable backspace to encourage continuous flow
- **Fullscreen Mode**: Write in distraction-free fullscreen

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Desktop**: Tauri 2.0
- **PDF Generation**: jsPDF

## Development

### Prerequisites

- Node.js 18+
- Rust (for Tauri)
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run in development mode (web only)
npm run dev

# Run with Tauri (native macOS app)
npm run tauri:dev
```

### Build

```bash
# Build Next.js static export
npm run build

# Build Tauri app for macOS
npm run tauri:build
```

## Project Structure

```
freewrite-next/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   │   ├── Editor/            # Text editor
│   │   ├── Toolbar/           # Bottom toolbar
│   │   ├── Sidebar/           # Entry history
│   │   └── ui/                # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── stores/                 # Zustand stores
│   └── types/                  # TypeScript types
├── src-tauri/                  # Tauri Rust backend
│   ├── src/                    # Rust source code
│   ├── capabilities/           # Tauri permissions
│   └── tauri.conf.json        # Tauri configuration
├── public/
│   └── fonts/                  # Lato font files
└── package.json
```

## License

MIT
