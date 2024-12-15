import api from "@/utils/api"

// 获取请假申请列表（员工查看自己的）
export function getMyLeaveApplications(data) {
  return api.post("/leaveApplication/myList", {
    userId: data.userId,
  })
}

// 获取所有请假申请（管理员查看）
export function getAllLeaveApplications() {
  return api.post("/leaveApplication/list")
}

// 获取请假申请（按月份）
export function getLeaveApplicationsByMonth(data) {
  return api.post("/leaveApplication/getByMonth", {
    userId: data.userId,
    month: data.month, // YYYY-MM 格式
  })
}

// 提交请假申请
export function submitLeaveApplication(data) {
  return api.post("/leaveApplication/submit", {
    userId: data.userId,
    name: data.name,
    groupName: data.groupName,
    leaveType: data.leaveType,
    startTime: data.startTime,
    endTime: data.endTime,
    duration: data.duration,
    reason: data.reason,
  })
}

// 更新请假申请
export function updateLeaveApplication(data) {
  return api.post("/leaveApplication/update", {
    id: data.id,
    leaveType: data.leaveType,
    startTime: data.startTime,
    endTime: data.endTime,
    duration: data.duration,
    reason: data.reason,
  })
}

// 取消请假申请
export function cancelLeaveApplication(data) {
  return api.post("/leaveApplication/cancel", {
    id: data.id,
  })
}

// 审批请假申请
export function approveLeaveApplication(data) {
  return api.post("/leaveApplication/approve", {
    id: data.id,
    approverId: data.approverId,
    approverName: data.approverName,
    approvalRemark: data.approvalRemark,
  })
}

// 拒绝请假申请
export function rejectLeaveApplication(data) {
  return api.post("/leaveApplication/reject", {
    id: data.id,
    approverId: data.approverId,
    approverName: data.approverName,
    approvalRemark: data.approvalRemark,
  })
}

// 获取请假统计信息
export function getLeaveStatistics(data) {
  return api.post("/leaveApplication/statistics", {
    userId: data.userId,
    year: data.year,
  })
} 
