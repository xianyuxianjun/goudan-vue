<script setup>
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import { login } from "@/api/login"
import { useUserStore } from '@/stores/user'
import authV1LoginMaskDark from '@images/pages/auth-v1-login-mask-dark.png'
import authV1LoginMaskLight from '@images/pages/auth-v1-login-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import Cookies from "js-cookie"
import { useRouter } from 'vue-router'

definePage({ meta: { layout: 'blank' } })

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const isPasswordVisible = ref(false)

const snackbar = ref({
  show: false,
  text: '',
  color: '',
})

const loginForm = ref({
  email: '',
  password: '',
  remember: false,
})

// 表单验证规则
const rules = {
  email: [
    v => !!v || '请输入邮箱',
    v => /.+@.+\..+/.test(v) || '请输入有效的邮箱地址',
  ],
  password: [
    v => !!v || '请输入密码',
    v => v.length >= 6 || '密码长度至少6位',
  ],
}

// 登录
async function handleLogin() {
  console.log('handleLogin called')
  
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await login(loginForm.value)

    if (res.code === 1) {
      console.log("登录响应:", res)
      
      // 设置token
      Cookies.set("token", res.data.tokenValue, { expires: 30 })
      
      // 构造用户信息对象
      const userInfo = {
        userId: res.data.userId,
        name: res.data.name,
        groupName: res.data.groupName,
        role: res.data.role || 'user',
        email: res.data.email,
      }
      
      // 保存用户信息到store
      userStore.setUserInfo(userInfo)
      
      console.log('登录后的store状态:', userStore.$state)
      console.log('用户ID:', userStore.userId)

      // 不管是否勾选记住我，都保存用户信息到Cookie
      Cookies.set("userInfo", JSON.stringify(userInfo), { expires: 30 })

      // 显示成功提示
      snackbar.value = {
        show: true,
        text: '登录成功',
        color: 'success',
      }
      
      router.push("/")
    } else {
      snackbar.value = {
        show: true,
        text: res.message || '登录失败',
        color: 'error',
      }
    }
  } catch (error) {
    console.error('登录失败:', error)
    snackbar.value = {
      show: true,
      text: error.message || '登录失败，请重试',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}

const authV1ThemeLoginMask = useGenerateImageVariant(authV1LoginMaskLight, authV1LoginMaskDark)

// 切换到注册页面
const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
      rounded="lg"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <VNodeRenderer :nodes="themeConfig.app.logo" />
          </div>
        </template>
        
        <VCardTitle class="font-weight-semibold text-2xl text-center">
          欢迎登录
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2 pb-2 text-center text-disabled">
        请使用您的邮箱和密码登录系统
      </VCardText>

      <VCardText>
        <VForm
          ref="formRef"
          @submit.prevent="handleLogin"
        >
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="loginForm.email"
                :rules="rules.email"
                label="邮箱"
                type="email"
                placeholder="请输入邮箱"
                prepend-inner-icon="ri-mail-line"
                density="comfortable"
                variant="outlined"
                required
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="loginForm.password"
                :rules="rules.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                label="密码"
                placeholder="请输入密码"
                prepend-inner-icon="ri-lock-line"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-line' : 'ri-eye-off-line'"
                density="comfortable"
                variant="outlined"
                required
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </VCol>

            <VCol
              cols="12"
              class="d-flex align-center flex-wrap justify-space-between gap-2"
            >
              <VCheckbox
                v-model="loginForm.remember"
                label="记住我"
                density="comfortable"
              />
              
              <RouterLink
                class="text-primary ms-2 mb-1"
                href="javascript:void(0)"
              >
                忘记密码？
              </RouterLink>
            </VCol>

            <VCol cols="12">
              <VBtn
                block
                type="submit"
                size="large"
                color="primary"
                :loading="loading"
                :disabled="loading"
              >
                登 录
              </VBtn>
            </VCol>
          </VRow>
        </VForm>

        <div class="mt-2 d-flex align-center justify-center text-center">
          <span class="text-disabled">还没有账号？</span>
          <RouterLink
            to="/register"
            class="text-primary ms-2"
          >
            立即注册
          </RouterLink>
        </div>
      </VCardText>
    </VCard>

    <!-- 背景图 -->
    <VImg
      :src="authV1ThemeLoginMask"
      class="auth-footer-mask d-none d-md-block"
    />
  </div>

  <!-- 提示信息 -->
  <VSnackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    location="top"
  >
    {{ snackbar.text }}
    
    <template #actions>
      <VBtn
        color="white"
        variant="text"
        @click="snackbar.show = false"
      >
        关闭
      </VBtn>
    </template>
  </VSnackbar>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.auth-wrapper {
  min-block-size: 100vh;

  .auth-card {
    .v-card-item {
      .v-card-title {
        font-size: 1.75rem;
      }
    }
  }
}

// 添加���接样式
.router-link {
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
