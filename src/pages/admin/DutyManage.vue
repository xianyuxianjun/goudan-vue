<script setup>
import TableHead from "@/views/TableHead.vue";
import { onMounted, ref } from "vue";

// 表头定义
const dutyHeader = ref([
  { title: '值日组', key: 'groupName', sortable: true },
  { title: '值日成员', key: 'members' },
  { title: '值日日期', key: 'dutyDate', sortable: true },
  { title: '值日状态', key: 'status', sortable: true },
  { title: '检查结果', key: 'checkResult' },
  { title: '惩罚情况', key: 'punishment' },
  { title: '备注', key: 'remark' },
  { title: '操作', key: 'actions' },
])

// 值日数据
const dutyList = ref([
  {
    groupName: '第一组',
    members: [
      { userId: 'S202209512245', name: '张三', department: '研发一组' },
      { userId: 'S202209512246', name: '李四', department: '研发二组' },
    ],
    dutyDate: '2024-03-20',
    status: '已完成',
    checkResult: '良好',
    punishment: '',
    remark: '',
  },
  {
    groupName: '第二组',
    members: [
      { userId: 'S202209512247', name: '王五', department: '研发一组' },
      { userId: 'S202209512248', name: '赵六', department: '研发二组' },
      { userId: 'S202209512249', name: '孙七', department: '研发三组' },
    ],
    dutyDate: '2024-03-21',
    status: '待值日',
    checkResult: '-',
    punishment: '',
    remark: '',
  },
])

// 搜索和筛选
const searchValue = ref('')
const selectedStatus = ref('all')

// 统计数据
const statistics = ref({
  total: 0,
  pending: 0,
  completed: 0,
  excellent: 0,
})

// 更新统计数据
const updateStatistics = () => {
  statistics.value = {
    total: dutyList.value.length,
    pending: dutyList.value.filter(item => item.status === '待值日').length,
    completed: dutyList.value.filter(item => item.status === '已完成').length,
    excellent: dutyList.value.filter(item => item.checkResult === '优秀').length,
  }
}

// 分页配置
const options = ref({
  page: 1,
  itemsPerPage: 10,
})

// 检查结果对话框
const checkDialog = ref(false)
const selectedItem = ref(null)
const checkResultForm = ref({
  result: '',
  punishment: '',
  remark: '',
})

// 检查结果选项
const resultOptions = [
  { title: '优秀', value: '优秀' },
  { title: '良好', value: '良好' },
  { title: '合格', value: '合格' },
  { title: '不合格', value: '不合格' },
]

// 惩罚选项
const punishmentOptions = [
  { title: '无惩罚', value: '' },
  { title: '额外值日1天', value: '��外值日1天' },
  { title: '额外值日2天', value: '额外值日2天' },
  { title: '额外值日3天', value: '额外值日3天' },
]

// 检查值日
const checkDuty = (item) => {
  selectedItem.value = item
  checkResultForm.value = {
    result: item.checkResult || '',
    punishment: item.punishment || '',
    remark: item.remark || '',
  }
  checkDialog.value = true
}

// 提交检查结果
const submitCheckResult = () => {
  if (selectedItem.value) {
    // 这里添加实际的API调用
    selectedItem.value.checkResult = checkResultForm.value.result
    selectedItem.value.punishment = checkResultForm.value.punishment
    selectedItem.value.remark = checkResultForm.value.remark
    
    // 如果有惩罚，自动添加惩罚值日记录
    if (checkResultForm.value.punishment) {
      const punishmentDays = parseInt(checkResultForm.value.punishment.match(/\d+/)[0])
      // 这里添加生成惩罚值日记录的逻辑
    }
    
    updateStatistics()
    checkDialog.value = false
  }
}

// 标记完成
const markComplete = (item) => {
  // 这里添加实际的完成逻辑
}

onMounted(() => {
  updateStatistics()
})
</script>

<template>
  <div class="duty-manage">
    <!-- 统计卡片 -->
    <VRow class="mb-6">
      <VCol cols="12" sm="6" md="3">
        <VCard class="stat-card" elevation="2">
          <VCardItem>
            <VCardTitle class="text-primary">总安排</VCardTitle>
            <template #append>
              <VIcon icon="ri-calendar-todo-line" size="32" color="primary"/>
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">{{ statistics.total }}</div>
            <div class="text-caption">本月值日安</div>
          </VCardText>
        </VCard>
      </VCol>
      
      <VCol cols="12" sm="6" md="3">
        <VCard class="stat-card" elevation="2">
          <VCardItem>
            <VCardTitle class="text-warning">待值日</VCardTitle>
            <template #append>
              <VIcon icon="ri-time-line" size="32" color="warning"/>
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">{{ statistics.pending }}</div>
            <div class="text-caption">待值日人数</div>
          </VCardText>
        </VCard>
      </VCol>
      
      <VCol cols="12" sm="6" md="3">
        <VCard class="stat-card" elevation="2">
          <VCardItem>
            <VCardTitle class="text-success">已完成</VCardTitle>
            <template #append>
              <VIcon icon="ri-check-double-line" size="32" color="success"/>
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">{{ statistics.completed }}</div>
            <div class="text-caption">已完成人数</div>
          </VCardText>
        </VCard>
      </VCol>
      
      <VCol cols="12" sm="6" md="3">
        <VCard class="stat-card" elevation="2">
          <VCardItem>
            <VCardTitle class="text-info">优秀</VCardTitle>
            <template #append>
              <VIcon icon="ri-medal-line" size="32" color="info"/>
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">{{ statistics.excellent }}</div>
            <div class="text-caption">优秀评价数</div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 主要内容卡片 -->
    <VCard elevation="2">
      <TableHead @search="search">
        <template #one>
          <div class="filter-container">
            <VSelect
              v-model="selectedStatus"
              :items="[
                { title: '全部', value: 'all' },
                { title: '待值日', value: '待值日' },
                { title: '已完成', value: '已完成' }
              ]"
              label="值日状态"
              density="compact"
              hide-details
              variant="outlined"
              class="status-select"
            />
          </div>
        </template>
      </TableHead>

      <VDivider />

      <VCardText>
        <VDataTable
          :headers="dutyHeader"
          :items="dutyList"
          :items-per-page="options.itemsPerPage"
          :page="options.page"
          hover
          class="elevation-1"
        >
          <template #item.members="{ item }">
            <div class="d-flex flex-wrap gap-2">
              <VChip
                v-for="member in item.members"
                :key="member.userId"
                size="small"
                variant="tonal"
                color="primary"
                class="member-chip"
              >
                <template #prepend>
                  <VAvatar size="24" color="primary" class="member-avatar">
                    <span class="text-white text-caption">{{ member.name.charAt(0) }}</span>
                  </VAvatar>
                </template>
                <span class="member-name">{{ member.name }}</span>
              </VChip>
            </div>
          </template>

          <template #item.status="{ item }">
            <VChip
              :color="item.status === '已完成' ? 'success' : 'warning'"
              size="small"
              variant="elevated"
            >
              <template #prepend>
                <VIcon size="16" :icon="item.status === '已完成' ? 'ri-check-line' : 'ri-time-line'"/>
              </template>
              {{ item.status }}
            </VChip>
          </template>

          <template #item.checkResult="{ item }">
            <VChip
              v-if="item.status === '已完成'"
              :color="item.checkResult === '优秀' ? 'info' : 
                     item.checkResult === '良好' ? 'success' : 'warning'"
              size="small"
              variant="tonal"
            >
              {{ item.checkResult }}
            </VChip>
            <span v-else>-</span>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex align-center">
              <VBtn
                v-if="item.status === '待值日'"
                icon
                size="small"
                color="success"
                variant="text"
                class="me-2"
                @click="markComplete(item)"
              >
                <VIcon size="20" icon="ri-check-line"/>
                <VTooltip activator="parent" location="top">标记完成</VTooltip>
              </VBtn>
              
              <VBtn
                v-if="item.status === '已完成'"
                icon
                size="small"
                color="primary"
                variant="text"
                @click="checkDuty(item)"
              >
                <VIcon size="20" icon="ri-file-list-3-line"/>
                <VTooltip activator="parent" location="top">检查结果</VTooltip>
              </VBtn>
            </div>
          </template>

          <template #bottom>
            <VDivider />
            <div class="d-flex align-center justify-space-between pa-4">
              <div class="text-caption">
                共 {{ dutyList.length }} 条记录
              </div>
              <VPagination
                v-model="options.page"
                :total-visible="$vuetify.display.smAndDown ? 2 : 3"
                :length="Math.ceil(dutyList.length / options.itemsPerPage)"
                rounded="circle"
              />
            </div>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

    <!-- 检查结果对话框 -->
    <VDialog
      v-model="checkDialog"
      max-width="500"
    >
      <VCard>
        <VCardTitle class="d-flex align-center pa-4">
          <VIcon icon="ri-file-list-3-line" color="primary" class="me-2"/>
          检查结果
        </VCardTitle>
        
        <VDivider/>
        
        <VCardText class="pt-4">
          <VRow>
            <VCol cols="12">
              <div class="d-flex align-center mb-2">
                <div class="text-subtitle-1">{{ selectedItem?.groupName }}</div>
                <VDivider vertical class="mx-2"/>
                <div class="text-caption">{{ selectedItem?.dutyDate }}</div>
              </div>
              <div class="d-flex flex-wrap gap-2 mb-4">
                <VChip
                  v-for="member in selectedItem?.members"
                  :key="member.userId"
                  size="small"
                  variant="tonal"
                  color="primary"
                  class="member-chip"
                >
                  <template #prepend>
                    <VAvatar size="24" color="primary" class="member-avatar">
                      <span class="text-white text-caption">{{ member.name.charAt(0) }}</span>
                    </VAvatar>
                  </template>
                  <span class="member-name">{{ member.name }}</span>
                </VChip>
              </div>
            </VCol>
            
            <VCol cols="12">
              <VSelect
                v-model="checkResultForm.result"
                :items="resultOptions"
                label="检查结果"
                density="comfortable"
                variant="outlined"
                required
              />
            </VCol>
            
            <VCol cols="12">
              <VSelect
                v-model="checkResultForm.punishment"
                :items="punishmentOptions"
                label="惩罚措施"
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            
            <VCol cols="12">
              <VTextarea
                v-model="checkResultForm.remark"
                label="备注"
                variant="outlined"
                rows="3"
                density="comfortable"
                placeholder="请输入检查备注..."
              />
            </VCol>
          </VRow>
        </VCardText>
        
        <VDivider/>
        
        <VCardActions class="pa-4">
          <VSpacer/>
          <VBtn
            variant="tonal"
            color="secondary"
            @click="checkDialog = false"
          >
            取消
          </VBtn>
          <VBtn
            color="primary"
            class="ms-2"
            @click="submitCheckResult"
            :disabled="!checkResultForm.result"
          >
            提交
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped lang="scss">
.duty-manage {
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
      margin: 8px 0;
    }
    
    .text-caption {
      color: rgba(var(--v-theme-on-surface), 0.6);
    }
  }

  .filter-container {
    display: flex;
    align-items: center;
    gap: 16px;

    .status-select {
      width: 180px;
    }
  }

  :deep(.v-field__input) {
    min-height: 40px;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.v-dialog {
  :deep(.v-card) {
    .v-card-title {
      font-size: 1.1rem;
    }
  }
}

.member-chip {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
  
  .member-avatar {
    background-color: rgb(var(--v-theme-primary)) !important;
    color: rgb(var(--v-theme-surface));
  }
  
  .member-name {
    color: rgba(var(--v-theme-on-surface), 0.87);
    font-weight: 500;
  }

  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.12) !important;
  }
}
</style> 
