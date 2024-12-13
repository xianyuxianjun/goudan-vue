<script setup>
import { onMounted, ref } from 'vue';

// 项目统计数据
const projectStats = ref({
  totalProjects: 8,
  activeProjects: 6,
  completedProjects: 2,
  totalMembers: 45,
})

// 考勤统计
const attendanceStats = ref({
  present: 42,
  late: 2,
  absent: 1,
  onLeave: 3,
})

// 活动标签页
const activeTab = ref('today')

// 今日签到排名
const todayRanking = ref([
  {
    name: '张三',
    department: '研发一组',
    checkInTime: '08:30:00',
    avatar: null,
    streak: 5, // 连续签到天数
  },
  {
    name: '李四',
    department: '研发二组',
    checkInTime: '08:35:00',
    avatar: null,
    streak: 3,
  },
  {
    name: '王五',
    department: '研发一组',
    checkInTime: '08:40:00',
    avatar: null,
  },
  {
    name: '赵六',
    department: '研发三组',
    checkInTime: '08:42:00',
    avatar: null,
  },
  {
    name: '孙七',
    department: '研发二组',
    checkInTime: '08:45:00',
    avatar: null,
  },
])

// 本月勤勉排名
const monthlyRanking = ref([
  {
    name: '张三',
    department: '研发一组',
    checkInDays: 22,
    onTimeRate: '100%',
    avatar: null,
  },
  {
    name: '李四',
    department: '研发二组',
    checkInDays: 21,
    onTimeRate: '95%',
    avatar: null,
  },
  {
    name: '王五',
    department: '研发一组',
    checkInDays: 20,
    onTimeRate: '98%',
    avatar: null,
  },
  {
    name: '赵六',
    department: '研发三组',
    checkInDays: 20,
    onTimeRate: '90%',
    avatar: null,
  },
  {
    name: '孙七',
    department: '研发二组',
    checkInDays: 19,
    onTimeRate: '95%',
    avatar: null,
  },
])

// 最近请假记录
const recentLeaves = ref([
  {
    name: '张三',
    type: '事假',
    startDate: '2024-03-20',
    endDate: '2024-03-21',
    status: '待审批',
  },
  {
    name: '李四',
    type: '病假',
    startDate: '2024-03-22',
    endDate: '2024-03-23',
    status: '已通过',
  },
])

// 获取任务优先级样式
const getPriorityStyle = (priority) => {
  const styles = {
    high: { color: 'error', icon: 'mdi-flag' },
    medium: { color: 'warning', icon: 'mdi-flag' },
    low: { color: 'success', icon: 'mdi-flag' },
  }
  return styles[priority] || styles.medium
}

onMounted(() => {
  // 这里可以添加实际的API调用来获取数据
})
</script>

<template>
  <VContainer fluid class="dashboard">
    <!-- 统计卡片行 -->
    <VRow>
      <!-- 项目统计 -->
      <VCol cols="12" sm="6" md="3">
        <VCard class="stat-card" elevation="2">
          <VCardItem>
            <VCardTitle class="text-primary">总项目数</VCardTitle>
            <template #append>
              <VIcon icon="mdi-folder-multiple" size="32" color="primary"/>
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">{{ projectStats.totalProjects }}</div>
            <div class="d-flex align-center justify-space-between mt-2">
              <span class="text-caption">进行中: {{ projectStats.activeProjects }}</span>
              <span class="text-caption">已完成: {{ projectStats.completedProjects }}</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 成员统计 -->
      <VCol cols="12" sm="6" md="3">
        <VCard class="stat-card" elevation="2">
          <VCardItem>
            <VCardTitle class="text-success">总成员数</VCardTitle>
            <template #append>
              <VIcon icon="mdi-account-group" size="32" color="success"/>
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">{{ projectStats.totalMembers }}</div>
            <div class="text-caption mt-2">活跃成员数</div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 考勤统计 -->
      <VCol cols="12" sm="6" md="3">
        <VCard class="stat-card" elevation="2">
          <VCardItem>
            <VCardTitle class="text-info">今日出勤</VCardTitle>
            <template #append>
              <VIcon icon="mdi-calendar-check" size="32" color="info"/>
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">{{ attendanceStats.present }}</div>
            <div class="d-flex align-center justify-space-between mt-2">
              <span class="text-caption text-warning">迟到: {{ attendanceStats.late }}</span>
              <span class="text-caption text-error">缺勤: {{ attendanceStats.absent }}</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 请假统计 -->
      <VCol cols="12" sm="6" md="3">
        <VCard class="stat-card" elevation="2">
          <VCardItem>
            <VCardTitle class="text-warning">请假人数</VCardTitle>
            <template #append>
              <VIcon icon="mdi-account-clock" size="32" color="warning"/>
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">{{ attendanceStats.onLeave }}</div>
            <div class="text-caption mt-2">当前请假人数</div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 签到排行榜和请假记录 -->
    <VRow class="mt-6">
      <!-- 签到排行榜 -->
      <VCol cols="12" md="8">
        <VCard elevation="2">
          <VCardTitle class="px-4 pt-3 pb-2">
            <VIcon icon="mdi-trophy" color="warning" size="28" class="me-2"/>
            签到排行榜
          </VCardTitle>

          <VTabs
            v-model="activeTab"
            color="primary"
            grow
            class="px-4"
          >
            <VTab value="today" class="py-3">
              <VIcon icon="mdi-clock-fast" class="me-2"/>
              今日签到英雄榜
            </VTab>
            <VTab value="monthly" class="py-3">
              <VIcon icon="mdi-calendar-check" class="me-2"/>
              本月勤勉之星
            </VTab>
          </VTabs>

          <VDivider/>

          <VCardText class="pa-4">
            <VWindow v-model="activeTab">
              <!-- 今日签到排名 -->
              <VWindowItem value="today">
                <div class="ranking-list">
                  <div
                    v-for="(item, index) in todayRanking"
                    :key="item.name"
                    class="ranking-item"
                    :class="`rank-${index + 1}`"
                  >
                    <div class="rank-medal" :class="`rank-${index + 1}`">
                      <VIcon
                        v-if="index < 3"
                        :icon="index === 0 ? 'mdi-crown' : 'mdi-medal'"
                        size="24"
                      />
                      <span v-else>{{ index + 1 }}</span>
                    </div>

                    <div class="d-flex align-center flex-grow-1">
                      <VAvatar size="48" class="me-3 ranking-avatar" :class="`rank-${index + 1}`">
                        <VImg v-if="item.avatar" :src="item.avatar"/>
                        <span v-else class="text-h6">{{ item.name.charAt(0) }}</span>
                      </VAvatar>
                      
                      <div class="flex-grow-1">
                        <div class="d-flex align-center">
                          <span class="text-h6">{{ item.name }}</span>
                          <VChip
                            v-if="index < 3"
                            size="small"
                            :color="index === 0 ? 'warning' : index === 1 ? 'grey' : 'brown'"
                            class="ms-2"
                            variant="flat"
                          >
                            {{ index === 0 ? '冠军' : index === 1 ? '亚军' : '季军' }}
                          </VChip>
                        </div>
                        <div class="d-flex align-center text-caption text-medium-emphasis">
                          <span>{{ item.department }}</span>
                          <VDivider vertical class="mx-2" />
                          <span>连续签到 {{ item.streak }} 天</span>
                        </div>
                      </div>

                      <div class="text-right">
                        <div class="text-h6 text-primary">{{ item.checkInTime }}</div>
                        <div class="text-caption text-medium-emphasis">签到时间</div>
                      </div>
                    </div>
                  </div>
                </div>
              </VWindowItem>

              <!-- 本月勤勉排名 -->
              <VWindowItem value="monthly">
                <div class="ranking-list">
                  <div
                    v-for="(item, index) in monthlyRanking"
                    :key="item.name"
                    class="ranking-item"
                    :class="`rank-${index + 1}`"
                  >
                    <div class="rank-medal" :class="`rank-${index + 1}`">
                      <VIcon
                        v-if="index < 3"
                        :icon="index === 0 ? 'mdi-crown' : 'mdi-medal'"
                        size="24"
                      />
                      <span v-else>{{ index + 1 }}</span>
                    </div>

                    <div class="d-flex align-center flex-grow-1">
                      <VAvatar size="48" class="me-3 ranking-avatar" :class="`rank-${index + 1}`">
                        <VImg v-if="item.avatar" :src="item.avatar"/>
                        <span v-else class="text-h6">{{ item.name.charAt(0) }}</span>
                      </VAvatar>
                      
                      <div class="flex-grow-1">
                        <div class="d-flex align-center">
                          <span class="text-h6">{{ item.name }}</span>
                          <VChip
                            v-if="index < 3"
                            size="small"
                            :color="index === 0 ? 'warning' : index === 1 ? 'grey' : 'brown'"
                            class="ms-2"
                            variant="flat"
                          >
                            {{ index === 0 ? '月度之星' : index === 1 ? '优秀' : '表扬' }}
                          </VChip>
                        </div>
                        <div class="d-flex align-center text-caption text-medium-emphasis">
                          <span>{{ item.department }}</span>
                          <VDivider vertical class="mx-2" />
                          <span>准时率 {{ item.onTimeRate }}</span>
                        </div>
                      </div>

                      <div class="text-right">
                        <div class="text-h6 text-success">{{ item.checkInDays }}天</div>
                        <div class="text-caption text-medium-emphasis">出勤天数</div>
                      </div>
                    </div>
                  </div>
                </div>
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 最近请假记录 -->
      <VCol cols="12" md="4">
        <VCard elevation="2">
          <VCardTitle class="px-4 py-3 d-flex align-center">
            <VIcon icon="mdi-calendar-clock" color="warning" class="me-2"/>
            最近请假
          </VCardTitle>
          <VDivider/>
          <VCardText>
            <VList>
              <VListItem
                v-for="leave in recentLeaves"
                :key="leave.name"
                :title="leave.name"
                :subtitle="`${leave.type} (${leave.startDate} ~ ${leave.endDate})`"
              >
                <template #append>
                  <VChip
                    :color="leave.status === '已通过' ? 'success' : 'warning'"
                    size="small"
                    variant="tonal"
                  >
                    {{ leave.status }}
                  </VChip>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped lang="scss">
.dashboard {
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

  .ranking-list {
    padding: 1rem 0;
  }

  .ranking-item {
    position: relative;
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 12px;
    background: rgba(var(--v-theme-surface-variant), 0.4);
    transition: all 0.3s ease;
    border: 1px solid transparent;

    &:hover {
      transform: translateY(-2px);
      background: rgba(var(--v-theme-surface-variant), 0.6);
      border-color: rgba(var(--v-theme-primary), 0.3);
      box-shadow: 0 4px 12px rgba(var(--v-theme-on-surface), 0.08);
    }

    &.rank-1 {
      background: linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
      border: 1px solid rgba(255, 215, 0, 0.3);
    }

    &.rank-2 {
      background: linear-gradient(45deg, rgba(192, 192, 192, 0.1), rgba(169, 169, 169, 0.1));
      border: 1px solid rgba(192, 192, 192, 0.3);
    }

    &.rank-3 {
      background: linear-gradient(45deg, rgba(205, 127, 50, 0.1), rgba(139, 69, 19, 0.1));
      border: 1px solid rgba(205, 127, 50, 0.3);
    }
  }

  .rank-medal {
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &.rank-1 {
      background: linear-gradient(45deg, #FFD700, #FFA500);
    }

    &.rank-2 {
      background: linear-gradient(45deg, #C0C0C0, #A9A9A9);
    }

    &.rank-3 {
      background: linear-gradient(45deg, #CD7F32, #8B4513);
    }

    &:not(.rank-1):not(.rank-2):not(.rank-3) {
      background: rgba(var(--v-theme-primary), 0.8);
    }
  }

  .ranking-avatar {
    border: 2px solid transparent;

    &.rank-1 {
      border-color: #FFD700;
    }

    &.rank-2 {
      border-color: #C0C0C0;
    }

    &.rank-3 {
      border-color: #CD7F32;
    }
  }
}
</style>
