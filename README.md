# Voice AI Assistant

A NestJS-based AI assistant application that integrates with language models and vector databases for intelligent voice processing and response generation.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)

## Prerequisites

- Node.js (v20 or later recommended)
- Docker and Docker Compose
- MongoDB
- Weaviate (vector database)

## Getting Started

0. Copy `.env.exampl` to `.env` and fill variables

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voice-ai-assistant.git
cd voice-ai-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Start the development environment with Docker:
```bash
npm run dev
```

This command will:
- Start MongoDB container
- Start Weaviate and its transformer service
- Launch the NestJS application in watch mode

Alternatively, you can run:
- `npm run start:dev:docker` - to only start Docker services
- `npm run start:dev` - to run the application in development mode
- `npm run start:prod` - to run the production build

## Project Structure

```
voice-ai-assistant/
├── src/
│   ├── api/           # API endpoints and controllers
│   ├── database/      # Database configurations and schemas
│   ├── llm/          # Language model integrations
│   ├── knowledge-base/# Knowledge base management
│   ├── app.module.ts  # Main application module
│   └── main.ts       # Application entry point
├── libs/             # Shared libraries and utilities
├── test/            # Test files
├── dist/            # Compiled output
└── docker-compose.yml # Docker services configuration
```

## Architecture

The application follows a modular architecture based on NestJS framework. Imagine that every module is separate microservis.

1. **API Layer**
   - RESTful endpoints for client communication
   - Request validation and DTOs
   - Authentication and authorization

2. **Database Layer**
   - MongoDB for persistent storage
   - Mongoose ODM for data modeling
   - Database schemas and repositories

3. **LLM Integration**
   - Integration with language models
   - LangChain for LLM orchestration
   - Text processing and generation

4. **Knowledge Base**
   - Weaviate vector database integration
   - Document embedding and storage
   - Semantic search capabilities

5. **Infrastructure**
   - Docker containerization
   - Microservices communication
   - Environment configuration

## API Endpoints

The application exposes RESTful endpoints for:

- Authentication and user management
- Knowledge base operations
- LLM interactions

## Development

### Environment Setup

1. Create a `.env` file in the root directory with necessary environment variables
2. Configure MongoDB and Weaviate connection settings
3. Set up any required API keys for language models

### Available Scripts

- `npm run build` - Build the application
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint
- `npm run start:debug` - Start the application in debug mode
- `npm run dev` - Start development environment with Docker
- `npm run test:e2e` - Run e2e tests

## Testing

The project includes unit tests and e2e tests:

```bash
# Run unit tests (for now there is nunit tests)
npm run test

# Run e2e tests. Currently not work.
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## Docker Deployment

The application uses Docker Compose for containerization with the following services:

1. **Weaviate**
   - Vector database for semantic search
   - Runs on port 8080
   - Includes transformer service for embeddings

2. **MongoDB**
   - Document database
   - Runs on port 27017
   - Persistent volume storage

To deploy with Docker:

```bash
# Build and start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f
```

## License

This project is licensed under the UNLICENSED license.
