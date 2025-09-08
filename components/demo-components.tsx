"use client"

import React from "react"
import { ToolCallRenderer } from "./tool-call-renderer"
import { CodeBlock } from "./code-block"
import { MermaidDiagram } from "./mermaid-diagram"
import { QuizComponent } from "./quiz-component"

export function DemoComponents() {
  const sampleToolCall = {
    name: "web_search",
    arguments: {
      search_term: "React hooks best practices",
      explanation: "Search for information about React hooks best practices"
    },
    id: "call_123"
  }

  const sampleCode = `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;`

  const sampleMermaid = `graph TD
    A[User Input] --> B{Valid Input?}
    B -->|Yes| C[Process Request]
    B -->|No| D[Show Error]
    C --> E[Generate Response]
    E --> F[Display Result]
    D --> G[Request New Input]`

  const sampleQuiz = {
    title: "React Hooks Quiz",
    questions: [
      {
        id: "1",
        question: "What is the purpose of useEffect hook?",
        options: [
          "To manage component state",
          "To perform side effects in functional components",
          "To create custom hooks",
          "To handle form submissions"
        ],
        correctAnswer: 1,
        explanation: "useEffect is used to perform side effects like data fetching, subscriptions, or manually changing the DOM in functional components."
      },
      {
        id: "2",
        question: "Which hook should you use to manage state in a functional component?",
        options: [
          "useState",
          "useEffect",
          "useContext",
          "useReducer"
        ],
        correctAnswer: 0,
        explanation: "useState is the primary hook for managing local state in functional components."
      }
    ]
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Component Demo</h1>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Tool Call Renderer</h2>
        <ToolCallRenderer toolCall={sampleToolCall} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Code Block</h2>
        <CodeBlock 
          code={sampleCode} 
          language="javascript" 
          filename="Counter.jsx"
          showLineNumbers={true}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Mermaid Diagram</h2>
        <MermaidDiagram 
          definition={sampleMermaid}
          title="Process Flow Diagram"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Quiz Component</h2>
        <QuizComponent 
          questions={sampleQuiz.questions}
          title={sampleQuiz.title}
        />
      </div>
    </div>
  )
}
