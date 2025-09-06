// CodeSandbox Production Configuration
export const CODESANDBOX_CONFIG = {
  // VM Size Configuration - Start with smallest for cost control
  VM_SIZE: 'nano', // nano, small, medium, large, xlarge
  
  // Resource Limits
  MAX_SESSION_DURATION: 30 * 60 * 1000, // 30 minutes in milliseconds
  MAX_CONCURRENT_SESSIONS: 5, // Per user
  AUTO_HIBERNATE_DELAY: 15 * 60 * 1000, // 15 minutes of inactivity
  
  // Performance Settings
  LAZY_LOAD: true,
  PRELOAD_ON_HOVER: false, // Don't preload on hover to save resources
  
  // Security Settings
  ALLOWED_ORIGINS: ['https://codesandbox.io'],
  SANDBOX_ATTRIBUTES: [
    'allow-forms',
    'allow-modals', 
    'allow-popups',
    'allow-presentation',
    'allow-same-origin',
    'allow-scripts'
  ],
  
  // Error Handling
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000, // 2 seconds
  
  // Monitoring
  ENABLE_PERFORMANCE_MONITORING: true,
  LOG_RESOURCE_USAGE: true,
  
  // Cost Control
  ENABLE_SPENDING_LIMITS: true,
  MAX_CREDITS_PER_USER: 100, // Adjust based on your plan
  WARN_AT_CREDIT_THRESHOLD: 80, // Warn when 80% of credits used
}

// Resource monitoring utilities
export class CodeSandboxResourceMonitor {
  private static instance: CodeSandboxResourceMonitor
  private activeSessions = new Map<string, { startTime: number; lastActivity: number }>()
  private resourceUsage = new Map<string, { cpu: number; memory: number; network: number }>()

  static getInstance(): CodeSandboxResourceMonitor {
    if (!CodeSandboxResourceMonitor.instance) {
      CodeSandboxResourceMonitor.instance = new CodeSandboxResourceMonitor()
    }
    return CodeSandboxResourceMonitor.instance
  }

  startSession(sessionId: string): void {
    this.activeSessions.set(sessionId, {
      startTime: Date.now(),
      lastActivity: Date.now()
    })
  }

  updateActivity(sessionId: string): void {
    const session = this.activeSessions.get(sessionId)
    if (session) {
      session.lastActivity = Date.now()
    }
  }

  endSession(sessionId: string): void {
    this.activeSessions.delete(sessionId)
    this.resourceUsage.delete(sessionId)
  }

  getActiveSessionCount(): number {
    return this.activeSessions.size
  }

  shouldHibernate(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId)
    if (!session) return false

    const inactiveTime = Date.now() - session.lastActivity
    return inactiveTime > CODESANDBOX_CONFIG.AUTO_HIBERNATE_DELAY
  }

  getSessionDuration(sessionId: string): number {
    const session = this.activeSessions.get(sessionId)
    if (!session) return 0
    return Date.now() - session.startTime
  }

  isSessionExpired(sessionId: string): boolean {
    const duration = this.getSessionDuration(sessionId)
    return duration > CODESANDBOX_CONFIG.MAX_SESSION_DURATION
  }

  // Cleanup inactive sessions
  cleanupInactiveSessions(): void {
    const now = Date.now()
    for (const [sessionId, session] of this.activeSessions) {
      const inactiveTime = now - session.lastActivity
      if (inactiveTime > CODESANDBOX_CONFIG.AUTO_HIBERNATE_DELAY) {
        this.endSession(sessionId)
      }
    }
  }
}

// Error handling utilities
export class CodeSandboxErrorHandler {
  static handleError(error: Error, context: string): void {
    console.error(`CodeSandbox Error [${context}]:`, error)
    
    // Log to monitoring service (e.g., Sentry, LogRocket)
    if (typeof window !== 'undefined' && ((window as unknown) as Record<string, unknown>).Sentry) {
      (((window as unknown) as Record<string, unknown>).Sentry as { captureException?: (error: Error, context: unknown) => void }).captureException?.(error, { tags: { context } })
    }
  }

  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxAttempts: number = CODESANDBOX_CONFIG.MAX_RETRY_ATTEMPTS
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        if (attempt < maxAttempts) {
          await new Promise(resolve => 
            setTimeout(resolve, CODESANDBOX_CONFIG.RETRY_DELAY * attempt)
          )
        }
      }
    }
    
    throw lastError!
  }
}

// Performance monitoring
export class CodeSandboxPerformanceMonitor {
  private static instance: CodeSandboxPerformanceMonitor
  private metrics: Array<{ timestamp: number; metric: string; value: number }> = []

  static getInstance(): CodeSandboxPerformanceMonitor {
    if (!CodeSandboxPerformanceMonitor.instance) {
      CodeSandboxPerformanceMonitor.instance = new CodeSandboxPerformanceMonitor()
    }
    return CodeSandboxPerformanceMonitor.instance
  }

  recordMetric(metric: string, value: number): void {
    if (!CODESANDBOX_CONFIG.ENABLE_PERFORMANCE_MONITORING) return
    
    this.metrics.push({
      timestamp: Date.now(),
      metric,
      value
    })

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }

  getMetrics(metricName?: string): Array<{ timestamp: number; metric: string; value: number }> {
    if (metricName) {
      return this.metrics.filter(m => m.metric === metricName)
    }
    return [...this.metrics]
  }

  getAverageMetric(metricName: string, timeWindow: number = 5 * 60 * 1000): number {
    const now = Date.now()
    const recentMetrics = this.metrics.filter(
      m => m.metric === metricName && (now - m.timestamp) < timeWindow
    )
    
    if (recentMetrics.length === 0) return 0
    
    const sum = recentMetrics.reduce((acc, m) => acc + m.value, 0)
    return sum / recentMetrics.length
  }
}
