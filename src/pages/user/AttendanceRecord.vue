<script setup>
import { getAttendanceRecordByMonth } from "@/api/attendanceRecord.js";
import { snackbar } from "@/utils/ty.js";
import { onMounted, onUnmounted, ref, watch } from 'vue';

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
  statistics.value = {
    total: recordData.value.length,
    normal: recordData.value.filter(item => item.status === '正常').length,
    late: recordData.value.filter(item => item.status === '迟到').length,
    early: recordData.value.filter(item => item.status === '早退').length,
    absent: recordData.value.filter(item => item.status === '缺勤').length,
  }
}

// 初始化 snackbar 状态
snackbar.value = {
  show: false,
  text: '',
  color: '',
  timeout: 3000,
}

// 获取考勤记录
const getAttendanceRecord = async () => {
  try {
    const data = {
      userId: localStorage.getItem('userId'),
      month: selectedMonth.value,
    }
    
    const res = await getAttendanceRecordByMonth(data)
    if (res.code === 1) {
      recordData.value = res.data
      recordList.value = recordData.value
      updateStatistics()
    } else {
      // 立即更新 snackbar 状态
      snackbar.value = {
        show: true,
        text: res.msg || '获取考勤记录失败',
        color: 'error',
        timeout: 3000,
      }
    }
  } catch (error) {
    console.error('获取考勤记录失败:', error)
    // 立即更新 snackbar 状态
    snackbar.value = {
      show: true,
      text: '获取考勤记录失败，请重试',
      color: 'error',
      timeout: 3000,
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
      <VCol cols="12" sm="6" md="4" lg="2.4">
        <VCard class="stat-card" elevation="2">
          <VCardItem>
            <VCardTitle class="text-primary">总出勤</VCardTitle>
            <template #append>
              <VIcon icon="mdi-calendar-check" size="32" color="primary" />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">{{ statistics.total }}</div>
            <div class="text-caption">本月总天数</div>
          </VCardText>
        </VCard>
      </VCol>
      
      <!-- 其他统计卡片 -->
      <VCol v-for="(stat, type) in {
        normal: { title: '正常', icon: 'mdi-check-circle', color: 'success' },
        late: { title: '迟到', icon: 'mdi-clock-alert', color: 'warning' },
        early: { title: '早退', icon: 'mdi-clock-out', color: 'orange' },
        absent: { title: '缺勤', icon: 'mdi-account-off', color: 'error' }
      }" :key="type" cols="12" sm="6" md="4" lg="2.4">
        <VCard class="stat-card" elevation="2">
          <VCardItem>
            <VCardTitle :class="`text-${stat.color}`">{{ stat.title }}</VCardTitle>
            <template #append>
              <VIcon :icon="stat.icon" size="32" :color="stat.color" />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">{{ statistics[type] }}</div>
            <div class="text-caption">{{ stat.title }}天数</div>
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
                  :icon="item.status === '正常' ? 'mdi-check-circle' :
                         item.status === '迟到' ? 'mdi-clock-alert' :
                         item.status === '早退' ? 'mdi-clock-out' : 'mdi-account-off'"
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
