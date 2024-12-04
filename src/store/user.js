import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      id: null,
      name: '',
      email: '',
    },
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    clearUser() {
      this.user = {
        id: null,
        name: '',
        email: '',
      }
    },
  },
  getters: {
    user: state => state.user,
    isAuthenticated: state => !!state.user.id,
  },
})
