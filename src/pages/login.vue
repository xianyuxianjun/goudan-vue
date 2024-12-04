<script setup>
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import authV1LoginMaskDark from '@images/pages/auth-v1-login-mask-dark.png'
import authV1LoginMaskLight from '@images/pages/auth-v1-login-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useRouter } from 'vue-router'
import { login } from "@/api/login.js";
import Cookies from "js-cookie";

definePage({ meta: { layout: 'blank' } })

const router = useRouter()

const loginForm = ref({
  username: '',
  password: '',
  remember: false,
})

//登录
function clickLogin(){
  login(loginForm.value).then(res =>{
    if (res.code){
      Cookies.set("token",res.data.tokenValue,{expires: 30})
      router.push("/")
    }else {
      alert(res.message)
    }
  })
}

const authV1ThemeLoginMask = useGenerateImageVariant(authV1LoginMaskLight, authV1LoginMaskDark)
const isPasswordVisible = ref(false)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-1 pa-sm-7"
      max-width="448"
      title=""
    >
      <VCardItem class="justify-center pb-6">
        <VCardTitle>
          <div class="app-logo">
            <VNodeRenderer :nodes="themeConfig.app.logo" />
            <h1 class="app-logo-title">
              登录
            </h1>
          </div>
        </VCardTitle>
      </VCardItem>
      <VCardText>
        <VRow class="mb-4">
          <VCol cols="12" />
          <VCol cols="12">
            <VTextField
              v-model="loginForm.username"
              label="用户名"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="loginForm.password"
              label="密码"
              type="password"
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn
          color="success"
          @click="clickLogin"
        >
          登录
        </VBtn>
      </VCardText>
    </VCard>
    <VImg
      :src="authV1ThemeLoginMask"
      class="d-none d-md-block auth-footer-mask flip-in-rtl"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
