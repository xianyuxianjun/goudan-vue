import api from "@/utils/api.js"

export function getUserList(){
    return api.post("/user/list")
}

export function detectUser(userId){
    return api.post("/user/detect",{userId:userId})
}

export function updateUser(user){
    return api.post("/user/update",user)
}

export function addUser(user){
    return api.post("/user/add",user)
}

export function getUser(userId){
    return api.post("/user/get",{userId:userId})
}
