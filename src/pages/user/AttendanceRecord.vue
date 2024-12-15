<script setup>
import { getAttendanceRecordByMonth } from "@/api/attendanceRecord";
import { useUserStore } from '@/stores/user';
import { snackbar } from "@/utils/ty";
import { onMounted, onUnmounted, ref, watch } from 'vue';

const userStore = useUserStore()

// 表头定义
const recordHeaders = ref([
  { title: '日期', key: 'attendanceDate', sortable: true },
  { title: '签到时间', key: 'checkIn' },
  { title: '签退时间', key: 'checkOut' },
  { title: '工作时长', key: 'workHours' },
  { title: '考勤状态', key: 'status', sortable: true },
  { title: '备注', key: 'remark' },
])

// 考勤记录数据
const recordList = ref([])
const recordData = ref([])

// 筛选条件
const selectedMonth = ref(new Date().toISOString().substr(0, 7)) // 默认当前月份 YYYY-MM
const selectedStatus = ref('all')

// 统计数据
const statistics = ref({
  total: 0,
  normal: 0,
  late: 0,
  early: 0,
  absent: 0,
})

// 更新统计数据
const updateStatistics = () => {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const selectedYear = parseInt(selectedMonth.value.split('-')[0])
  const selectedMonthNum = parseInt(selectedMonth.value.split('-')[1])
  
  // 获取选中月份的天数
  const daysInMonth = new Date(selectedYear, selectedMonthNum, 0).getDate()
  
  // 计算工作日数量（排除周六周日）
  let workDays = 0
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(selectedYear, selectedMonthNum - 1, day)
    if (date.getDay() !== 0 && date.getDay() !== 6) { // 0是周日，6是周六
      // 如果是当前月份，只统计到今天
      if (selectedYear === currentYear && selectedMonthNum === currentMonth && day > now.getDate()) {
        break
      }
      workDays++
    }
  }

  // 统计各种考勤状态
  const normalCount = recordData.value.filter(item => item.status === '正常').length
  const lateCount = recordData.value.filter(item => item.status === '迟到').length
  const earlyCount = recordData.value.filter(item => item.status === '早退').length
  const absentCount = workDays - (normalCount + lateCount + earlyCount)

  statistics.value = {
    total: workDays, // 总工作日数
    normal: normalCount, // 正常出勤
    late: lateCount, // 迟到
    early: earlyCount, // 早退
    absent: Math.max(0, absentCount), // 缺勤（工作日减去所有出勤记录）
  }

  console.log('统计数据:', {
    workDays,
    normalCount,
    lateCount,
    earlyCount,
    absentCount,
    selectedMonth: selectedMonth.value,
    recordCount: recordData.value.length,
  })
}

// 初始化 snackbar 状态
snackbar.value = {
  show: false,
  text: '',
  color: '',
  timeout: 3000,
}

// 生成完整的考勤记录（包括缺勤记录）
const generateFullRecords = records => {
  const now = new Date()
  const selectedYear = parseInt(selectedMonth.value.split('-')[0])
  const selectedMonthNum = parseInt(selectedMonth.value.split('-')[1])
  const daysInMonth = new Date(selectedYear, selectedMonthNum, 0).getDate()
  
  // 创建日期到记录的映射
  const recordMap = new Map(
    records.map(record => [record.attendanceDate.split(' ')[0], record]),
  )
  
  // 生成完整的记录列表
  const fullRecords = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(selectedYear, selectedMonthNum - 1, day)
    
    // 跳过未来日期和周末
    if (date > now || date.getDay() === 0 || date.getDay() === 6) {
      continue
    }
    
    const dateStr = date.toISOString().split('T')[0]
    const record = recordMap.get(dateStr)
    
    if (record) {
      // 使用现有记录
      fullRecords.push({
        ...record,
        attendanceDate: record.attendanceDate.split(' ')[0],
        checkIn: record.checkIn?.split(' ')[1] || '-',
        checkOut: record.checkOut?.split(' ')[1] || '-',
        workHours: record.workHours || '-',
      })
    } else {
      // 生成缺勤记录
      fullRecords.push({
        attendanceDate: dateStr,
        checkIn: '-',
        checkOut: '-',
        workHours: '-',
        status: '缺勤',
        remark: '未出勤',
      })
    }
  }
  
  return fullRecords.sort((a, b) => a.attendanceDate.localeCompare(b.attendanceDate))
}

// 获取考勤记录
const getAttendanceRecord = async () => {
  try {
    const data = {
      userId: userStore.userId,
      month: selectedMonth.value,
    }
    
    console.log('获取考勤记录参数:', data)

    const res = await getAttendanceRecordByMonth(data)

    console.log('考勤记录响应:', res)

    if (res.code === 1) {
      // 处理日期格式
      recordData.value = res.data.map(item => ({
        ...item,
        attendanceDate: item.attendanceDate.split(' ')[0], // 只显示日期部分
        checkIn: item.checkIn?.split(' ')[1] || '-', // 只显示时间部分
        checkOut: item.checkOut?.split(' ')[1] || '-',
        workHours: item.workHours || '-',
      }))
      
      recordList.value = recordData.value
      updateStatistics()
    } else {
      snackbar.value = {
        show: true,
        text: res.msg || '获取考勤记录失败',
        color: 'error',
      }
    }
  } catch (error) {
    console.error('获取考勤记录失败:', error)
    snackbar.value = {
      show: true,
      text: '获取考勤记录失败，请重试',
      color: 'error',
    }
  }
}

// 筛选数据
const filterData = () => {
  let filteredData = [...recordData.value]
  
  if (selectedStatus.value !== 'all') {
    filteredData = filteredData.filter(item => item.status === selectedStatus.value)
  }
  
  recordList.value = filteredData
}

// 监听筛选条件变化
watch([selectedMonth], () => {
  getAttendanceRecord()
})

watch([selectedStatus], () => {
  filterData()
})

// 分页配置
const options = ref({
  page: 1,
  itemsPerPage: 10,
})

onMounted(() => {
  getAttendanceRecord()
})

// 组件卸载时重置 snackbar
onUnmounted(() => {
  snackbar.value.show = false
})
</script>

<template>
  <div class="attendance-record">
    <!-- 统计卡片 -->
    <VRow class="mb-6">
      <VCol
        cols="12"
        sm="6"
        md="4"
        lg="2.4"
      >
        <VCard
          class="stat-card"
          elevation="2"
        >
          <VCardItem>
            <VCardTitle class="text-primary">
              总出勤
            </VCardTitle>
            <template #append>
              <VIcon
                icon="ri-calendar-check-line"
                size="32"
                color="primary"
              />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">
              {{ statistics.total }}
            </div>
            <div class="text-caption">
              本月总天数
            </div>
          </VCardText>
        </VCard>
      </VCol>
      
      <!-- 其他统计卡片 -->
      <VCol
        v-for="(stat, type) in {
          normal: { title: '正常', icon: 'ri-checkbox-circle-line', color: 'success' },
          late: { title: '迟到', icon: 'ri-time-line', color: 'warning' },
          early: { title: '早退', icon: 'ri-logout-circle-line', color: 'orange' },
          absent: { title: '缺勤', icon: 'ri-close-circle-line', color: 'error' }
        }"
        :key="type"
        cols="12"
        sm="6"
        md="4"
        lg="2.4"
      >
        <VCard
          class="stat-card"
          elevation="2"
        >
          <VCardItem>
            <VCardTitle :class="`text-${stat.color}`">
              {{ stat.title }}
            </VCardTitle>
            <template #append>
              <VIcon
                :icon="stat.icon"
                size="32"
                :color="stat.color"
              />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">
              {{ statistics[type] }}
            </div>
            <div class="text-caption">
              {{ stat.title }}天数
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 记录列表 -->
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center pa-4">
        <span>考勤记录</span>
        <div class="d-flex align-center gap-4">
          <!-- 月份选择 -->
          <VTextField
            v-model="selectedMonth"
            type="month"
            label="选择月份"
            density="compact"
            hide-details
          />
          
          <!-- 状态筛选 -->
          <VSelect
            v-model="selectedStatus"
            :items="[
              { title: '全部', value: 'all' },
              { title: '正常', value: '正常' },
              { title: '迟到', value: '迟到' },
              { title: '早退', value: '早退' },
              { title: '缺勤', value: '缺勤' }
            ]"
            label="考勤状态"
            density="compact"
            hide-details
          />
        </div>
      </VCardTitle>

      <VDivider />

      <VCardText>
        <VDataTable
          :headers="recordHeaders"
          :items="recordList"
          :items-per-page="options.itemsPerPage"
          :page="options.page"
          hover
        >
          <!-- 状态列自定义显示 -->
          <template #item.status="{ item }">
            <VChip
              :color="item.status === '正常' ? 'success' :
                item.status === '迟到' ? 'warning' :
                item.status === '早退' ? 'orange' : 'error'"
              size="small"
              variant="elevated"
            >
              <template #prepend>
                <VIcon
                  size="16"
                  :icon="item.status === '正常' ? 'ri-checkbox-circle-line' :
                    item.status === '迟到' ? 'ri-time-line' :
                    item.status === '早退' ? 'ri-logout-circle-line' : 'ri-close-circle-line'"
                />
              </template>
              {{ item.status }}
            </VChip>
          </template>

          <!-- 分页 -->
          <template #bottom>
            <VDivider />
            <div class="d-flex align-center justify-space-between pa-4">
              <div class="text-caption">
                共 {{ recordList.length }} 条记录
              </div>
              <VPagination
                v-model="options.page"
                :total-visible="3"
                :length="Math.ceil(recordList.length / options.itemsPerPage)"
                rounded="circle"
              />
            </div>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

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
  </div>
</template>

<style scoped lang="scss">
.attendance-record {
  .stat-card {
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }
  }

  .v-data-table {
    .v-data-table-header {
      th {
        font-weight: 600;
        white-space: nowrap;
      }
    }
  }
}
</style> 
