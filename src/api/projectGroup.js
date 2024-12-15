import api from "@/utils/api"

// 获取项目组列表
export function getProjectGroupList() {
  return api.post("/projectGroup/list")
}

// 添加项目组
export function addProjectGroup(data) {
  return api.post("/projectGroup/add", {
    name: data.name,
    description: data.description || '',
  })
}

// 更新项目组
export function updateProjectGroup(data) {
  return api.post("/projectGroup/update", {
    id: data.id,
    name: data.name,
    description: data.description || '',
  })
}

// 删除项目组
export function deleteProjectGroup(id) {
  return api.post("/projectGroup/delete", {
    id,
  })
}

export function getProjectKVList() {
  return api.post("/projectGroup/ky")
}
