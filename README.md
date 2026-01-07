# Casino App

A modern casino application built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Project Overview

This project is a full-featured casino application leveraging the latest web technologies including the React Compiler for optimized performance and Tailwind CSS for streamlined styling.

## Technology Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3 with React Compiler
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.0
- **Linting**: ESLint 9 with TypeScript support
- **Formatting**: Prettier 3.7 with Tailwind plugin

## Project Structure

```
project-casino_app/
├── src/
│   ├── app/              # Next.js 13+ App Router pages and layouts
│   ├── components/       # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services and external integrations
│   ├── utils/           # Utility functions and helpers
│   ├── styles/          # Global styles and CSS modules
│   ├── types/           # TypeScript type definitions and interfaces
│   └── assets/          # Static assets (images, fonts, etc.)
├── public/              # Static files served directly
└── ...config files
```

### Directory Purpose

- **app/**: Contains all routes, layouts, and page components using Next.js App Router
- **components/**: Reusable UI components organized by feature or type
- **hooks/**: Custom React hooks for shared logic and state management
- **services/**: API clients, data fetching, and third-party service integrations
- **utils/**: Helper functions, formatters, validators, and utility classes
- **styles/**: Global CSS, Tailwind configurations, and CSS modules
- **types/**: TypeScript interfaces, types, and type definitions
- **assets/**: Images, icons, fonts, and other static resources

## Path Aliases

The project is configured with path aliases for cleaner imports:

```typescript
// Instead of relative imports:
import { Button } from '../../../components/Button';

// Use absolute imports with aliases:
import { Button } from '@/components/Button';
```

Available aliases:

- `@/*` - Maps to `src/*`

Examples:

```typescript
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { formatCurrency } from '@/utils/formatters';
import type { User } from '@/types/user';
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd project-casino_app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Environment Setup

Create a `.env.local` file in the root directory for environment-specific variables:

```bash
# Add your environment variables here
# NEXT_PUBLIC_API_URL=
# DATABASE_URL=
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Automatically fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Leverage path aliases for imports

### Component Guidelines

- Keep components small and focused
- Use TypeScript interfaces for props
- Export components as named exports
- Place component-specific styles in the same directory

### Commit Conventions

Follow conventional commits format:

```
type(scope): description

Examples:
feat(auth): add login functionality
fix(ui): resolve button styling issue
docs(readme): update setup instructions
```

### Git Hooks with Husky

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks and ensure code quality before commits.

#### Configured Hooks

**Pre-commit Hook:**

- Runs `lint-staged` to automatically lint and format staged files
- Ensures only properly formatted and linted code is committed
- Checks JavaScript/TypeScript files with ESLint and Prettier
- Formats JSON, Markdown, and CSS files with Prettier

**Commit Message Hook:**

- Validates commit messages follow conventional commits format
- Enforces commit message structure: `type(scope): description`
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

#### What Happens on Commit

When you run `git commit`:

1. Pre-commit hook runs and automatically fixes linting/formatting issues on staged files
2. If fixes are applied, you may need to stage the changes and commit again
3. Commit message is validated against conventional commits format
4. If validation fails, the commit is rejected with an error message

#### Bypassing Hooks (Not Recommended)

In rare cases where you need to bypass hooks:

```bash
git commit --no-verify -m "your message"
```

Note: This should only be used in exceptional circumstances.

## Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub](https://github.com/vercel/next.js)

### React Resources

- [React Documentation](https://react.dev)
- [React Compiler](https://react.dev/learn/react-compiler)

### Styling Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-beta)

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]
