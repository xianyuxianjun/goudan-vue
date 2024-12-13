<script setup>
import { snackbar } from "@/utils/ty.js";
import { onMounted, onUnmounted, ref } from 'vue';

// 考勤状态
const attendanceStatus = ref({
  isCheckedIn: false,
  isCheckedOut: false,
  checkInTime: null,
  checkOutTime: null,
  status: '未签到',
})

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleTimeString('zh-CN', { hour12: false })
}

// 获取当前日期
const getCurrentDate = () => {
  const now = new Date()
  return now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 添加一个定时器来更新当前时间
const currentTime = ref(getCurrentTime())
const currentDate = ref(getCurrentDate())

// 每秒更新一次时间
const timeInterval = setInterval(() => {
  currentTime.value = getCurrentTime()
}, 1000)

// 组件卸载时清除定时器
onUnmounted(() => {
  clearInterval(timeInterval)
})

// 签到
const checkIn = async () => {
  try {
    const data = {
      userId: localStorage.getItem('userId'), // 从localStorage获取用户ID
      checkInTime: getCurrentTime(),
      attendanceDate: getCurrentDate(),
    }
    
    // TODO: 调用签到API
    // const res = await checkInApi(data)
    
    // 模拟API调用成功
    attendanceStatus.value.isCheckedIn = true
    attendanceStatus.value.checkInTime = getCurrentTime()
    attendanceStatus.value.status = '已签到'
    
    snackbar.value = {
      show: true,
      text: '签到成功',
      color: 'success',
      timeout: 3000,
    }
  } catch (error) {
    console.error('签到失败:', error)
    snackbar.value = {
      show: true,
      text: '签到失败，请重试',
      color: 'error',
      timeout: 3000,
    }
  }
}

// 签退
const checkOut = async () => {
  try {
    const data = {
      userId: localStorage.getItem('userId'),
      checkOutTime: getCurrentTime(),
      attendanceDate: getCurrentDate(),
    }
    
    // TODO: 调用签退API
    // const res = await checkOutApi(data)
    
    // 模拟API调用成功
    attendanceStatus.value.isCheckedOut = true
    attendanceStatus.value.checkOutTime = getCurrentTime()
    attendanceStatus.value.status = '已签退'
    
    snackbar.value = {
      show: true,
      text: '签退成功',
      color: 'success',
      timeout: 3000,
    }
  } catch (error) {
    console.error('签退失败:', error)
    snackbar.value = {
      show: true,
      text: '签退失败，请重试',
      color: 'error',
      timeout: 3000,
    }
  }
}

// 获取今日考勤状态
const getTodayAttendance = async () => {
  try {
    const data = {
      userId: localStorage.getItem('userId'),
      attendanceDate: getCurrentDate(),
    }
    
    // TODO: 调用获取考勤状态API
    // const res = await getTodayAttendanceApi(data)
    
    // 模拟API返回数据
    // attendanceStatus.value = res.data
  } catch (error) {
    console.error('获取考勤状态失败:', error)
  }
}

onMounted(() => {
  getTodayAttendance()
})
</script>

<template>
  <VCard class="attendance-check">
    <VCardTitle class="text-center py-4">
      实验室考勤签到
    </VCardTitle>
    
    <VCardText>
      <!-- 修改时间显示部分 -->
      <div class="text-center mb-6">
        <div class="text-h2 font-weight-bold time-display">
          {{ currentTime }}
        </div>
        <div class="text-h5 mt-2 date-display">
          {{ currentDate }}
        </div>
      </div>
      
      <!-- 考勤状态卡片 -->
      <VCard
        :color="attendanceStatus.status === '未签到' ? 'warning' : 
               attendanceStatus.status === '已签到' ? 'info' : 'success'"
        class="mb-6"
      >
        <VCardText class="text-center py-4">
          <div class="text-h6 text-white">
            当前状态：{{ attendanceStatus.status }}
          </div>
          <template v-if="attendanceStatus.checkInTime">
            <div class="text-body-1 text-white mt-2">
              签到时间：{{ attendanceStatus.checkInTime }}
            </div>
          </template>
          <template v-if="attendanceStatus.checkOutTime">
            <div class="text-body-1 text-white mt-2">
              签退时间：{{ attendanceStatus.checkOutTime }}
            </div>
          </template>
        </VCardText>
      </VCard>
      
      <!-- 签到签退按钮 -->
      <div class="d-flex justify-space-around">
        <VBtn
          color="primary"
          size="x-large"
          :disabled="attendanceStatus.isCheckedIn"
          @click="checkIn"
        >
          <VIcon
            start
            icon="mdi-login"
          />
          签到
        </VBtn>
        
        <VBtn
          color="secondary"
          size="x-large"
          :disabled="!attendanceStatus.isCheckedIn || attendanceStatus.isCheckedOut"
          @click="checkOut"
        >
          <VIcon
            start
            icon="mdi-logout"
          />
          签退
        </VBtn>
      </div>
    </VCardText>
    
    <!-- 提示信息 -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
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
  </VCard>
</template>

<style scoped lang="scss">
.attendance-check {
  max-width: 600px;
  margin: 2rem auto;
  
  .time-display {
    font-family: monospace;
    color: var(--v-theme-primary);
  }
  
  .date-display {
    color: var(--v-theme-secondary);
  }
  
  .v-card-title {
    font-size: 1.5rem;
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
  
  .v-btn {
    min-width: 120px;
    
    &:disabled {
      opacity: 0.7;
    }
  }
}
</style> 
