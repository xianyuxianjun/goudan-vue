<script setup>
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import { register } from "@/api/register"
import authV1LoginMaskDark from '@images/pages/auth-v1-login-mask-dark.png'
import authV1LoginMaskLight from '@images/pages/auth-v1-login-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePage({ meta: { layout: 'blank' } })

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const formValid = ref(true)
const isPasswordVisible = ref(false)

// 注册表单
const registerForm = ref({
  name: '',
  sex: '',
  age: null,
  email: '',
  className: '',
  major: '',
  password: '',
  confirmPassword: '',
})

// 性别选项
const sexOptions = [
  { title: '男', value: '男' },
  { title: '女', value: '女' },
]

// 表单验证规则
const rules = {
  name: [
    v => !!v || '请输入姓名',
    v => v.length >= 2 || '姓名至少2个字符',
  ],
  sex: [v => !!v || '请选择性别'],
  age: [
    v => !!v || '请输入年龄',
    v => v > 0 || '年龄必须大于0',
    v => v < 100 || '年龄须小于100',
  ],
  email: [
    v => !!v || '请输入邮箱',
    v => /.+@.+\..+/.test(v) || '请输入有效的邮箱地址',
  ],
  className: [v => !!v || '请输入班级'],
  major: [v => !!v || '请输入专业'],
  password: [
    v => !!v || '请输入密码',
    v => v.length >= 6 || '密码长度至少6位',
  ],
  confirmPassword: [
    v => !!v || '请确认密码',
    v => v === registerForm.value.password || '两次输入的密码不一致',
  ],
}

// 初始化 snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: '',
})

// 提交注册
const handleRegister = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const { confirmPassword, ...registerData } = registerForm.value

    registerData.post = '成员'
    registerData.status = '在岗'
    registerData.isUse = '1'
    registerData.role = 'user'
    
    console.log('注册数据:', registerData)
    
    const res = await register(registerData)

    console.log('注册响应:', res)

    if (res.code === 1) {
      snackbar.value = {
        show: true,
        text: '注册成功',
        color: 'success',
      }
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      snackbar.value = {
        show: true,
        text: res.message || '注册失败',
        color: 'error',
      }
    }
  } catch (error) {
    console.error('注册失败:', error)
    snackbar.value = {
      show: true,
      text: error.message || '注册失败，请重试',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}

const authV1ThemeLoginMask = useGenerateImageVariant(authV1LoginMaskLight, authV1LoginMaskDark)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="600"
      rounded="lg"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <VNodeRenderer :nodes="themeConfig.app.logo" />
          </div>
        </template>
        
        <VCardTitle class="font-weight-semibold text-2xl text-center">
          新用户注册
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2 pb-2 text-center text-disabled">
        请填写以下信息完成注册
      </VCardText>

      <VCardText>
        <VForm
          ref="formRef"
          @submit.prevent="handleRegister"
        >
          <VRow>
            <!-- 姓名 -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="registerForm.name"
                :rules="rules.name"
                label="姓名"
                placeholder="请输入姓名"
                density="comfortable"
                variant="outlined"
                required
              />
            </VCol>

            <!-- 性别 -->
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="registerForm.sex"
                :items="sexOptions"
                :rules="rules.sex"
                label="性别"
                placeholder="请选择性别"
                density="comfortable"
                variant="outlined"
                required
              />
            </VCol>

            <!-- 年龄 -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.number="registerForm.age"
                :rules="rules.age"
                label="年龄"
                type="number"
                placeholder="请输入��龄"
                density="comfortable"
                variant="outlined"
                required
              />
            </VCol>

            <!-- 邮箱 -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="registerForm.email"
                :rules="rules.email"
                label="邮箱"
                type="email"
                placeholder="请输入邮箱"
                density="comfortable"
                variant="outlined"
                required
              />
            </VCol>

            <!-- 班级 -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="registerForm.className"
                :rules="rules.className"
                label="班级"
                placeholder="请输入班级"
                density="comfortable"
                variant="outlined"
                required
              />
            </VCol>

            <!-- 专业 -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="registerForm.major"
                :rules="rules.major"
                label="专业"
                placeholder="请输入专业"
                density="comfortable"
                variant="outlined"
                required
              />
            </VCol>

            <!-- 密码 -->
            <VCol cols="12">
              <VTextField
                v-model="registerForm.password"
                :rules="rules.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                label="密码"
                placeholder="请输入密码"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-line' : 'ri-eye-off-line'"
                density="comfortable"
                variant="outlined"
                required
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </VCol>

            <!-- 确认密码 -->
            <VCol cols="12">
              <VTextField
                v-model="registerForm.confirmPassword"
                :rules="rules.confirmPassword"
                :type="isPasswordVisible ? 'text' : 'password'"
                label="确认密码"
                placeholder="请再次输入密码"
                density="comfortable"
                variant="outlined"
                required
              />
            </VCol>

            <!-- 提交按钮 -->
            <VCol cols="12">
              <VBtn
                block
                type="submit"
                size="large"
                color="primary"
                :loading="loading"
                :disabled="loading"
              >
                注 册
              </VBtn>
            </VCol>

            <!-- 返回登录 -->
            <VCol cols="12">
              <div class="d-flex align-center justify-center text-center">
                <span class="text-disabled">已有账号？</span>
                <RouterLink
                  to="/login"
                  class="text-primary ms-2"
                >
                  返回登录
                </RouterLink>
              </div>
            </VCol>
          </VRow>
        </VForm>
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
</style> 
