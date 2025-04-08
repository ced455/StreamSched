# StreamPlan (TwitchAgenda) Project Brief

## Project Overview
StreamPlan is a web application designed to aggregate and display Twitch streamer schedules in a user-friendly interface. The application helps users track streaming schedules of their followed Twitch creators in one centralized location.

## Core Goals
- Create a centralized platform for viewing Twitch streamer schedules
- Provide seamless Twitch.tv account integration
- Deliver a mobile-first, responsive user experience
- Build a scalable foundation for future Android app development
- Offer an intuitive and unified calendar/list view of upcoming streams

## Target Platforms
1. Primary: Responsive Web Application (Desktop & Mobile)
2. Future: Native Android Application

## Key Features
1. **Twitch OAuth Integration**
   - Secure authentication via Twitch.tv accounts
   - Access to user's followed channels

2. **Schedule Aggregation**
   - Unified view of followed streamers' schedules
   - Weekly and daily calendar views
   - Real-time schedule updates

3. **Personalized Dashboard**
   - Customizable streamer filters
   - Favorite streamer highlights
   - Multiple view options (list/calendar)

4. **Mobile-First Design**
   - Native-like user experience
   - Responsive interface
   - PWA compatibility

5. **Backend Infrastructure**
   - Robust API system
   - Data caching
   - User preference storage

## Technical Stack
### Frontend
- Framework: React
- Styling: To be determined (possibly Tailwind CSS)
- PWA capabilities

### Backend
- Runtime: Node.js
- Framework: Fastify
- Authentication: Twitch OAuth2
- API Integration: Twitch Helix API

### Data Storage
- Database options:
  - MongoDB
  - PostgreSQL
- Caching system for stream data

### Deployment
- Containerization: Docker
- CI/CD: GitHub Actions / GitLab CI

### Future Development
- React Native for Android application
- Shared API infrastructure
