import api from "@/utils/api"

// 获取项目列表
export function getProjectList() {
  return api.post("/project/list")
}

// 获取项目详情
export function getProject(id) {
  return api.post("/project/get", {
    id,
  })
}

// 添加项目
export function addProject(data) {
  return api.post("/project/add", data)
}

// 更新项目
export function updateProject(data) {
  return api.post("/project/update", data)
}

// 删除项目
export function deleteProject(id) {
  return api.post("/project/delete", {
    id,
  })
}

// 获取项目成员
export function getProjectMembers(projectId) {
  return api.post("/project/members", {
    projectId,
  })
}

// 添加项目成员
export function addProjectMember(data) {
  return api.post("/project/member/add", data)
}

// 移除项目成员
export function removeProjectMember(data) {
  return api.post("/project/member/remove", data)
} 
