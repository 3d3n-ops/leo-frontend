"use client"

import React from "react"
import { MessageRenderer } from "./message-renderer"

export function SampleMessage() {
  const sampleContent = `Here's an example of how tool calls and special blocks are rendered in our chat interface.

## Tool Call Example

I'll search for information about React best practices:

\`\`\`tool
{
  "name": "web_search",
  "arguments": {
    "search_term": "React hooks best practices 2024",
    "explanation": "Search for the latest React hooks best practices and patterns"
  },
  "id": "call_456"
}
\`\`\`

## Code Block Example

Here's a sample React component with proper TypeScript:

\`\`\`typescript
import React, { useState, useEffect } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

const Counter: React.FC<CounterProps> = ({ 
  initialValue = 0, 
  step = 1 
}) => {
  const [count, setCount] = useState(initialValue);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  
  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <button onClick={increment}>+{step}</button>
      <button onClick={decrement}>-{step}</button>
    </div>
  );
};

export default Counter;
\`\`\`

## Mermaid Diagram Example

Here's a flowchart showing the component lifecycle:

\`\`\`mermaid
graph TD
    A[Component Mount] --> B[useState Initialization]
    B --> C[useEffect Setup]
    C --> D[Render Phase]
    D --> E{State Changed?}
    E -->|Yes| F[Re-render]
    E -->|No| G[Wait for Events]
    F --> D
    G --> H[User Interaction]
    H --> I[State Update]
    I --> E
    D --> J[Component Unmount]
    J --> K[Cleanup Effects]
\`\`\`

## Quiz Example

Let's test your React knowledge:

\`\`\`quiz
{
  "title": "React Hooks Quiz",
  "questions": [
    {
      "id": "1",
      "question": "What is the correct way to update state based on previous state?",
      "options": [
        "setState(newValue)",
        "setState(prevState => newValue)",
        "state = newValue",
        "this.state = newValue"
      ],
      "correctAnswer": 1,
      "explanation": "You should use the functional form of setState to ensure you're working with the most current state value."
    },
    {
      "id": "2",
      "question": "When does useEffect run?",
      "options": [
        "Only on component mount",
        "After every render",
        "Only when dependencies change",
        "Both on mount and when dependencies change"
      ],
      "correctAnswer": 3,
      "explanation": "useEffect runs after every render by default, but you can control when it runs using the dependency array."
    }
  ]
}
\`\`\`

## Regular Markdown

This is regular markdown content that will be rendered normally with all the standard formatting options like **bold text**, *italic text*, and [links](https://example.com).

### Lists
- First item
- Second item
- Third item

### Code inline
You can also use \`inline code\` within regular text.

The components above demonstrate how different types of content blocks are rendered with proper styling and functionality.`

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sample Message with All Components</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
        <MessageRenderer content={sampleContent} />
      </div>
    </div>
  )
}
