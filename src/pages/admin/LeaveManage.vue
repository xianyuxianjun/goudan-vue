<script setup>
import TableHead from "@/views/TableHead.vue";
import { onMounted, ref, watch } from "vue";

// 表头定义
const leaveHeader = ref([
  { title: '申请编号', key: 'leaveId', sortable: true },
  { title: '申请人', key: 'name', sortable: true },
  { title: '项目组', key: 'department', sortable: true },
  { title: '请假类型', key: 'type', sortable: true },
  { title: '开始时间', key: 'startTime', sortable: true },
  { title: '结束时间', key: 'endTime', sortable: true },
  { title: '请假天数', key: 'days', sortable: true },
  { title: '申请状态', key: 'status', sortable: true },
  { title: '操作', key: 'actions' },
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
      item.leaveId.includes(searchValue.value)
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

// 审批操作
const approveLeave = (item) => {
  // 这里添加实际的审批逻辑
  item.status = '已通过'
  // 可以添加成功提示
}

const rejectLeave = (item) => {
  // 这里添加实际的拒绝逻辑
  item.status = '已拒绝'
  // 可以添加成功提示
}

// 获取请假数据
const getLeaveData = () => {
  // 模拟API调用
  leaveData.value = [
    {
      leaveId: 'L202403200001',
      name: '张三',
      department: '研发一组',
      type: '事假',
      startTime: '2024-03-20',
      endTime: '2024-03-21',
      days: '2',
      status: '待审批',
      reason: '个人事务',
      avatar: null,
    },
    {
      leaveId: 'L202403200002',
      name: '李四',
      department: '研发二组',
      type: '病假',
      startTime: '2024-03-22',
      endTime: '2024-03-23',
      days: '2',
      status: '已通过',
      reason: '感冒发烧',
      avatar: null,
    },
  ]
  leaveList.value = leaveData.value
}

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
            { title: '待审批', value: '待审批' },
            { title: '已通过', value: '已通过' },
            { title: '已拒绝', value: '已拒绝' }
          ]"
          label="申请状态"
          density="compact"
          hide-details
          variant="outlined"
          class="status-select"
          style="width: 180px"
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
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <VAvatar size="32" class="me-2">
              <VImg v-if="item.avatar" :src="item.avatar" />
              <span v-else class="text-caption">{{ item.name.charAt(0) }}</span>
            </VAvatar>
            {{ item.name }}
          </div>
        </template>

        <template #item.status="{ item }">
          <VChip
            :color="item.status === '已通过' ? 'success' : 
                   item.status === '已拒绝' ? 'error' : 'warning'"
            size="small"
            variant="elevated"
          >
            {{ item.status }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex align-center">
            <VTooltip text="通过申请" location="top" v-if="item.status === '待审批'">
              <template v-slot:activator="{ props }">
                <VBtn
                  v-bind="props"
                  variant="tonal"
                  color="success"
                  size="small"
                  class="me-2"
                  @click="approveLeave(item)"
                >
                  <VIcon size="20" icon="mdi-check-circle-outline"/>
                  <span class="ms-2">通过</span>
                </VBtn>
              </template>
            </VTooltip>
            
            <VTooltip text="拒绝申请" location="top" v-if="item.status === '待审批'">
              <template v-slot:activator="{ props }">
                <VBtn
                  v-bind="props"
                  variant="tonal"
                  color="error"
                  size="small"
                  @click="rejectLeave(item)"
                >
                  <VIcon size="20" icon="mdi-close-circle-outline"/>
                  <span class="ms-2">拒绝</span>
                </VBtn>
              </template>
            </VTooltip>

            <!-- 已处理的申请显示结果图标 -->
            <VTooltip
              :text="item.status === '已通过' ? '已通过申请' : '已拒绝申请'"
              location="top"
              v-if="item.status !== '待审批'"
            >
              <template v-slot:activator="{ props }">
                <VIcon
                  v-bind="props"
                  size="24"
                  :color="item.status === '已通过' ? 'success' : 'error'"
                  :icon="item.status === '已通过' ? 'mdi-check-circle' : 'mdi-close-circle'"
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
</template>

<style scoped lang="scss">
:deep(.v-field__input) {
  min-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
</style> 
