import { differenceInBusinessDays } from 'date-fns'

export function calculateLeaveDuration(startTime, endTime) {
  try {
    // 将字符串转换为日期对象
    const start = new Date(startTime)
    const end = new Date(endTime)
    
    // 验证日期是否有效
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('无效的日期格式')
    }
    
    // 计算工作日天数（不包括周末）
    const duration = differenceInBusinessDays(end, start) + 1 // 加1是因为包含当天
    
    return Math.max(duration, 0).toFixed(1)
  } catch (error) {
    console.error('计算请假天数失败:', error)
    
    return '0.0'
  }
} 
