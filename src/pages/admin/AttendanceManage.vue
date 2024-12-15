<script setup>
import { getAttendanceList } from '@/api/attendanceRecord';
import { snackbar } from '@/utils/ty';
import TableHead from "@/views/TableHead.vue";
import { onMounted, ref, watch } from 'vue';

// 表头定义
const attendanceHeader = ref([
  { title: '成员编号', key: 'userId', sortable: true },
  { title: '姓名', key: 'name', sortable: true },
  { title: '项目组', key: 'groupName', sortable: true },
  { title: '日期', key: 'attendanceDate', sortable: true },
  { title: '签到时间', key: 'checkIn' },
  { title: '签退时间', key: 'checkOut' },
  { title: '考勤状态', key: 'status', sortable: true },
  { title: '备注', key: 'remark' },
])

// 考勤数据
const attendanceList = ref([
  {
    userId: 'S202209512245',
    name: '张三',
    groupName: '研发部',
    attendanceDate: '2024-03-20',
    checkIn: '09:00:00',
    checkOut: '18:00:00',
    status: '正常',
    remark: '',
  },
])

// 搜索和筛选
const searchValue = ref('')
const attendanceData = ref([])
const date = new Date()
const selectedDate = ref(new Date().toISOString().substr(0, 10))

console.log(selectedDate.value)

const showDatePicker = ref(false)
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
  // 过滤当天的记录
  const todayRecords = attendanceData.value.filter(item => 
    item.attendanceDate === selectedDate.value,
  )

  statistics.value = {
    total: todayRecords.length,
    normal: todayRecords.filter(item => item.status === '正常').length,
    late: todayRecords.filter(item => item.status === '迟到').length,
    early: todayRecords.filter(item => item.status === '早退').length,
    absent: todayRecords.filter(item => item.status === '缺勤').length,
  }
}

// 搜索功能
function search(value) {
  searchValue.value = value
  filterData()
}

// 综合筛选函数
const filterData = () => {
  let filteredData = [...attendanceData.value]

  // 搜索筛选
  if (searchValue.value) {
    filteredData = filteredData.filter(item =>
      item.name.includes(searchValue.value) ||
      item.userId.includes(searchValue.value),
    )
  }

  // 状态筛选
  if (selectedStatus.value !== 'all') {
    filteredData = filteredData.filter(item => item.status === selectedStatus.value)
  }

  attendanceList.value = filteredData
}

// 监听筛选条件��化
watch(selectedDate, () => {
  getAttendanceData()  // 只有日期变化时重新获取数据
})

watch(selectedStatus, () => {
  filterData()  // 状态变化时在现有数据中筛选
})

// 分页配置
const options = ref({
  page: 1,
  itemsPerPage: 10,
})

// 获取考勤数据
const getAttendanceData = async () => {
  try {
    console.log('开始获取考勤数据，日期:', selectedDate.value)

    const res = await getAttendanceList({
      date: selectedDate.value,
    })

    console.log('考勤数据响应:', res)

    if (res.code === 1) {
      // 格式化数据
      attendanceData.value = res.data.map(item => ({
        ...item,
        attendanceDate: item.attendanceDate.split(' ')[0], // 只显示日期部分
        checkIn: item.checkIn?.split(' ')[1] || '-', // 只显示时间部分
        checkOut: item.checkOut?.split(' ')[1] || '-',
        workHours: item.workHours || '-',
        remark: item.remark || '-',
      }))
      attendanceList.value = attendanceData.value
      
      // 更新统计数据
      statistics.value = {
        total: attendanceData.value.length,
        normal: attendanceData.value.filter(item => item.status === '正常').length,
        late: attendanceData.value.filter(item => item.status === '迟到').length,
        early: attendanceData.value.filter(item => item.status === '早退').length,
        absent: attendanceData.value.filter(item => item.status === '缺勤').length,
      }
      
      console.log('统计数据:', statistics.value)
    } else {
      throw new Error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取考勤数据失败:', error)
    snackbar.value = {
      show: true,
      text: error.message || '获取考勤数据失败，请重试',
      color: 'error',
      timeout: 3000,
    }
  }
}

// 处理日期选择
const handleDateSelect = newDate => {
  if (newDate) {
    selectedDate.value = new Date(newDate).toISOString().substr(0, 10)
    getAttendanceData()
  }
}

onMounted(() => {
  getAttendanceData()
})
</script>

<template>
  <div class="attendance-manage">
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
                icon="mdi-account-group"
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
              今日总人数
            </div>
          </VCardText>
        </VCard>
      </VCol>

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
            <VCardTitle class="text-success">
              正常
            </VCardTitle>
            <template #append>
              <VIcon
                icon="mdi-check-circle"
                size="32"
                color="success"
              />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">
              {{ statistics.normal }}
            </div>
            <div class="text-caption">
              正常出勤人数
            </div>
          </VCardText>
        </VCard>
      </VCol>

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
            <VCardTitle class="text-warning">
              迟到
            </VCardTitle>
            <template #append>
              <VIcon
                icon="mdi-clock-alert"
                size="32"
                color="warning"
              />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">
              {{ statistics.late }}
            </div>
            <div class="text-caption">
              迟到人数
            </div>
          </VCardText>
        </VCard>
      </VCol>

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
            <VCardTitle class="text-orange">
              早退
            </VCardTitle>
            <template #append>
              <VIcon
                icon="mdi-clock-out"
                size="32"
                color="orange"
              />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">
              {{ statistics.early }}
            </div>
            <div class="text-caption">
              早退人数
            </div>
          </VCardText>
        </VCard>
      </VCol>

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
            <VCardTitle class="text-error">
              缺勤
            </VCardTitle>
            <template #append>
              <VIcon
                icon="mdi-account-off"
                size="32"
                color="error"
              />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">
              {{ statistics.absent }}
            </div>
            <div class="text-caption">
              缺勤人数
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 主要内容卡片 -->
    <VCard elevation="2">
      <TableHead @search="search">
        <template #one>
          <!-- 状态选择 -->
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
            variant="outlined"
            class="status-select"
          />
        </template>
        <template #two>
          <AppDateTimePicker
            v-model="selectedDate"
            type="date"
            label="选择日期"
            placeholder="选择日期"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="getAttendanceData"
          />
        </template>
      </TableHead>

      <VDivider />

      <VCardText>
        <VDataTable
          :headers="attendanceHeader"
          :items="attendanceList"
          :items-per-page="options.itemsPerPage"
          :page="options.page"
          :options="options"
          hover
          class="elevation-1"
        >
          <template #item.name="{ item }">
            <div class="d-flex align-center">
              <VAvatar
                size="32"
                class="me-2"
              >
                <VImg
                  v-if="item.avatar"
                  :src="item.avatar"
                />
                <span
                  v-else
                  class="text-caption"
                >{{ item.name.charAt(0) }}</span>
              </VAvatar>
              {{ item.name }}
            </div>
          </template>

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

          <template #bottom>
            <VDivider />
            <div class="d-flex align-center justify-space-between pa-4">
              <div class="text-caption">
                共 {{ attendanceList.length }} 条记录
              </div>
              <VPagination
                v-model="options.page"
                :total-visible="$vuetify.display.smAndDown ? 2 : 3"
                :length="Math.ceil(attendanceList.length / options.itemsPerPage)"
                rounded="circle"
              />
            </div>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

    <!-- 添加提示框组件 -->
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
.attendance-manage {
  .stat-card {
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    .v-card-title {
      font-size: 1.1rem;
    }

    .text-h4 {
      font-weight: 600;
      margin-block: 8px;
      margin-inline: 0;
    }

    .text-caption {
      color: rgba(var(--v-theme-on-surface), 0.6);
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

  .filter-container {
    display: flex;
    align-items: center;
    gap: 16px;

    .status-select {
      inline-size: 180px;
    }

    .date-field {
      inline-size: 200px;
    }
  }

  :deep(.v-menu > .v-overlay__content) {
    border-radius: 8px;
    box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 10%);
  }

  :deep(.v-field__input) {
    min-block-size: 40px;
    padding-block: 0;
  }
}
</style>
