<script setup>
import { getMyLeaveApplications, submitLeaveApplication } from '@/api/leaveApplication'
import { useUserStore } from '@/stores/user'
import { calculateLeaveDuration } from '@/utils/leaveUtils'
import { snackbar } from "@/utils/ty"
import { onMounted, ref, watch } from 'vue'

const userStore = useUserStore()

// 请假表单数据
const leaveForm = ref({
  startDate: '',
  endDate: '',
  leaveType: '',
  reason: '',
  attachment: null,
})

// 历史请假记录数据
const recordList = ref([])
const recordData = ref([])
const leaveRecords = ref([])

// 请假类型选项
const leaveTypes = [
  { title: '事假', value: '事假' },
  { title: '病假', value: '病假' },
  { title: '其他', value: '其他' },
]

// 状态选项
const statusOptions = [
  { title: '全部', value: 'all' },
  { title: '已批准', value: '已批准' },
  { title: '已驳回', value: '已驳回' },
  { title: '待审批', value: '待审批' },
]

// 筛选条件
const filterDate = ref('')
const filterStatus = ref('all')

// 分页配置
const options = ref({
  page: 1,
  itemsPerPage: 5,
})

// 表单对话框控制
const showDialog = ref(false)
const formValid = ref(null)
const valid = ref(false)
const loading = ref(false)

// 表单验证规则
const rules = {
  startDate: [v => !!v || '请选择开始日期'],
  endDate: [
    v => !!v || '请选择结束日期',
    v => new Date(v) >= new Date(leaveForm.value.startDate) || '结束日期不能早于开始日期',
  ],
  leaveType: [v => !!v || '请选择请假类型'],
  reason: [
    v => !!v || '请填写请假原因',
    v => v.length >= 10 || '请假原因至少10个字',
  ],
}

// 历史请假记录表头
const leaveHeaders = ref([
  { title: '申请编号', key: 'id', sortable: true },
  { title: '申请日期', key: 'createdAt', sortable: true },
  { title: '开始日期', key: 'startTime', sortable: true },
  { title: '结束日期', key: 'endTime', sortable: true },
  { title: '请假类型', key: 'leaveType' },
  { title: '项目组', key: 'groupName' },
  { title: '请假天数', key: 'duration' },
  { title: '请假原因', key: 'reason' },
  { title: '审批状态', key: 'status', sortable: true },
  { title: '审批意见', key: 'approvalRemark' },
])

// 获取历史请假记录
const fetchLeaveRecords = async () => {
  try {
    const res = await getMyLeaveApplications({
      userId: userStore.userId,
    })
    
    console.log(res)
    
    if (res.code === 1) {
      const formattedData = res.data.map(item => ({
        ...item,
        id: String(item.id).padStart(4, '0'),
        createdAt: item.createdAt.split('T')[0],
        startTime: item.startTime.split('T')[0],
        endTime: item.endTime.split('T')[0],
        duration: item.duration ? `${item.duration}天` : '-',
        groupName: item.groupName || '-',
        leaveType: item.leaveType || '-',
        approvalRemark: item.approvalRemark || '-',
      }))

      recordData.value = formattedData
      recordList.value = formattedData
      leaveRecords.value = formattedData
    } else {
      snackbar.value = {
        show: true,
        text: res.msg || '获取记录失败',
        color: 'error',
      }
    }
  } catch (error) {
    console.error('获取请假记录失败:', error)
    snackbar.value = {
      show: true,
      text: '获取记录失败，请重试',
      color: 'error',
    }
  }
}

// 筛选数据
const filterRecords = () => {
  let filteredData = [...recordData.value]
  
  // 日期筛选
  if (filterDate.value) {
    filteredData = filteredData.filter(record => 
      record.startTime === filterDate.value || 
      record.endTime === filterDate.value ||
      (record.startTime <= filterDate.value && record.endTime >= filterDate.value),
    )
  }
  
  // 状态筛选
  if (filterStatus.value !== 'all') {
    filteredData = filteredData.filter(record => 
      record.status === filterStatus.value,
    )
  }
  
  recordList.value = filteredData
  leaveRecords.value = filteredData
}

// 监听筛选条件变化
watch([filterDate, filterStatus], () => {
  filterRecords()
})

// 提交请假申请
const handleSubmit = async () => {
  const form = await formValid.value
  if (!form.validate()) return

  loading.value = true
  try {
    // 计算请假天数
    const duration = calculateLeaveDuration(leaveForm.value.startDate, leaveForm.value.endDate)
    
    const data = {
      userId: userStore.userId,
      name: userStore.name,
      groupName: userStore.groupName,
      leaveType: leaveForm.value.leaveType,
      startTime: `${leaveForm.value.startDate} 00:00:00`, // 添加时间部分
      endTime: `${leaveForm.value.endDate} 23:59:59`,
      duration: duration,
      reason: leaveForm.value.reason,
      status: '未审批', // 设置初始状态
    }
    
    console.log('提交请假数据:', data)

    const res = await submitLeaveApplication(data)

    console.log('提交响应:', res)
    
    if (res.code === 1) {
      snackbar.value = {
        show: true,
        text: '请假申请提交成功',
        color: 'success',
      }
      showDialog.value = false
      resetForm() // 重置表单
      fetchLeaveRecords() // 刷新记录
    } else {
      throw new Error(res.msg || '提交失败')
    }
  } catch (error) {
    console.error('提交请假申请失败:', error)
    snackbar.value = {
      show: true,
      text: error.message || '提交失败，请重试',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  leaveForm.value = {
    startDate: '',
    endDate: '',
    leaveType: '',
    reason: '',
    attachment: null,
  }
  formValid.value = null
  valid.value = false
}

onMounted(() => {
  fetchLeaveRecords()
})
</script>

<template>
  <div class="leave-apply">
    <!-- 页面标题和新增按钮 -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h4">
        请假申请
      </h2>
      <VBtn
        color="primary"
        prepend-icon="ri-add-line"
        @click="showDialog = true"
      >
        新增请假
      </VBtn>
    </div>
    
    <!-- 历史请假记录 -->
    <VCard>
      <VCardTitle class="px-4 py-3">
        历史请假记录
      </VCardTitle>
      
      <VDivider />
      
      <!-- 添加筛选工具栏 -->
      <VCardText class="py-2">
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <AppDateTimePicker
              v-model="filterDate"
              label="按日期筛选"
              placeholder="选择日期"
              density="compact"
              hide-details
            />
          </VCol>
          
          <VCol
            cols="12"
            md="4"
          >
            <VSelect
              v-model="filterStatus"
              :items="statusOptions"
              label="审批状态"
              density="compact"
              hide-details
            />
          </VCol>
        </VRow>
      </VCardText>
      
      <VDivider />
      
      <VCardText>
        <VDataTable
          :headers="leaveHeaders"
          :items="leaveRecords"
          :items-per-page="options.itemsPerPage"
          :page="options.page"
          hover
          no-data-text="暂无数据"
        >
          <!-- 状态列自定义显示 -->
          <template #item.status="{ item }">
            <VChip
              :color="item.status === '已批准' ? 'success' :
                item.status === '已驳回' ? 'error' : 'warning'"
              size="small"
              variant="elevated"
            >
              {{ item.status }}
            </VChip>
          </template>
          
          <!-- 分页 -->
          <template #bottom>
            <VDivider />
            <div class="d-flex align-center justify-space-between pa-4">
              <div class="text-caption">
                共 {{ leaveRecords.length }} 条记录
              </div>
              <VPagination
                v-model="options.page"
                :total-visible="3"
                :length="Math.ceil(leaveRecords.length / options.itemsPerPage)"
                rounded="circle"
              />
            </div>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
    
    <!-- 请假申请表单对话框 -->
    <VDialog
      v-model="showDialog"
      max-width="600"
      @click:outside="resetForm"
    >
      <VCard>
        <VCardTitle class="px-4 py-3">
          新增请假申请
          <VBtn
            icon
            variant="text"
            size="small"
            class="float-right"
            @click="showDialog = false"
          >
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </VCardTitle>
        
        <VDivider />
        
        <VCardText>
          <VForm
            ref="formValid"
            v-model="valid"
            @submit.prevent="handleSubmit"
          >
            <VRow>
              <!-- 开始日期 -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="leaveForm.startDate"
                  label="开始日期"
                  type="date"
                  :rules="rules.startDate"
                  required
                />
              </VCol>
              
              <!-- 结束日期 -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="leaveForm.endDate"
                  label="结束日期"
                  type="date"
                  :rules="rules.endDate"
                  required
                />
              </VCol>
              
              <!-- 请假类型 -->
              <VCol cols="12">
                <VSelect
                  v-model="leaveForm.leaveType"
                  :items="leaveTypes"
                  label="请假类型"
                  :rules="rules.leaveType"
                  required
                />
              </VCol>
              
              <!-- 请假原因 -->
              <VCol cols="12">
                <VTextarea
                  v-model="leaveForm.reason"
                  label="请假原因"
                  :rules="rules.reason"
                  rows="3"
                  required
                />
              </VCol>
              
              <!-- 附件上传 -->
              <VCol cols="12">
                <VFile
                  v-model="leaveForm.attachment"
                  label="上传附件（可选）"
                  prepend-icon="ri-upload-line"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        
        <VDivider />
        
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            variant="outlined"
            color="secondary"
            @click="showDialog = false"
          >
            取消
          </VBtn>
          <VBtn
            color="primary"
            :loading="loading"
            @click="handleSubmit"
          >
            提交申请
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    
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
.leave-apply {
  .v-data-table {
    .v-data-table-header {
      th {
        font-weight: 600;
        white-space: nowrap;
      }
    }
  }

  // 添加筛选工具栏样式
  .filter-toolbar {
    display: flex;
    background-color: rgb(var(--v-theme-surface));
    gap: 16px;
    padding-block: 8px;
    padding-inline: 16px;
  }
}
</style> 
