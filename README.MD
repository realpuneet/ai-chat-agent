# AI Bot Agent

A full-stack application featuring an AI-powered chatbot with web search capabilities using Google GenAI and Tavily.

## Live Demo

[View Live Application](https://ai-chat-agent-for-you.vercel.app/)

## Author

**Puneet Yadav**

- LinkedIn: [https://www.linkedin.com/in/realpuneet](https://www.linkedin.com/in/realpuneet)
- Email: puneety259@gmail.com

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aiBotAgent
```

Replace `<repository-url>` with the actual Git repository URL.

### 2. Install Backend Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
npm install
cd ..
```

### 3. Install Frontend Dependencies

Navigate to the frontend directory and install the required packages:

```bash
cd frontend
npm install
cd ..
```

### 4. Set Up Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
GOOGLE_API_KEY=your_google_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
PORT=3001
```

- Obtain your Google API key from [Google AI Studio](https://makersuite.google.com/app/apikey).
- Obtain your Tavily API key from [Tavily](https://tavily.com/).
- The `PORT` is optional; defaults to 3001 if not set.

### 5. Run the Backend Server

Start the backend server:

```bash
cd backend
node index.js
```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

### 6. Run the Frontend Application

In a new terminal, start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port).

## Usage

Once both servers are running:

1. Open your browser and navigate to `http://localhost:5173`.
2. Interact with the AI chatbot, which can perform web searches using the integrated tools.

## Project Structure

- `backend/`: Node.js Express server with AI integration
- `frontend/`: React application built with Vite

## Technologies Used

- **Backend**: Node.js, Express, Google GenAI, Tavily API
- **Frontend**: React, Vite
- **Other**: CORS, Express Session for chat history

## Troubleshooting

- Ensure all environment variables are set correctly.
- Check that the specified ports are not in use by other applications.
- Verify that Node.js and npm are installed and up to date.
