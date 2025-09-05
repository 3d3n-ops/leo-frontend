# CodeSandbox Production Deployment Guide

## Overview
This guide covers the production-ready implementation of CodeSandbox integration in your web application, including resource management, performance optimization, and cost control.

## Key Production Features Implemented

### 1. **Resource Management**
- ✅ **Lazy Loading**: CodeSandbox only loads when the code tab is first opened
- ✅ **Session Limits**: Maximum 5 concurrent sessions per user
- ✅ **Auto-Hibernation**: VMs hibernate after 15 minutes of inactivity
- ✅ **Session Expiration**: Sessions expire after 30 minutes
- ✅ **VM Size Control**: Uses nano VMs by default for cost efficiency

### 2. **Performance Optimization**
- ✅ **Iframe Optimization**: Lazy loading with proper error handling
- ✅ **Memory Management**: Automatic cleanup of inactive sessions
- ✅ **Performance Monitoring**: Tracks metrics for optimization
- ✅ **Error Recovery**: Automatic retry mechanisms

### 3. **Cost Control**
- ✅ **VM Size Limits**: Starts with nano VMs (2 cores, 4GB RAM)
- ✅ **Session Management**: Prevents resource leaks
- ✅ **Auto-Hibernation**: Reduces active VM time
- ✅ **Usage Monitoring**: Tracks resource consumption

## Configuration Options

### VM Sizes (Cost vs Performance)
```typescript
// In codesandbox-config.ts
VM_SIZE: 'nano'    // 2 cores, 4GB RAM - $0.10/hour
VM_SIZE: 'small'   // 4 cores, 8GB RAM - $0.20/hour  
VM_SIZE: 'medium'  // 8 cores, 16GB RAM - $0.40/hour
VM_SIZE: 'large'   // 16 cores, 32GB RAM - $0.80/hour
VM_SIZE: 'xlarge'  // 32 cores, 64GB RAM - $1.60/hour
```

### Resource Limits
```typescript
MAX_SESSION_DURATION: 30 * 60 * 1000,  // 30 minutes
MAX_CONCURRENT_SESSIONS: 5,             // Per user
AUTO_HIBERNATE_DELAY: 15 * 60 * 1000,  // 15 minutes
```

## Production Deployment Checklist

### 1. **Environment Setup**
- [ ] Set up CodeSandbox API keys
- [ ] Configure spending limits in CodeSandbox dashboard
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure CDN for iframe optimization

### 2. **Monitoring Setup**
- [ ] Enable performance monitoring
- [ ] Set up error tracking
- [ ] Configure resource usage alerts
- [ ] Set up cost monitoring

### 3. **Security Configuration**
- [ ] Configure CORS settings
- [ ] Set up CSP headers for iframe
- [ ] Implement rate limiting
- [ ] Set up user authentication

### 4. **Performance Testing**
- [ ] Load test with multiple concurrent users
- [ ] Test VM hibernation behavior
- [ ] Verify memory cleanup
- [ ] Test error recovery

## Cost Optimization Strategies

### 1. **Start Small**
- Begin with nano VMs
- Monitor usage patterns
- Scale up only when needed

### 2. **Implement Usage Policies**
- Set session time limits
- Implement user quotas
- Use auto-hibernation

### 3. **Monitor and Optimize**
- Track VM usage patterns
- Identify peak usage times
- Optimize VM sizes based on actual usage

## Monitoring and Alerts

### Key Metrics to Track
- Active session count
- VM utilization
- Error rates
- Cost per user
- Session duration

### Recommended Alerts
- High concurrent session count (>80% of limit)
- High error rate (>5%)
- Unusual cost spikes
- VM hibernation failures

## Troubleshooting

### Common Issues
1. **Iframe Loading Failures**
   - Check CORS settings
   - Verify CodeSandbox API status
   - Check network connectivity

2. **High Resource Usage**
   - Review VM size settings
   - Check for memory leaks
   - Implement stricter session limits

3. **Cost Overruns**
   - Review VM size allocations
   - Check for abandoned sessions
   - Implement spending alerts

## Scaling Considerations

### Horizontal Scaling
- Implement load balancing
- Use multiple CodeSandbox regions
- Consider CDN for iframe delivery

### Vertical Scaling
- Monitor VM performance
- Upgrade VM sizes as needed
- Implement dynamic VM sizing

## Security Best Practices

### 1. **Iframe Security**
- Use proper sandbox attributes
- Implement CSP headers
- Validate iframe sources

### 2. **User Management**
- Implement session limits
- Use authentication
- Monitor user behavior

### 3. **Resource Protection**
- Set spending limits
- Implement rate limiting
- Monitor for abuse

## Maintenance

### Regular Tasks
- Review usage metrics weekly
- Check cost reports monthly
- Update VM sizes as needed
- Monitor error rates

### Updates
- Keep CodeSandbox integration updated
- Monitor for new features
- Review configuration settings

## Support and Resources

### CodeSandbox Resources
- [CodeSandbox Documentation](https://codesandbox.io/docs)
- [CodeSandbox API Reference](https://codesandbox.io/docs/api)
- [CodeSandbox Support](https://codesandbox.io/support)

### Monitoring Tools
- Sentry for error tracking
- LogRocket for session replay
- Custom metrics dashboard
- CodeSandbox usage dashboard

## Conclusion

This production-ready implementation provides:
- **Cost Control**: Efficient resource usage with spending limits
- **Performance**: Optimized loading and memory management
- **Reliability**: Error handling and recovery mechanisms
- **Scalability**: Session management and monitoring
- **Security**: Proper sandboxing and access controls

The system is designed to handle multiple concurrent users while maintaining performance and controlling costs. Regular monitoring and optimization will ensure smooth operation in production.
