// dotenv se env variables load karne ke liye
import { config } from "dotenv";
// Google GenAI SDK import kar rahe hain
import { GoogleGenAI, Type } from "@google/genai";
// Tavily search tool import
import { tavily } from "@tavily/core";
// Express server setup
import express from "express";
import cors from "cors";
import session from "express-session";

// .env file load karna
config();

// Google AI ka instance banaya with API key
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Tavily ka instance banaya with API key
const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

// Tool define kar rahe hain jo AI ko bataega ki search karne ke liye ek function available hai
const searchWebTool = {
  name: "search_web", // tool ka naam
  description:
    "Useful for when you need to answer questions about current events or the world", // kya karta hai
  parameters: {
    type: Type.OBJECT, // iska input ek object hoga
    properties: {
      query: {
        type: Type.STRING, // query string hogi
        description: "The search query to find relevant information.",
      },
    },
    required: ["query"], // query required hai
  },
};

// yaha actual function implement kiya hai jo Tavily API se search karega
const tools = {
  search_web: async ({ query }) => {
    const response = await tvly.search(query); // tavily search call
    return response.results; // jo bhi results mile return karo
  },
};

// Express app setup
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse JSON bodies
app.use(session({
  secret: 'your-secret-key', // Change this to a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Initialize chat history in session if not exists
    if (!req.session.history) {
      req.session.history = [];
    }

    // Add user message to history
    req.session.history.push({ role: "user", parts: [{ text: message }] });

    // Call AI with history
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: req.session.history,
      config: {
        tools: [{ functionDeclarations: [searchWebTool] }],
        systemInstruction: `you can use tools to get more information which you don't have.`,
      },
    });

    let reply = '';

    // Check if AI called a function
    if (aiResponse.functionCalls && aiResponse.functionCalls[0]) {
      // Execute the tool
      const result = await tools[aiResponse.functionCalls[0].name](
        aiResponse.functionCalls[0].args
      );

      // Format tool results
      const content = result.map((r) => r.content).join("\n");

      // Add tool result as user message for context
      req.session.history.push({
        role: "user",
        parts: [
          {
            text: `I searched the web for "${aiResponse.functionCalls[0].args.query}" and found the following information: ${content}`,
          },
        ],
      });

      // Get final AI response after tool use
      const finalResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: req.session.history,
        config: {
          systemInstruction: `you can use tools to get more information which you don't have.`,
        },
      });

      reply = finalResponse.text;
      req.session.history.push({ role: "model", parts: [{ text: reply }] });
    } else {
      // Normal AI response
      reply = aiResponse.text;
      req.session.history.push({ role: "model", parts: [{ text: reply }] });
    }

    res.json({ reply });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please set a different PORT in your .env file or kill the process using this port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
