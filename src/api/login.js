import api from "@/utils/api"

export  function login(user){
  return api.post("/login", user)
}
