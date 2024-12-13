import api from "@/utils/api.js"

// 提交请假申请
export function submitLeave(data) {
  return api.post("/leave/submit", data)
}

// 获取请假记录
export function getLeaveRecords(data) {
  return api.post("/leave/records", data)
}

// 撤回请假申请
export function cancelLeave(data) {
  return api.post("/leave/cancel", data)
}

// 获取请假详情
export function getLeaveDetail(data) {
  return api.post("/leave/detail", data)
}

// 上传附件
export function uploadAttachment(data) {
  return api.post("/leave/upload", data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
} 
