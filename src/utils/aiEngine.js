// Simulated AI response engine — no external API needed

const knowledgeBase = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'howdy'],
    responses: [
      "Hello! I'm ABDAI, your intelligent assistant. How can I help you today?",
      "Hey there! Great to see you. What's on your mind?",
      "Hi! I'm ready to assist you with anything you need. What would you like to explore?",
    ],
  },
  {
    keywords: ['javascript', 'js', 'react', 'node'],
    responses: [
      "JavaScript is an incredibly versatile language! In React, component-based architecture lets you build complex UIs from simple, reusable pieces. The virtual DOM efficiently updates only what changes. Would you like to dive deeper into hooks, state management, or performance optimization?",
      "When working with React, remember these key principles: keep components small and focused, lift state up when needed, and use memoization wisely. The React ecosystem includes powerful tools like React Router for navigation and Zustand or Context for state management.",
      "Modern JavaScript with ES6+ features like destructuring, arrow functions, async/await, and modules makes code cleaner and more expressive. Combined with TypeScript, you get type safety and better developer experience. Want me to explain any specific concept?",
    ],
  },
  {
    keywords: ['python', 'django', 'flask', 'machine learning', 'ml', 'ai'],
    responses: [
      "Python's ecosystem for AI/ML is phenomenal! Libraries like NumPy and Pandas handle data manipulation, Scikit-learn provides classical ML algorithms, and PyTorch or TensorFlow power deep learning. Start with understanding your data, then choose the right algorithm for your problem type.",
      "For machine learning projects, the workflow typically involves: data collection → preprocessing → feature engineering → model selection → training → evaluation → deployment. Python makes each step accessible with well-documented libraries. What specific area interests you?",
      "When building ML models, always start simple — a baseline model helps you understand the problem. Then iterate: add features, try different algorithms, tune hyperparameters. Cross-validation is essential for reliable performance estimates. Need guidance on any specific step?",
    ],
  },
  {
    keywords: ['css', 'style', 'design', 'ui', 'ux', 'layout', 'flexbox', 'grid'],
    responses: [
      "Modern CSS is incredibly powerful! CSS Grid and Flexbox solve most layout challenges. For responsive design, combine fluid typography (clamp()), container queries, and logical properties. CSS custom properties enable dynamic theming without JavaScript.",
      "Great UI design follows core principles: visual hierarchy, consistency, accessibility, and feedback. Use spacing to create rhythm, color to draw attention, and motion to guide users. Always design with accessibility in mind — contrast ratios, focus states, and semantic HTML matter.",
      "For production styling, consider a utility-first approach with CSS modules or a systematic methodology. CSS-in-JS offers scoped styles with JavaScript power. The key is consistency — establish a design token system for colors, spacing, typography, and shadows.",
    ],
  },
  {
    keywords: ['api', 'rest', 'graphql', 'backend', 'server', 'database'],
    responses: [
      "RESTful APIs should follow consistent conventions: use nouns for resources, proper HTTP methods (GET, POST, PUT, DELETE), meaningful status codes, and pagination for collections. GraphQL offers flexibility but adds complexity — choose based on your use case.",
      "For backend architecture, consider the layered approach: routes → controllers → services → data access. This separation keeps code maintainable. For databases, PostgreSQL excels at relational data, MongoDB at flexible schemas, and Redis at caching. Each has its sweet spot.",
      "API security is critical: always validate input, use rate limiting, implement proper authentication (JWT, OAuth2), and never expose sensitive data in responses. CORS should be configured explicitly. Consider API versioning from the start to evolve without breaking clients.",
    ],
  },
  {
    keywords: ['help', 'can you', 'what can', 'feature', 'ability'],
    responses: [
      "I can help you with a wide range of topics:\n\n• **Programming** — JavaScript, Python, CSS, APIs, databases, and more\n• **Architecture** — Design patterns, system design, best practices\n• **Debugging** — Walk through problems step by step\n• **Learning** — Explain concepts at any level\n• **Code Review** — Analyze code for improvements\n\nJust ask me anything!",
    ],
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    responses: [
      "You're welcome! I'm always here to help. Don't hesitate to ask if anything else comes up.",
      "Happy to help! That's what I'm here for. Feel free to continue our conversation anytime.",
      "Glad I could assist! Remember, no question is too small — I'm here to support your learning journey.",
    ],
  },
  {
    keywords: ['code', 'program', 'function', 'algorithm', 'bug', 'error', 'debug'],
    responses: [
      "When debugging code, follow this systematic approach:\n\n1. **Reproduce** the issue consistently\n2. **Isolate** the problematic section\n3. **Read** error messages carefully — they often point to the exact issue\n4. **Check** common culprits: null values, type mismatches, async timing\n5. **Test** your fix with edge cases\n\nShare your code and error, and I'll help you work through it!",
      "Writing clean code involves: meaningful naming, single responsibility, DRY (Don't Repeat Yourself), and proper error handling. Always consider edge cases and write tests. Code is read far more often than it's written, so optimize for readability first.",
    ],
  },
];

const fallbackResponses = [
  "That's an interesting topic! Let me think about this... The key consideration here is understanding the core problem you're trying to solve. Could you tell me more about the specific context or what outcome you're looking for?",
  "Great question! There are multiple angles to approach this from. The best solution depends on your specific requirements, constraints, and goals. Can you share more details so I can give you a more targeted answer?",
  "I appreciate your curiosity! This touches on several important concepts. Let me break it down: the fundamental idea revolves around understanding the relationships between components and how they interact. What aspect would you like me to elaborate on?",
  "That's worth exploring in depth! My recommendation would be to start with the fundamentals, build a solid understanding, then layer on complexity. What's your current experience level with this topic?",
  "Interesting thought! The landscape here is evolving rapidly. Best practices today emphasize modularity, testability, and maintainability. I'd love to help you navigate this — what's your specific use case?",
];

function findResponse(input) {
  const lower = input.toLowerCase();
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.responses[Math.floor(Math.random() * entry.responses.length)];
    }
  }
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Simulate streaming by splitting the response into chunks
export function generateAIResponse(userMessage) {
  const response = findResponse(userMessage);
  return new Promise((resolve) => {
    // Simulate network + processing delay
    const delay = 600 + Math.random() * 800;
    setTimeout(() => resolve(response), delay);
  });
}

// For streaming simulation
export function generateAIStream(userMessage, onChunk, onComplete) {
  const response = findResponse(userMessage);
  const words = response.split(' ');
  let index = 0;
  const interval = setInterval(() => {
    if (index < words.length) {
      onChunk(words[index] + (index < words.length - 1 ? ' ' : ''));
      index++;
    } else {
      clearInterval(interval);
      onComplete();
    }
  }, 30 + Math.random() * 40);
}
