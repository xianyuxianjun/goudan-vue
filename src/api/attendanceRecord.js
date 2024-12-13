import api from "@/utils/api.js"

// 获取考勤记录列表
export function getAttendanceList() {
  return api.post("/attendanceRecord/list")
}

// 获取考勤记录（按月份）
export function getAttendanceRecordByMonth(data) {
  return api.post("/attendanceRecord/getByMonth", data)
}

// 获取考勤记录（按日期）
export function getAttendanceListByDate(data) {
  return api.post("/attendanceRecord/getByDate", data)
}

// 签到
export function checkIn(data) {
  return api.post("/attendanceRecord/checkIn", data)
}

// 签退
export function checkOut(data) {
  return api.post("/attendanceRecord/checkOut", data)
}

