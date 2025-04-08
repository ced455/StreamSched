# Technical Context

## Development Stack

### Frontend Technologies
- **Framework**: React 18+
- **Language**: TypeScript
- **Key Libraries**:
  - React Router for navigation
  - React Query for data fetching
  - React Hook Form for form management
  - Date-fns for date manipulation
  - TBD: UI Component library

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Fastify
- **Language**: TypeScript
- **Key Libraries**:
  - @fastify/oauth2 for Twitch authentication
  - @fastify/jwt for JWT handling
  - @fastify/cache for response caching
  - node-fetch for API requests

### Database
Decision pending between:
1. **MongoDB**
   - Flexible schema for evolving data
   - Better for document-style data
   - Simpler scaling
   
2. **PostgreSQL**
   - ACID compliance
   - Better for relational data
   - More robust querying

## Development Environment

### Required Tools
- Node.js (v18+)
- npm/yarn
- Git
- TypeScript
- ESLint + Prettier
- Docker (for local development)
- VS Code (recommended)

### VS Code Extensions
- ESLint
- Prettier
- Docker
- TypeScript
- GitLens
- REST Client

### Environment Variables
```bash
# Frontend
VITE_API_URL=http://localhost:3000
VITE_TWITCH_CLIENT_ID=your_client_id

# Backend
PORT=3000
NODE_ENV=development
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_db_url
```

## API Specifications

### Twitch API Integration

#### Required Scopes
- `user:read:email`
- `user:read:follows`
- `channel:read:schedule`

#### Key Endpoints
```typescript
interface TwitchEndpoints {
  // Authentication
  authorize: 'https://id.twitch.tv/oauth2/authorize';
  token: 'https://id.twitch.tv/oauth2/token';
  
  // User Data
  users: 'https://api.twitch.tv/helix/users';
  follows: 'https://api.twitch.tv/helix/users/follows';
  
  // Schedule Data
  schedule: 'https://api.twitch.tv/helix/schedule';
}
```

### Internal API Structure

#### Authentication Routes
```typescript
interface AuthRoutes {
  login: 'POST /auth/login';
  callback: 'GET /auth/callback';
  refresh: 'POST /auth/refresh';
  logout: 'POST /auth/logout';
}
```

#### Schedule Routes
```typescript
interface ScheduleRoutes {
  followedSchedules: 'GET /schedules/followed';
  streamerSchedule: 'GET /schedules/:streamerId';
  updateCache: 'POST /schedules/cache';
}
```

#### User Routes
```typescript
interface UserRoutes {
  preferences: 'GET/PUT /users/preferences';
  favorites: 'GET/PUT /users/favorites';
}
```

## Database Schema

### Users Collection/Table
```typescript
interface User {
  id: string;
  twitchId: string;
  email: string;
  displayName: string;
  preferences: {
    timezone: string;
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  favorites: string[]; // Streamer IDs
  createdAt: Date;
  updatedAt: Date;
}
```

### Schedules Collection/Table
```typescript
interface Schedule {
  id: string;
  streamerId: string;
  streams: Array<{
    id: string;
    title: string;
    startTime: Date;
    endTime?: Date;
    category?: string;
    lastUpdated: Date;
  }>;
  cacheExpiry: Date;
}
```

## Deployment Architecture

### Docker Configuration
```yaml
# Example docker-compose.yml structure
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    
  database:
    image: postgres:14
    # or
    # image: mongo:5
```

### CI/CD Pipeline
- GitHub Actions for automated testing
- Docker image building
- Automated deployments
- Environment promotion (dev → staging → prod)

## Performance Considerations

### Frontend Optimization
- Route-based code splitting
- Image optimization
- Service worker for offline support
- Memory leak prevention
- Bundle size monitoring

### Backend Optimization
- Response caching
- Connection pooling
- Rate limiting
- Request batching
- Error recovery

### Database Optimization
- Index optimization
- Query performance monitoring
- Connection pooling
- Cache warming strategies

## Monitoring & Logging

### Application Metrics
- Request latency
- Error rates
- Cache hit rates
- API usage statistics

### System Metrics
- CPU usage
- Memory consumption
- Network I/O
- Disk usage

### User Metrics
- Active users
- Feature usage
- Error encounters
- Performance metrics
