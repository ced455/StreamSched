# StreamSched

A modern web application for managing and discovering Twitch streamer schedules, built with React and TypeScript. StreamSched helps viewers stay updated with their favorite streamers' schedules and never miss a stream.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

## What is StreamSched?

StreamSched is your personal Twitch streaming calendar that helps you:
- Track when your favorite streamers go live
- Discover new streams based on your interests
- View streamer schedules in a clean, intuitive calendar interface

## Features

- 📅 Interactive calendar view for stream schedules
- 🔍 Advanced filtering capabilities
- 🔐 Secure Twitch integration
- 💾 Local storage for user preferences
- 📱 Responsive design for all devices

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context API
- **API Integration**: Twitch API
- **Styling**: CSS Modules
- **Development Tools**: ESLint, TypeScript ESLint

## Development Approach

StreamSched is primarily developed using:
- **Cline**: An AI pair programmer that helps maintain consistent code quality and follow best practices
- **GitHub Copilot**: AI-powered code completion for enhanced developer productivity

This combination enables rapid development while maintaining high code quality and consistent patterns throughout the codebase.

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Copy `.env.example` to `.env` and configure your Twitch API credentials
4. Start the development server:
```bash
npm run dev
```

## Project Structure

The project follows a domain-driven design approach:
```
src/
  ├── features/    # Domain-specific features
  ├── components/  # Shared UI components
  ├── services/    # API and storage services
  ├── store/       # Global state management
  ├── utils/       # Utility functions
  └── types/       # TypeScript type definitions
