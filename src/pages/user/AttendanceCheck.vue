<script setup>
import { checkIn, checkOut, getAttendanceListByDate } from '@/api/attendanceRecord'
import { useUserStore } from '@/stores/user'
import { snackbar } from '@/utils/ty'
import Cookies from 'js-cookie'
import { onMounted, onUnmounted, ref } from 'vue'

const userStore = useUserStore()
const loading = ref(false)
const currentTime = ref(new Date())
const checkInTime = ref(null)
const checkOutTime = ref(null)

// 考勤状态枚举
const AttendanceStatus = {
  ABSENT: '未签到',
  NORMAL: '正常',
  LATE: '迟到',
  EARLY_LEAVE: '早退',
  MISSING: '缺勤',
}

// 判断考勤状态
const getAttendanceStatus = time => {
  const hour = time.getHours()
  const minutes = time.getMinutes()
  
  // 这里的时间可以根据实际需求调整
  if (hour < 9 || (hour === 9 && minutes === 0)) {
    return AttendanceStatus.NORMAL
  } else {
    return AttendanceStatus.LATE
  }
}

// 判断签退状态
const getCheckOutStatus = time => {
  const hour = time.getHours()
  
  // 这里的时间可以根据实际需求调整
  if (hour < 17) {
    return AttendanceStatus.EARLY_LEAVE
  } else {
    return AttendanceStatus.NORMAL
  }
}

// 更新当前时间
const updateCurrentTime = () => {
  currentTime.value = new Date()
}

// 每秒更新时间
let timer

// 获取今日签到记录的函数
const fetchTodayRecord = async () => {
  try {
    const today = formatDate(new Date())

    const params = {
      userId: userStore.userId,
      attendanceDate: today,
    }
    
    console.log('获取今日签到记录参数:', params)

    const res = await getAttendanceListByDate(params)

    console.log('今日签到记录:', res)

    if (res.code === 1 && res.data?.length > 0) {
      const todayRecord = res.data[0]

      checkInRecord.value = todayRecord
      
      // 如果有签到记录，设置签到时间
      if (todayRecord.checkIn) {
        // 处理 "1970-01-01 17:41:55" 格式的时间
        const timeStr = todayRecord.checkIn.split(' ')[1] // 获取时间部分
        const [hours, minutes, seconds] = timeStr.split(':').map(Number)
        const now = new Date()
        const checkInDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds)

        checkInTime.value = checkInDate
      }
      
      // 如果有签退记录，设置签退时间
      if (todayRecord.checkOut) {
        // 处理 "1970-01-01 18:02:10" 格式的时间
        const timeStr = todayRecord.checkOut.split(' ')[1] // 获取时间部分
        const [hours, minutes, seconds] = timeStr.split(':').map(Number)
        const now = new Date()
        const checkOutDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds)

        checkOutTime.value = checkOutDate
      }
    }
  } catch (error) {
    console.error('获取今日签到记录失败:', error)
    snackbar.value = {
      show: true,
      text: '获取签到记录失败',
      color: 'error',
    }
  }
}

// 修改 onMounted
onMounted(async () => {
  // 检查是否有用户信息
  if (!userStore.userId) {
    const userInfo = Cookies.get('userInfo')
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo)

        userStore.setUserInfo(parsedUserInfo)
        console.log('从Cookie恢复的用户信息:', parsedUserInfo)
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
  }
  console.log('当前用户ID:', userStore.userId)
  
  // 如果有用户ID，获取今日签到记录
  if (userStore.userId) {
    await fetchTodayRecord()
  }
  
  timer = setInterval(updateCurrentTime, 1000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 格式化时间
const formatTime = date => {
  if (!date || !(date instanceof Date) || isNaN(date)) return ''
  try {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    
    return `${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('格式化时间失败:', error)
    
    return ''
  }
}

// 格式化日期
const formatDate = date => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// 添加一个变量存储签到记录
const checkInRecord = ref(null)

// 签到
const handleCheckIn = async () => {
  if (loading.value) return
  if (!userStore.userId) {
    snackbar.value = {
      show: true,
      text: '用户信息获取失败，请重新登录',
      color: 'error',
    }
    
    return
  }

  loading.value = true
  try {
    const now = new Date()
    const status = getAttendanceStatus(now)

    const attendanceRecord = {
      userId: userStore.userId,
      name: userStore.name,
      groupName: userStore.groupName,
      attendanceDate: formatDate(now),
      checkIn: formatTime(now),
      status: status,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }

    console.log('签到数据:', attendanceRecord)

    const res = await checkIn(attendanceRecord)

    console.log('签到响应:', res)

    if (res.code === 1) {
      checkInTime.value = now
      checkInRecord.value = res.data // 保存签到记录
      snackbar.value = {
        show: true,
        text: status === AttendanceStatus.NORMAL ? '签到成功' : '您已迟到',
        color: status === AttendanceStatus.NORMAL ? 'success' : 'warning',
      }
    } else {
      snackbar.value = {
        show: true,
        text: res.message || '签到失败',
        color: 'error',
      }
    }
  } catch (error) {
    console.error('签到失败:', error)
    snackbar.value = {
      show: true,
      text: '签到失败，请重试',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}

// 签退
const handleCheckOut = async () => {
  if (loading.value) return
  if (!userStore.userId || !checkInRecord.value?.id) {
    snackbar.value = {
      show: true,
      text: '无法获取签到记录，请重新登录',
      color: 'error',
    }
    
    return
  }

  loading.value = true
  try {
    const now = new Date()
    const status = getCheckOutStatus(now)

    // 计算工作时长（小时）
    let workHours = 0.0
    if (checkInRecord.value?.checkIn) {
      // 处理签到时间
      const checkInTimeStr = checkInRecord.value.checkIn.split(' ')[1]
      const [checkInHours, checkInMinutes] = checkInTimeStr.split(':').map(Number)
      
      // 获取当前时间的小时和分钟
      const checkOutHours = now.getHours()
      const checkOutMinutes = now.getMinutes()
      
      // 计算时间差（小时）
      const hoursDiff = checkOutHours - checkInHours
      const minutesDiff = checkOutMinutes - checkInMinutes
      
      // 转换为小时，保留一位小数
      workHours = Number((hoursDiff + minutesDiff / 60).toFixed(1))
      
      // 确保工作时长不为负数
      workHours = Math.max(0, workHours)

      console.log('签到时间:', `${checkInHours}:${checkInMinutes}`)
      console.log('签退时间:', `${checkOutHours}:${checkOutMinutes}`)
      console.log('工作时长:', workHours)
    }

    const attendanceRecord = {
      id: checkInRecord.value.id,
      userId: userStore.userId,
      name: userStore.name,
      groupName: userStore.groupName,
      attendanceDate: formatDate(now),
      checkIn: checkInRecord.value.checkIn,
      checkOut: formatTime(now),
      status: status,
      workHours: workHours, // 直接使用数字类型
      updatedAt: now.toISOString(),
    }

    console.log('签退数据:', attendanceRecord)

    const res = await checkOut(attendanceRecord)

    console.log('签退响应:', res)

    if (res.code === 1) {
      // 设置签退时间
      const [hours, minutes, seconds] = formatTime(now).split(':').map(Number)
      const checkOutDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds)

      checkOutTime.value = checkOutDate

      snackbar.value = {
        show: true,
        text: status === AttendanceStatus.NORMAL ? '签退成功' : '您已早退',
        color: status === AttendanceStatus.NORMAL ? 'success' : 'warning',
      }
    } else {
      throw new Error(res.message || '签退失败')
    }
  } catch (error) {
    console.error('签退失败:', error)
    snackbar.value = {
      show: true,
      text: error.message || '签退失败，请重试',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="attendance-check">
    <VCard class="mb-6">
      <VCardText class="text-center pa-6">
        <div class="text-h2 font-weight-bold mb-2">
          {{ formatTime(currentTime) }}
        </div>
        <div class="text-subtitle-1">
          {{ formatDate(currentTime) }}
        </div>
      </VCardText>
    </VCard>

    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <VCard>
          <VCardText class="text-center pa-6">
            <div class="text-h6 mb-2">
              签到时间
            </div>
            <div class="text-h4 mb-4">
              {{ checkInTime ? formatTime(checkInTime) : '未签到' }}
            </div>
            <VBtn
              color="primary"
              size="large"
              :loading="loading"
              :disabled="checkInTime !== null"
              @click="handleCheckIn"
            >
              签到
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VCard>
          <VCardText class="text-center pa-6">
            <div class="text-h6 mb-2">
              签退时间
            </div>
            <div class="text-h4 mb-4">
              {{ checkOutTime ? formatTime(checkOutTime) : '未签退' }}
            </div>
            <VBtn
              color="primary"
              size="large"
              :loading="loading"
              :disabled="checkOutTime !== null || checkInTime === null"
              @click="handleCheckOut"
            >
              签退
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

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
  </div>
</template>

<style scoped lang="scss">
.attendance-check {
  .v-card {
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }
  }
}
</style> 
