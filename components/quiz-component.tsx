"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle, RotateCcw, Award } from "lucide-react"
import { motion } from "framer-motion"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface QuizComponentProps {
  questions: QuizQuestion[]
  title?: string
  className?: string
}

interface QuizState {
  currentQuestion: number
  selectedAnswers: (number | null)[]
  isSubmitted: boolean
  score: number
  showResults: boolean
}

export function QuizComponent({ questions, title = "Quiz", className = "" }: QuizComponentProps) {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: new Array(questions.length).fill(null),
    isSubmitted: false,
    score: 0,
    showResults: false
  })

  const handleAnswerSelect = (answerIndex: number) => {
    if (state.isSubmitted) return

    setState(prev => ({
      ...prev,
      selectedAnswers: prev.selectedAnswers.map((answer, index) => 
        index === prev.currentQuestion ? answerIndex : answer
      )
    }))
  }

  const handleNext = () => {
    if (state.currentQuestion < questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }))
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (state.currentQuestion > 0) {
      setState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }))
    }
  }

  const handleSubmit = () => {
    const score = state.selectedAnswers.reduce((acc: number, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)

    setState(prev => ({
      ...prev,
      isSubmitted: true,
      score,
      showResults: true
    }))
  }

  const handleReset = () => {
    setState({
      currentQuestion: 0,
      selectedAnswers: new Array(questions.length).fill(null),
      isSubmitted: false,
      score: 0,
      showResults: false
    })
  }

  const currentQuestion = questions[state.currentQuestion]
  const progress = ((state.currentQuestion + 1) / questions.length) * 100

  if (state.showResults) {
    const percentage = Math.round((state.score / questions.length) * 100)
    
    return (
      <Card className={`my-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 ${className}`}>
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-4"
          >
            <Award className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
              Quiz Complete!
            </h3>
            <p className="text-lg text-green-700 dark:text-green-300">
              You scored {state.score} out of {questions.length} ({percentage}%)
            </p>
          </motion.div>

          <div className="space-y-4 mb-6">
            {questions.map((question, index) => {
              const selectedAnswer = state.selectedAnswers[index]
              const isCorrect = selectedAnswer === question.correctAnswer
              
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-left p-4 bg-white dark:bg-gray-800 rounded-lg border"
                >
                  <p className="font-medium mb-2">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswer === optionIndex
                      const isCorrectOption = optionIndex === question.correctAnswer
                      
                      return (
                        <div
                          key={optionIndex}
                          className={`flex items-center space-x-2 p-2 rounded ${
                            isCorrectOption
                              ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                              : isSelected && !isCorrect
                              ? 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'
                              : 'bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          {isCorrectOption ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : isSelected && !isCorrect ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-gray-300" />
                          )}
                          <span className={isCorrectOption ? 'font-medium text-green-800 dark:text-green-200' : ''}>
                            {option}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  {question.explanation && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                      {question.explanation}
                    </p>
                  )}
                </motion.div>
              )
            })}
          </div>

          <Button onClick={handleReset} className="bg-green-600 hover:bg-green-700">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`my-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20 ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="font-semibold text-orange-900 dark:text-orange-100">
              {title}
            </span>
          </div>
          <span className="text-sm text-orange-700 dark:text-orange-300">
            {state.currentQuestion + 1} of {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <motion.div
            className="bg-orange-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {currentQuestion.question}
          </h3>
          
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = state.selectedAnswers[state.currentQuestion] === index
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={state.currentQuestion === 0}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={state.selectedAnswers[state.currentQuestion] === null}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {state.currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
