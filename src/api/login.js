import api from "@/utils/api.js"

export  function login(user){
    return api.post("/login",user)
}
