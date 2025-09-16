"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download } from "lucide-react"
import { motion } from "framer-motion"
import 'katex/dist/katex.min.css'

interface MathFormulaProps {
  formula: string
  displayMode?: boolean
  className?: string
  showRaw?: boolean
}

export function MathFormula({ 
  formula, 
  displayMode = true, 
  className = "",
  showRaw = false
}: MathFormulaProps) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [renderedFormula, setRenderedFormula] = useState<string>("")

  useEffect(() => {
    const renderFormula = async () => {
      try {
        setError(null)
        // Import KaTeX dynamically to avoid SSR issues
        const katex = (await import('katex')).default
        
        const html = katex.renderToString(formula, {
          displayMode,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: false,
          trust: true,
          macros: {
            "\\f": "#1f(#2)",
            "\\RR": "\\mathbb{R}",
            "\\NN": "\\mathbb{N}",
            "\\ZZ": "\\mathbb{Z}",
            "\\QQ": "\\mathbb{Q}",
            "\\CC": "\\mathbb{C}",
            "\\FF": "\\mathbb{F}",
            "\\PP": "\\mathbb{P}",
            "\\EE": "\\mathbb{E}",
            "\\Var": "\\text{Var}",
            "\\Cov": "\\text{Cov}",
            "\\Corr": "\\text{Corr}",
            "\\argmax": "\\mathop{\\mathrm{argmax}}",
            "\\argmin": "\\mathop{\\mathrm{argmin}}",
            "\\max": "\\mathop{\\mathrm{max}}",
            "\\min": "\\mathop{\\mathrm{min}}",
            "\\sup": "\\mathop{\\mathrm{sup}}",
            "\\inf": "\\mathop{\\mathrm{inf}}",
            "\\lim": "\\mathop{\\mathrm{lim}}",
            "\\limsup": "\\mathop{\\mathrm{lim\\,sup}}",
            "\\liminf": "\\mathop{\\mathrm{lim\\,inf}}",
            "\\sin": "\\mathop{\\mathrm{sin}}",
            "\\cos": "\\mathop{\\mathrm{cos}}",
            "\\tan": "\\mathop{\\mathrm{tan}}",
            "\\sinh": "\\mathop{\\mathrm{sinh}}",
            "\\cosh": "\\mathop{\\mathrm{cosh}}",
            "\\tanh": "\\mathop{\\mathrm{tanh}}",
            "\\arcsin": "\\mathop{\\mathrm{arcsin}}",
            "\\arccos": "\\mathop{\\mathrm{arccos}}",
            "\\arctan": "\\mathop{\\mathrm{arctan}}",
            "\\log": "\\mathop{\\mathrm{log}}",
            "\\ln": "\\mathop{\\mathrm{ln}}",
            "\\exp": "\\mathop{\\mathrm{exp}}",
            "\\gcd": "\\mathop{\\mathrm{gcd}}",
            "\\lcm": "\\mathop{\\mathrm{lcm}}",
            "\\det": "\\mathop{\\mathrm{det}}",
            "\\rank": "\\mathop{\\mathrm{rank}}",
            "\\dim": "\\mathop{\\mathrm{dim}}",
            "\\ker": "\\mathop{\\mathrm{ker}}",
            "\\im": "\\mathop{\\mathrm{im}}",
            "\\tr": "\\mathop{\\mathrm{tr}}",
            "\\diag": "\\mathop{\\mathrm{diag}}",
            "\\trace": "\\mathop{\\mathrm{tr}}",
            "\\proj": "\\mathop{\\mathrm{proj}}",
            "\\perp": "\\perp",
            "\\parallel": "\\parallel",
            "\\cong": "\\cong",
            "\\sim": "\\sim",
            "\\simeq": "\\simeq",
            "\\approx": "\\approx",
            "\\equiv": "\\equiv",
            "\\propto": "\\propto",
            "\\subset": "\\subset",
            "\\supset": "\\supset",
            "\\subseteq": "\\subseteq",
            "\\supseteq": "\\supseteq",
            "\\subsetneq": "\\subsetneq",
            "\\supsetneq": "\\supsetneq",
            "\\in": "\\in",
            "\\ni": "\\ni",
            "\\notin": "\\notin",
            "\\notni": "\\notni",
            "\\emptyset": "\\emptyset",
            "\\varnothing": "\\varnothing",
            "\\cap": "\\cap",
            "\\cup": "\\cup",
            "\\sqcap": "\\sqcap",
            "\\sqcup": "\\sqcup",
            "\\wedge": "\\wedge",
            "\\vee": "\\vee",
            "\\land": "\\land",
            "\\lor": "\\lor",
            "\\neg": "\\neg",
            "\\lnot": "\\lnot",
            "\\forall": "\\forall",
            "\\exists": "\\exists",
            "\\nexists": "\\nexists",
            "\\therefore": "\\therefore",
            "\\because": "\\because",
            "\\implies": "\\implies",
            "\\iff": "\\iff",
            "\\rightarrow": "\\rightarrow",
            "\\leftarrow": "\\leftarrow",
            "\\leftrightarrow": "\\leftrightarrow",
            "\\Rightarrow": "\\Rightarrow",
            "\\Leftarrow": "\\Leftarrow",
            "\\Leftrightarrow": "\\Leftrightarrow",
            "\\mapsto": "\\mapsto",
            "\\to": "\\to",
            "\\gets": "\\gets",
            "\\longleftarrow": "\\longleftarrow",
            "\\longrightarrow": "\\longrightarrow",
            "\\longleftrightarrow": "\\longleftrightarrow",
            "\\Longleftarrow": "\\Longleftarrow",
            "\\Longrightarrow": "\\Longrightarrow",
            "\\Longleftrightarrow": "\\Longleftrightarrow",
            "\\hookleftarrow": "\\hookleftarrow",
            "\\hookrightarrow": "\\hookrightarrow",
            "\\leftharpoonup": "\\leftharpoonup",
            "\\rightharpoonup": "\\rightharpoonup",
            "\\leftharpoondown": "\\leftharpoondown",
            "\\rightharpoondown": "\\rightharpoondown",
            "\\rightleftharpoons": "\\rightleftharpoons",
            "\\leadsto": "\\leadsto",
            "\\uparrow": "\\uparrow",
            "\\downarrow": "\\downarrow",
            "\\updownarrow": "\\updownarrow",
            "\\Uparrow": "\\Uparrow",
            "\\Downarrow": "\\Downarrow",
            "\\Updownarrow": "\\Updownarrow",
            "\\nearrow": "\\nearrow",
            "\\searrow": "\\searrow",
            "\\swarrow": "\\swarrow",
            "\\nwarrow": "\\nwarrow",
            "\\pm": "\\pm",
            "\\mp": "\\mp",
            "\\times": "\\times",
            "\\div": "\\div",
            "\\ast": "\\ast",
            "\\star": "\\star",
            "\\bullet": "\\bullet",
            "\\cdot": "\\cdot",
            "\\circ": "\\circ",
            "\\bigcirc": "\\bigcirc",
            "\\diamond": "\\diamond",
            "\\lozenge": "\\lozenge",
            "\\blacklozenge": "\\blacklozenge",
            "\\bigtriangleup": "\\bigtriangleup",
            "\\bigtriangledown": "\\bigtriangledown",
            "\\triangle": "\\triangle",
            "\\triangledown": "\\triangledown",
            "\\blacktriangle": "\\blacktriangle",
            "\\blacktriangledown": "\\blacktriangledown",
            "\\triangleleft": "\\triangleleft",
            "\\triangleright": "\\triangleright",
            "\\blacktriangleleft": "\\blacktriangleleft",
            "\\blacktriangleright": "\\blacktriangleright",
            "\\square": "\\square",
            "\\blacksquare": "\\blacksquare",
            "\\diamondsuit": "\\diamondsuit",
            "\\heartsuit": "\\heartsuit",
            "\\clubsuit": "\\clubsuit",
            "\\spadesuit": "\\spadesuit",
            "\\flat": "\\flat",
            "\\natural": "\\natural",
            "\\sharp": "\\sharp",
            "\\angle": "\\angle",
            "\\measuredangle": "\\measuredangle",
            "\\sphericalangle": "\\sphericalangle",
            "\\surd": "\\surd",
            "\\sqrt": "\\sqrt",
            "\\cbrt": "\\sqrt[3]",
            "\\sqrt[n]": "\\sqrt[n]",
            "\\infty": "\\infty",
            "\\aleph": "\\aleph",
            "\\hbar": "\\hbar",
            "\\ell": "\\ell",
            "\\wp": "\\wp",
            "\\Re": "\\Re",
            "\\Im": "\\Im",
            "\\partial": "\\partial",
            "\\nabla": "\\nabla",
            "\\sum": "\\sum",
            "\\prod": "\\prod",
            "\\coprod": "\\coprod",
            "\\int": "\\int",
            "\\iint": "\\iint",
            "\\iiint": "\\iiint",
            "\\oint": "\\oint",
            "\\bigcap": "\\bigcap",
            "\\bigcup": "\\bigcup",
            "\\bigwedge": "\\bigwedge",
            "\\bigvee": "\\bigvee",
            "\\bigotimes": "\\bigotimes",
            "\\bigoplus": "\\bigoplus",
            "\\bigodot": "\\bigodot",
            "\\biguplus": "\\biguplus",
            "\\bigsqcup": "\\bigsqcup",
            "\\bigstar": "\\bigstar",
            "\\bigbullet": "\\bigbullet",
            "\\bigdiamond": "\\bigdiamond",
            "\\biglozenge": "\\biglozenge",
            "\\bigblacklozenge": "\\bigblacklozenge",
            "\\bigblacktriangle": "\\bigblacktriangle",
            "\\bigblacktriangledown": "\\bigblacktriangledown",
            "\\bigtriangleleft": "\\bigtriangleleft",
            "\\bigtriangleright": "\\bigtriangleright",
            "\\bigblacktriangleleft": "\\bigblacktriangleleft",
            "\\bigblacktriangleright": "\\bigblacktriangleright",
            "\\bigsquare": "\\bigsquare",
            "\\bigblacksquare": "\\bigblacksquare",
            "\\bigdiamondsuit": "\\bigdiamondsuit",
            "\\bigheartsuit": "\\bigheartsuit",
            "\\bigclubsuit": "\\bigclubsuit",
            "\\bigspadesuit": "\\bigspadesuit",
            "\\bigflat": "\\bigflat",
            "\\bignatural": "\\bignatural",
            "\\bigsharp": "\\bigsharp",
            "\\bigangle": "\\bigangle",
            "\\bigmeasuredangle": "\\bigmeasuredangle",
            "\\bigsphericalangle": "\\bigsphericalangle",
            "\\bigsurd": "\\bigsurd",
            "\\bigsqrt": "\\bigsqrt",
            "\\bigcbrt": "\\bigsqrt[3]",
            "\\bigsqrt[n]": "\\bigsqrt[n]",
            "\\bigpropto": "\\bigpropto",
            "\\biginfty": "\\biginfty",
            "\\bigaleph": "\\bigaleph",
            "\\bighbar": "\\bighbar",
            "\\bigell": "\\bigell",
            "\\bigwp": "\\bigwp",
            "\\bigRe": "\\bigRe",
            "\\bigIm": "\\bigIm",
            "\\bigpartial": "\\bigpartial",
            "\\bignabla": "\\bignabla"
          }
        })
        
        setRenderedFormula(html)
      } catch (err) {
        console.error('KaTeX rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render formula')
        setRenderedFormula(formula) // Fallback to raw formula
      }
    }

    if (formula) {
      renderFormula()
    }
  }, [formula, displayMode])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formula)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy formula:", error)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([formula], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `formula.tex`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <div className={`my-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-red-800 dark:text-red-200">
            LaTeX Rendering Error
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            >
              {copied ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="h-3 w-3" />
                </motion.div>
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <div className="text-sm text-red-700 dark:text-red-300 mb-2">
          {error}
        </div>
        <div className="text-sm font-mono text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-2 rounded">
          {formula}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative my-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            LaTeX
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 px-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {copied ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="h-3 w-3" />
              </motion.div>
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Math Content */}
      <div className="bg-white dark:bg-gray-900 p-4">
        <div 
          className={`text-center ${displayMode ? 'text-lg' : 'text-base'} text-gray-900 dark:text-gray-100`}
          dangerouslySetInnerHTML={{ __html: renderedFormula }}
        />
        
        {showRaw && (
          <details className="mt-4">
            <summary className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200">
              Show raw LaTeX
            </summary>
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
              <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono overflow-x-auto">
                <code>{formula}</code>
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
