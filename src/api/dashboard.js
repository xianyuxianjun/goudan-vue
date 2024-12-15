import api from "@/utils/api"

// 获取首页统计数据
export function getDashboardStats() {
  return api.post("/dashboard/stats")
}

// 获取签到排行榜
export function getCheckInRanking(type) { // type: 'today' 或 'monthly'
  return api.post("/dashboard/ranking", {
    type,
  })
}

// 获取最近请假记录
export function getRecentLeaves() {
  return api.post("/dashboard/recentLeaves")
} 
