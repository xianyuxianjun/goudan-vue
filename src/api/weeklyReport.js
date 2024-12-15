import api from "@/utils/api"

// 获取我的周报列表
export function getMyWeeklyReports(data) {
  return api.post("/weeklyReport/myList", {
    userId: data.userId,
    month: data.month, // YYYY-MM 格式，可选
  })
}

// 获取所有周报（管理员）
export function getAllWeeklyReports() {
  return api.post("/weeklyReport/list")
}

// 提交周报
export function submitWeeklyReport(data) {
  return api.post("/weeklyReport/submit", {
    userId: data.userId,
    name: data.name,
    groupName: data.groupName || '',
    reportDate: data.reportDate,
    weekNumber: data.weekNumber,
    completedWork: data.completedWork.trim(),
    nextWeekPlan: data.nextWeekPlan.trim(),
    problems: data.problems?.trim() || '',
    suggestions: data.suggestions?.trim() || '',
    status: '待审阅',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

// 更新周报
export function updateWeeklyReport(data) {
  return api.post("/weeklyReport/update", {
    id: data.id,
    completedWork: data.completedWork,
    nextWeekPlan: data.nextWeekPlan,
    problems: data.problems,
    suggestions: data.suggestions,
  })
}

// 审阅周报
export function reviewWeeklyReport(data) {
  return api.post("/weeklyReport/review", {
    id: data.id,
    reviewerId: data.reviewerId,
    reviewerName: data.reviewerName,
    reviewComment: data.reviewComment,
  })
}

// 获取周报统计信息
export function getWeeklyReportStatistics(data) {
  return api.post("/weeklyReport/statistics", {
    userId: data.userId,
    year: data.year,
  })
} 
