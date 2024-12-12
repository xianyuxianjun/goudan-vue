export function getProjectGroupList() {
    return api.post("/projectGroup/list")
}

export function getProjectGroup(projectGroupId) {
    return api.post("/projectGroup/get", {
        projectGroupId:projectGroupId
    })
}

export function addProjectGroup(projectGroup) {
    return api.post("/projectGroup/add", projectGroup)
}

export function updateProjectGroup(projectGroup) {
    return api.post("/projectGroup/update", projectGroup)
}

export function deleteProjectGroup(projectGroupId) {
    return api.post("/projectGroup/detect", {
        id:projectGroupId
    })
}

export function getProjectKVList() {
    return api.post("/projectGroup/ky")
}
