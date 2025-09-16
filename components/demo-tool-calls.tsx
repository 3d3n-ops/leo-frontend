"use client"

import React from "react"
import { ToolCallRenderer } from "./tool-call-renderer"

// Demo tool calls to test the rendering
const demoToolCalls = [
  {
    name: "write_math",
    arguments: {
      formula: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}",
      explanation: "This is the famous Gaussian integral, which evaluates to the square root of pi.",
      steps: "1. Use the substitution u = x²\n2. Apply the gamma function\n3. Use the fact that Γ(1/2) = √π",
      context: "This integral appears frequently in probability theory and statistics."
    },
    id: "math-1"
  },
  {
    name: "write_code",
    arguments: {
      language: "python",
      code: `def fibonacci(n):
    """Calculate the nth Fibonacci number using dynamic programming."""
    if n <= 1:
        return n
    
    # Initialize the first two Fibonacci numbers
    fib = [0, 1]
    
    # Calculate Fibonacci numbers up to n
    for i in range(2, n + 1):
        fib.append(fib[i - 1] + fib[i - 2])
    
    return fib[n]

# Example usage
print(fibonacci(10))  # Output: 55`,
      explanation: "This function calculates Fibonacci numbers using dynamic programming for O(n) time complexity.",
      use_case: "Useful for calculating large Fibonacci numbers efficiently."
    },
    id: "code-1"
  },
  {
    name: "write_math",
    arguments: {
      formula: "\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
      explanation: "This is the definition of a partial derivative.",
      steps: "1. Take the limit as h approaches 0\n2. Apply the difference quotient\n3. Evaluate the limit",
      context: "Fundamental concept in calculus and mathematical analysis."
    },
    id: "math-2"
  },
  {
    name: "write_code",
    arguments: {
      language: "javascript",
      code: `// React component for rendering math formulas
import React from 'react';
import { MathFormula } from './math-formula';

const MathExample = () => {
  const formula = "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}";
  
  return (
    <div className="math-container">
      <h2>Sum of Natural Numbers</h2>
      <MathFormula 
        formula={formula}
        displayMode={true}
        showRaw={true}
      />
    </div>
  );
};

export default MathExample;`,
      explanation: "A React component that demonstrates how to use the MathFormula component.",
      use_case: "Useful for creating interactive math content in React applications."
    },
    id: "code-2"
  }
]

export function DemoToolCalls() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Tool Call Rendering Demo
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        This demo shows how the tool call renderer handles LaTeX math formulas and code with syntax highlighting.
      </p>
      
      {demoToolCalls.map((toolCall) => (
        <ToolCallRenderer 
          key={toolCall.id} 
          toolCall={toolCall} 
        />
      ))}
    </div>
  )
}
