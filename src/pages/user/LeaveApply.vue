<script setup>
import { snackbar } from "@/utils/ty.js";
import { onMounted, ref, watch } from 'vue';

// 请假表单数据
const leaveForm = ref({
  startDate: '',
  endDate: '',
  leaveType: '',  // 请假类型
  reason: '',     // 请假原因
  attachment: null // 附件（如有）
})

// 请假类型选项
const leaveTypes = [
  { title: '事假', value: 'personal' },
  { title: '病假', value: 'sick' },
  { title: '其他', value: 'other' },
]

// 表单验证规则
const rules = {
  startDate: [v => !!v || '请选择开始日期'],
  endDate: [
    v => !!v || '请选择结束日期',
    v => new Date(v) >= new Date(leaveForm.value.startDate) || '结束日期不能早于开始日期'
  ],
  leaveType: [v => !!v || '请选择请假类型'],
  reason: [
    v => !!v || '请填写请假原因',
    v => v.length >= 10 || '请假原因至少10个字'
  ],
}

// 历史请假记录表头
const leaveHeaders = ref([
  { title: '申请日期', key: 'applyDate', sortable: true },
  { title: '开始日期', key: 'startDate', sortable: true },
  { title: '结束日期', key: 'endDate', sortable: true },
  { title: '请假类型', key: 'leaveType' },
  { title: '请假原因', key: 'reason' },
  { title: '审批状态', key: 'status', sortable: true },
  { title: '审批意见', key: 'comment' },
])

// 历史请假记录
const leaveRecords = ref([])

// 分页配置
const options = ref({
  page: 1,
  itemsPerPage: 5,
})

// 表单对话框控制
const showDialog = ref(false)
const formValid = ref(true)
const loading = ref(false)

// 筛选条件
const filterDate = ref('')
const filterStatus = ref('all')

// 筛选选项
const statusOptions = [
  { title: '全部', value: 'all' },
  { title: '已批准', value: '已批准' },
  { title: '已驳回', value: '已驳回' },
  { title: '审批中', value: '审批中' },
]

// 原始数据
const originalRecords = ref([])

// 获取历史请假记录
const fetchLeaveRecords = async () => {
  try {
    // 模拟数据
    originalRecords.value = [
      {
        applyDate: '2024-03-20',
        startDate: '2024-03-21',
        endDate: '2024-03-22',
        leaveType: '事假',
        reason: '参加亲属婚礼',
        status: '已批准',
        comment: '同意',
      },
      {
        applyDate: '2024-03-15',
        startDate: '2024-03-16',
        endDate: '2024-03-17',
        leaveType: '病假',
        reason: '感冒发烧需要休息',
        status: '审批中',
        comment: '',
      },
      {
        applyDate: '2024-03-10',
        startDate: '2024-03-11',
        endDate: '2024-03-12',
        leaveType: '其他',
        reason: '参加技术培训',
        status: '已驳回',
        comment: '时间安排不合适',
      },
    ]
    
    // 初始显示所有数据
    leaveRecords.value = [...originalRecords.value]
  } catch (error) {
    console.error('获取请假记录失败:', error)
    snackbar.value = {
      show: true,
      text: error.message || '获取记录失败，请重试',
      color: 'error',
      timeout: 3000,
    }
  }
}

// 筛选数据
const filterRecords = () => {
  let filteredData = [...originalRecords.value]
  
  // 日期筛选
  if (filterDate.value) {
    filteredData = filteredData.filter(record => 
      record.startDate === filterDate.value || 
      record.endDate === filterDate.value ||
      (record.startDate <= filterDate.value && record.endDate >= filterDate.value)
    )
  }
  
  // 状态筛选
  if (filterStatus.value !== 'all') {
    filteredData = filteredData.filter(record => 
      record.status === filterStatus.value
    )
  }
  
  leaveRecords.value = filteredData
}

// 监听筛选条件变化
watch([filterDate, filterStatus], () => {
  filterRecords()
})

// 提交请假申请
const handleSubmit = async () => {
  const { valid } = await formValid.value
  if (!valid) return
  
  loading.value = true
  try {
    // 模拟提交成功
    setTimeout(() => {
      snackbar.value = {
        show: true,
        text: '请假申请提交成功',
        color: 'success',
        timeout: 3000,
      }
      
      showDialog.value = false
      fetchLeaveRecords() // 刷新记录
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('提交请假申请失败:', error)
    snackbar.value = {
      show: true,
      text: error.message || '提交失败，请重试',
      color: 'error',
      timeout: 3000,
    }
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
  formValid.value = true
}

onMounted(() => {
  fetchLeaveRecords()
})
</script>

<template>
  <div class="leave-apply">
    <!-- 页面标题和新增按钮 -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h4">请假申请</h2>
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
          <VCol cols="12" md="4">
            <AppDateTimePicker
              v-model="filterDate"
              label="按日期筛选"
              placeholder="选择日期"
              density="compact"
              hide-details
            />
          </VCol>
          
          <VCol cols="12" md="4">
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
          :no-data-text="'暂无数据'"
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
              <VCol cols="12" md="6">
                <VTextField
                  v-model="leaveForm.startDate"
                  label="开始日期"
                  type="date"
                  :rules="rules.startDate"
                  required
                />
              </VCol>
              
              <!-- 结束日期 -->
              <VCol cols="12" md="6">
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
            ��交申请
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
    gap: 16px;
    padding: 8px 16px;
    background-color: rgb(var(--v-theme-surface));
  }
}
</style> 
