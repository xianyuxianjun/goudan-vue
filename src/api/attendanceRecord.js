import api from "@/utils/api"

// 获取考勤记录列表（管理员）
export function getAttendanceList(data) {
  return api.post("/attendanceRecord/list", {
    date: data.date, // YYYY-MM-DD 格式
  })
}

// 获取考勤记录（按月份）
export function getAttendanceRecordByMonth(data) {
  return api.post("/attendanceRecord/getByMonth", {
    userId: data.userId,
    month: data.month, // YYYY-MM 格式
  })
}

// 用户获取考勤记录（按日期）
export function getAttendanceListByDate(data) {
  return api.post("/attendanceRecord/getByDate", data)
}

// 签到
export function checkIn(data) {
  return api.post("/attendanceRecord/add", data)
}

// 签退
export function checkOut(data) {
  return api.post("/attendanceRecord/update", data)
}

