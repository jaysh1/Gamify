# Year 8 Dooren Syllabus

An interactive learning platform built with Next.js, Express, Prisma, and PostgreSQL.

## Features

- **Dynamic Syllabus Management**: Organize content by subjects, modules, lessons, and activities
- **Interactive Learning**: Includes quizzes, reflection prompts, and discussion components
- **Progress Tracking**: Monitor student completion and progress per lesson
- **Mastery Milestones**: Track achievement of learning milestones
- **Responsive Design**: Mobile-friendly interface with accessibility features
- **Media Integration**: Support for videos, images, and other multimedia assets

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript

### Frontend
- **Framework**: Next.js 13+ (App Router)
- **Styling**: CSS Modules
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Language**: TypeScript/React

## Project Structure

```
.
├── app/                        # Next.js frontend (App Router)
│   ├── components/            # React components
│   │   ├── QuizComponent.tsx
│   │   ├── ReflectionPrompt.tsx
│   │   └── DiscussionPrompt.tsx
│   ├── lessons/              # Lesson pages
│   ├── modules/              # Module pages
│   ├── lib/                  # Utility functions and API client
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── store.ts              # Zustand store
├── src/
│   └── server.ts             # Express server with API routes
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding script
├── public/
│   └── styles/
│       └── globals.css       # Global styles
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies and scripts
```

## Database Schema

### Models

- **User**: Student accounts with email and name
- **Subject**: Subject groupings (e.g., "Year 8 Dooren Syllabus")
- **Module**: Learning modules within subjects
- **Lesson**: Individual lessons within modules
- **InteractiveComponent**: Quizzes, reflections, and discussions
- **MediaAsset**: Videos, images, and other resources
- **LessonProgress**: Student progress tracking per lesson
- **MasteryMilestone**: Learning achievement milestones
- **StudentMilestone**: Student achievement records

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your PostgreSQL connection details:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/year8_syllabus?schema=public"
   ```

3. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

4. **Seed the database with sample data**
   ```bash
   npm run db:seed
   ```

5. **Start the backend server** (in one terminal)
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000`

6. **Start the frontend** (in another terminal)
   ```bash
   npm run frontend
   ```
   The frontend will run on `http://localhost:3001`

## Available Scripts

### Backend & Database
- `npm run dev` - Start backend server with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Run production build
- `npm run db:migrate` - Create/update database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (delete all data and re-seed)
- `npm run db:studio` - Open Prisma Studio (database GUI)

### Frontend
- `npm run frontend:dev` - Start Next.js development server
- `npm run frontend:build` - Build Next.js for production
- `npm run frontend:start` - Run production build

## API Endpoints

### Modules
- `GET /api/modules` - List all modules
- `GET /api/subjects/:subjectId/modules` - List modules for a subject

### Lessons
- `GET /api/lessons/:lessonId` - Get lesson details with interactive components and media assets

### Progress Tracking
- `GET /api/users/:userId/progress` - Get all progress for a user
- `GET /api/users/:userId/lessons/:lessonId/progress` - Get progress for a specific lesson
- `PUT /api/users/:userId/lessons/:lessonId/progress` - Update lesson progress

### Milestones
- `GET /api/users/:userId/milestones` - Get user's achieved milestones

### Subjects
- `GET /api/subjects` - List all subjects

## Sample Data

The seed script creates:
- 1 Subject: "Year 8 Dooren Syllabus"
- 2 Modules: "Introduction to Sustainability" and "Renewable Energy Sources"
- 6 Lessons total: 3 per module
- 12+ Interactive Components (quizzes, reflections, discussions)
- 6+ Media Assets (videos and images)
- 3 Mastery Milestones
- 2 Sample Users with progress data

## Frontend Features

### Pages
- **Home** (`/`) - List all modules
- **Module Detail** (`/modules/[id]`) - Show module with lessons and progress
- **Lesson** (`/lessons/[id]`) - Display lesson content with interactive components

### Components
- **QuizComponent**: Multiple-choice quizzes with instant feedback
- **ReflectionPrompt**: Text-based reflection prompts
- **DiscussionPrompt**: Discussion prompts for collaborative learning

### Accessibility
- ARIA labels and roles for interactive elements
- Keyboard navigation support
- Focus-visible indicators
- Semantic HTML structure
- Mobile-responsive design

## Usage Examples

### Fetching Modules
```typescript
import { api } from '@/app/lib/api';

const modules = await api.modules.getAll();
```

### Tracking Progress
```typescript
await api.progress.update(userId, lessonId, {
  progress: 75,
  completed: false
});
```

### Getting Lesson Details
```typescript
const lesson = await api.lessons.get(lessonId);
```

## Development Guidelines

- Use TypeScript for type safety
- Follow CSS Modules for scoped styling
- Maintain responsive design principles
- Ensure ARIA compliance for accessibility
- Keep component logic separated and reusable
- Use Zustand for simple state management

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists or Prisma can create it

### Frontend Won't Load
- Verify backend server is running on port 3000
- Check `NEXT_PUBLIC_API_URL` environment variable
- Clear Next.js cache: `rm -rf .next`

### Seed Script Fails
- Ensure database migrations have run: `npm run db:migrate`
- Check for duplicate unique constraints

## Production Deployment

1. Build frontend: `npm run frontend:build`
2. Build backend: `npm run build`
3. Run migrations: `npm run db:migrate`
4. Start server: `npm start`

## License

ISC
