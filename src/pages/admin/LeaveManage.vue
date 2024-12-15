<script setup>
import { approveLeaveApplication, getAllLeaveApplications, rejectLeaveApplication } from '@/api/leaveApplication';
import { useUserStore } from '@/stores/user';
import TableHead from "@/views/TableHead.vue";
import { onMounted, ref, watch } from "vue";

const userStore = useUserStore()

// 表头定义
const leaveHeader = ref([
  { title: '基本信息', key: 'basicInfo', sortable: false },
  { title: '请假时间', key: 'leaveTime', sortable: true },
  { title: '请假详情', key: 'leaveDetails', sortable: false },
  { title: '审批状态', key: 'approvalInfo', sortable: true },
  { title: '操作', key: 'actions', sortable: false },
])

// 请假数据
const leaveList = ref([])
const leaveData = ref([])

// 搜索和筛选
const searchValue = ref('')
const selectedStatus = ref('all')

// 分页配置
const options = ref({
  page: 1,
  itemsPerPage: 10,
})

// 搜索功能
function search(value) {
  searchValue.value = value
  filterData()
}

// 综合筛选函数
const filterData = () => {
  let filteredData = [...leaveData.value]
  
  // 搜索筛选
  if (searchValue.value) {
    filteredData = filteredData.filter(item => 
      item.name.includes(searchValue.value) ||
      item.leaveId.includes(searchValue.value),
    )
  }
  
  // 状态筛选
  if (selectedStatus.value !== 'all') {
    filteredData = filteredData.filter(item => item.status === selectedStatus.value)
  }
  
  leaveList.value = filteredData
}

// 监听筛选条件变化
watch([selectedStatus], () => {
  filterData()
})

// 获取请假数据
const getLeaveData = async () => {
  try {
    const res = await getAllLeaveApplications()
    
    if (res.code === 1) {
      leaveData.value = res.data.map(item => ({
        ...item,
        id: String(item.id).padStart(4, '0'),
        startTime: item.startTime.split('T')[0],
        endTime: item.endTime.split('T')[0],
        duration: item.duration ? `${item.duration}天` : '-',
        groupName: item.groupName || '-',
        leaveType: item.leaveType || '-',
        reason: item.reason || '-',
        approvalRemark: item.approvalRemark || '-',
        approverName: item.approverName || '-',
      }))
      leaveList.value = leaveData.value
    } else {
      throw new Error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取请假数据失败:', error)
    snackbar.value = {
      show: true,
      text: error.message || '获取数据失败，请���试',
      color: 'error',
    }
  }
}

// 审批对话框控制
const approvalDialog = ref(false)
const approvalLoading = ref(false)
const approvalRemark = ref('')
const currentItem = ref(null)
const approvalType = ref('') // 'approve' 或 'reject'

// 打开审批对话框
const openApprovalDialog = (item, type) => {
  currentItem.value = item
  approvalType.value = type
  approvalRemark.value = type === 'approve' ? '同意' : '' // 默认同意时填写"同意"
  approvalDialog.value = true
}

// 提交审批
const submitApproval = async () => {
  if (!approvalRemark.value.trim()) {
    snackbar.value = {
      show: true,
      text: '请填写审批意见',
      color: 'warning',
    }
    
    return
  }

  approvalLoading.value = true
  try {
    const data = {
      id: currentItem.value.id,
      approverId: userStore.userId,
      approverName: userStore.name,
      approvalRemark: approvalRemark.value.trim(),
    }
    
    const res = await (approvalType.value === 'approve' 
      ? approveLeaveApplication(data)
      : rejectLeaveApplication(data))
    
    if (res.code === 1) {
      snackbar.value = {
        show: true,
        text: approvalType.value === 'approve' ? '审批通过成功' : '已拒绝申请',
        color: 'success',
      }
      approvalDialog.value = false
      getLeaveData() // 刷新数据
    } else {
      throw new Error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error('审批操作失败:', error)
    snackbar.value = {
      show: true,
      text: error.message || '操作失败，请重试',
      color: 'error',
    }
  } finally {
    approvalLoading.value = false
  }
}

// 修改操作按钮的点击事件
const approveLeave = item => openApprovalDialog(item, 'approve')
const rejectLeave = item => openApprovalDialog(item, 'reject')

onMounted(() => {
  getLeaveData()
})
</script>

<template>
  <VCard elevation="2">
    <TableHead @search="search">
      <template #one>
        <VSelect
          v-model="selectedStatus"
          :items="[
            { title: '全部', value: 'all' },
            { title: '未审批', value: '未审批' },
            { title: '已批准', value: '已批准' },
            { title: '已拒绝', value: '已拒绝' }
          ]"
          label="申请状态"
          density="compact"
          hide-details
          variant="outlined"
          class="status-select"
          style="inline-size: 180px;"
        />
      </template>
    </TableHead>

    <VDivider />

    <VCardText>
      <VDataTable
        :headers="leaveHeader"
        :items="leaveList"
        :items-per-page="options.itemsPerPage"
        :page="options.page"
        hover
        class="elevation-1"
      >
        <template #item.basicInfo="{ item }">
          <div class="d-flex flex-column">
            <div class="d-flex align-center mb-2">
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
              <div>
                <div class="font-weight-medium">
                  {{ item.name }}
                </div>
                <div class="text-caption">
                  {{ item.groupName }}
                </div>
              </div>
            </div>
            <div class="text-caption">
              申请编号：{{ item.id }}
            </div>
          </div>
        </template>

        <template #item.leaveTime="{ item }">
          <div class="d-flex flex-column">
            <div class="mb-1">
              <VIcon
                size="16"
                icon="ri-calendar-line"
                class="me-1"
              />
              {{ item.startTime }} 至 {{ item.endTime }}
            </div>
            <div class="text-caption">
              <VIcon
                size="16"
                icon="ri-time-line"
                class="me-1"
              />
              共 {{ item.duration }}
            </div>
          </div>
        </template>

        <template #item.leaveDetails="{ item }">
          <div class="d-flex flex-column">
            <div class="mb-1">
              <VChip
                size="small"
                :color="item.leaveType === '事假' ? 'primary' : 
                  item.leaveType === '病假' ? 'warning' : 'info'"
                class="mb-1"
              >
                {{ item.leaveType }}
              </VChip>
            </div>
            <VTooltip
              location="top"
              max-width="300"
            >
              <template #activator="{ props }">
                <div
                  v-bind="props"
                  class="text-truncate"
                  style="max-inline-size: 200px;"
                >
                  {{ item.reason }}
                </div>
              </template>
              {{ item.reason }}
            </VTooltip>
          </div>
        </template>

        <template #item.approvalInfo="{ item }">
          <div class="d-flex flex-column">
            <VChip
              :color="item.status === '已批准' ? 'success' : 
                item.status === '已拒绝' ? 'error' : 'warning'"
              size="small"
              variant="elevated"
              class="mb-2"
            >
              {{ item.status }}
            </VChip>
            <template v-if="item.status !== '未审批'">
              <div class="text-caption mb-1">
                审批人：{{ item.approverName }}
              </div>
              <VTooltip
                v-if="item.approvalRemark !== '-'"
                location="top"
                max-width="300"
              >
                <template #activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-caption text-truncate"
                    style="max-inline-size: 150px;"
                  >
                    意见：{{ item.approvalRemark }}
                  </div>
                </template>
                {{ item.approvalRemark }}
              </VTooltip>
            </template>
          </div>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex align-center gap-2">
            <VTooltip
              v-if="item.status === '未审批'"
              text="通过申请"
              location="top"
            >
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  color="success"
                  icon="ri-checkbox-circle-line"
                  size="small"
                  variant="tonal"
                  @click="openApprovalDialog(item, 'approve')"
                />
              </template>
            </VTooltip>

            <VTooltip
              v-if="item.status === '未审批'"
              text="拒绝申请"
              location="top"
            >
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  color="error"
                  icon="ri-close-circle-line"
                  size="small"
                  variant="tonal"
                  @click="openApprovalDialog(item, 'reject')"
                />
              </template>
            </VTooltip>

            <!-- 已审批状态图标 -->
            <VTooltip
              v-else
              :text="item.status === '已批准' ? '已批准申请' : '已拒绝申请'"
              location="top"
            >
              <template #activator="{ props }">
                <VIcon
                  v-bind="props"
                  size="24"
                  :color="item.status === '已批准' ? 'success' : 'error'"
                  :icon="item.status === '已批准' ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"
                />
              </template>
            </VTooltip>
          </div>
        </template>

        <template #bottom>
          <VDivider />
          <div class="d-flex align-center justify-space-between pa-4">
            <div class="text-caption">
              共 {{ leaveList.length }} 条记录
            </div>
            <VPagination
              v-model="options.page"
              :total-visible="$vuetify.display.smAndDown ? 2 : 3"
              :length="Math.ceil(leaveList.length / options.itemsPerPage)"
              rounded="circle"
            />
          </div>
        </template>
      </VDataTable>
    </VCardText>
  </VCard>

  <!-- 审批对话框 -->
  <VDialog
    v-model="approvalDialog"
    max-width="500"
    persistent
  >
    <VCard>
      <VCardTitle class="px-4 py-3">
        {{ approvalType === 'approve' ? '通过申请' : '拒绝申请' }}
        <VBtn
          icon
          variant="text"
          size="small"
          class="float-right"
          :disabled="approvalLoading"
          @click="approvalDialog = false"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardTitle>

      <VDivider />

      <VCardText class="pt-4">
        <div
          v-if="currentItem"
          class="mb-4"
        >
          <div class="d-flex align-center mb-2">
            <VAvatar
              size="32"
              class="me-2"
            >
              <span class="text-caption">{{ currentItem.name.charAt(0) }}</span>
            </VAvatar>
            <div>
              <div class="font-weight-medium">
                {{ currentItem.name }}
              </div>
              <div class="text-caption">
                {{ currentItem.groupName }}
              </div>
            </div>
          </div>
          <div class="text-caption mb-2">
            申请编号：{{ currentItem.id }}
          </div>
          <div class="text-caption mb-2">
            请假时间：{{ currentItem.startTime }} 至 {{ currentItem.endTime }}
            （{{ currentItem.duration }}）
          </div>
          <div class="text-caption">
            请假原因：{{ currentItem.reason }}
          </div>
        </div>

        <VTextField
          v-model="approvalRemark"
          :label="approvalType === 'approve' ? '审批意见（同意）' : '拒绝原因'"
          :placeholder="approvalType === 'approve' ? '如：同意' : '请填写拒绝原因'"
          :rules="[v => !!v.trim() || '请填写审批意见']"
          :disabled="approvalLoading"
          variant="outlined"
          rows="3"
          required
        />
      </VCardText>

      <VDivider />

      <VCardActions class="pa-4">
        <VSpacer />
        <VBtn
          variant="outlined"
          :disabled="approvalLoading"
          @click="approvalDialog = false"
        >
          取消
        </VBtn>
        <VBtn
          :color="approvalType === 'approve' ? 'success' : 'error'"
          :loading="approvalLoading"
          @click="submitApproval"
        >
          {{ approvalType === 'approve' ? '通过' : '拒绝' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">
:deep(.v-field__input) {
  min-block-size: 40px;
  padding-block: 0;
}

.v-data-table {
  .v-data-table-header {
    th {
      background-color: rgb(var(--v-theme-surface));
      font-weight: 600;
      white-space: nowrap;
    }
  }

  td {
    padding-block: 12px;
    padding-inline: 16px;
  }
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-dialog {
  .v-card-title {
    position: relative;

    .v-btn {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-end: 8px;
      transform: translateY(-50%);
    }
  }
}

.gap-2 {
  gap: 8px;
}
</style> 
