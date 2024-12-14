import api from "@/utils/api"

export function register(user) {
  return api.post("/register", user)
}
