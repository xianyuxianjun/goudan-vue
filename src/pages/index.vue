<script setup>
import { getCheckInRanking, getDashboardStats, getRecentLeaves } from '@/api/dashboard';
import { onMounted, ref, watch } from 'vue';

// 统计数据
const stats = ref({
  projects: {
    total: 0,
    active: 0,
    completed: 0,
    members: 0,
  },
  attendance: {
    present: 0,
    late: 0,
    absent: 0,
    onLeave: 0,
  },
})

// 活动标签页
const activeTab = ref('today')
const todayRanking = ref([])
const monthlyRanking = ref([])
const recentLeaves = ref([])

// 获取统计数据
const fetchStats = async () => {
  try {
    const res = await getDashboardStats()
    if (res.code === 1) {
      stats.value = res.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取排行榜数据
const fetchRanking = async () => {
  try {
    const res = await getCheckInRanking(activeTab.value)
    if (res.code === 1) {
      if (activeTab.value === 'today') {
        todayRanking.value = res.data
      } else {
        monthlyRanking.value = res.data
      }
    }
  } catch (error) {
    console.error('获取排行榜数据失败:', error)
  }
}

// 获取请假记录
const fetchRecentLeaves = async () => {
  try {
    const res = await getRecentLeaves()
    if (res.code === 1) {
      recentLeaves.value = res.data
    }
  } catch (error) {
    console.error('获取请假记录失败:', error)
  }
}

// 监听标签页变化
watch(activeTab, () => {
  fetchRanking()
})

// 页面加载时获取数据
onMounted(() => {
  fetchStats()
  fetchRanking()
  fetchRecentLeaves()
})
</script>

<template>
  <VContainer
    fluid
    class="dashboard"
  >
    <!-- 统计卡片行 -->
    <VRow>
      <!-- 项目统计 -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard
          class="stat-card"
          elevation="2"
        >
          <VCardItem>
            <VCardTitle class="text-primary">
              总项目数
            </VCardTitle>
            <template #append>
              <VIcon
                icon="ri-folder-multiple-line"
                size="32"
                color="primary"
              />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">
              {{ stats.projects.total }}
            </div>
            <div class="d-flex align-center justify-space-between mt-2">
              <span class="text-caption">进行中: {{ stats.projects.active }}</span>
              <span class="text-caption">已完成: {{ stats.projects.completed }}</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 成员统计 -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard
          class="stat-card"
          elevation="2"
        >
          <VCardItem>
            <VCardTitle class="text-success">
              总成员数
            </VCardTitle>
            <template #append>
              <VIcon
                icon="mdi-account-group"
                size="32"
                color="success"
              />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">
              {{ stats.projects.members }}
            </div>
            <div class="text-caption mt-2">
              活跃成员数
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 考勤统计 -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard
          class="stat-card"
          elevation="2"
        >
          <VCardItem>
            <VCardTitle class="text-info">
              今日出勤
            </VCardTitle>
            <template #append>
              <VIcon
                icon="mdi-calendar-check"
                size="32"
                color="info"
              />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">
              {{ stats.attendance.present }}
            </div>
            <div class="d-flex align-center justify-space-between mt-2">
              <span class="text-caption text-warning">迟到: {{ stats.attendance.late }}</span>
              <span class="text-caption text-error">缺勤: {{ stats.attendance.absent }}</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 请假统计 -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard
          class="stat-card"
          elevation="2"
        >
          <VCardItem>
            <VCardTitle class="text-warning">
              请假人数
            </VCardTitle>
            <template #append>
              <VIcon
                icon="mdi-account-clock"
                size="32"
                color="warning"
              />
            </template>
          </VCardItem>
          <VCardText>
            <div class="text-h4">
              {{ stats.attendance.onLeave }}
            </div>
            <div class="text-caption mt-2">
              当前请假人数
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 签到排行榜和请假记录 -->
    <VRow class="mt-6">
      <!-- 签到排行榜 -->
      <VCol
        cols="12"
        md="8"
      >
        <VCard elevation="2">
          <VCardTitle class="px-4 pt-3 pb-2">
            <VIcon
              icon="mdi-trophy"
              color="warning"
              size="28"
              class="me-2"
            />
            签到排行榜
          </VCardTitle>

          <VTabs
            v-model="activeTab"
            color="primary"
            grow
            class="px-4"
          >
            <VTab
              value="today"
              class="py-3"
            >
              <VIcon
                icon="mdi-clock-fast"
                class="me-2"
              />
              今日签到英雄榜
            </VTab>
            <VTab
              value="monthly"
              class="py-3"
            >
              <VIcon
                icon="mdi-calendar-check"
                class="me-2"
              />
              本月勤勉之星
            </VTab>
          </VTabs>

          <VDivider />

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
                    <div
                      class="rank-medal"
                      :class="`rank-${index + 1}`"
                    >
                      <VIcon
                        v-if="index < 3"
                        :icon="index === 0 ? 'mdi-crown' : 'mdi-medal'"
                        size="24"
                      />
                      <span v-else>{{ index + 1 }}</span>
                    </div>

                    <div class="d-flex align-center flex-grow-1">
                      <VAvatar
                        size="48"
                        class="me-3 ranking-avatar"
                        :class="`rank-${index + 1}`"
                      >
                        <VImg
                          v-if="item.avatar"
                          :src="item.avatar"
                        />
                        <span
                          v-else
                          class="text-h6"
                        >{{ item.name.charAt(0) }}</span>
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
                          <VDivider
                            vertical
                            class="mx-2"
                          />
                          <span>连续签到 {{ item.streak }} 天</span>
                        </div>
                      </div>

                      <div class="text-right">
                        <div class="text-h6 text-primary">
                          {{ item.checkInTime }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          签到时间
                        </div>
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
                    <div
                      class="rank-medal"
                      :class="`rank-${index + 1}`"
                    >
                      <VIcon
                        v-if="index < 3"
                        :icon="index === 0 ? 'mdi-crown' : 'mdi-medal'"
                        size="24"
                      />
                      <span v-else>{{ index + 1 }}</span>
                    </div>

                    <div class="d-flex align-center flex-grow-1">
                      <VAvatar
                        size="48"
                        class="me-3 ranking-avatar"
                        :class="`rank-${index + 1}`"
                      >
                        <VImg
                          v-if="item.avatar"
                          :src="item.avatar"
                        />
                        <span
                          v-else
                          class="text-h6"
                        >{{ item.name.charAt(0) }}</span>
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
                            {{ index === 0 ? '月度之' : index === 1 ? '优秀' : '表扬' }}
                          </VChip>
                        </div>
                        <div class="d-flex align-center text-caption text-medium-emphasis">
                          <span>{{ item.department }}</span>
                          <VDivider
                            vertical
                            class="mx-2"
                          />
                          <span>准时率 {{ item.onTimeRate }}</span>
                        </div>
                      </div>

                      <div class="text-right">
                        <div class="text-h6 text-success">
                          {{ item.checkInDays }}天
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          出勤天数
                        </div>
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
      <VCol
        cols="12"
        md="4"
      >
        <VCard elevation="2">
          <VCardTitle class="px-4 py-3 d-flex align-center">
            <VIcon
              icon="mdi-calendar-clock"
              color="warning"
              class="me-2"
            />
            最近请假
          </VCardTitle>
          <VDivider />
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
      margin-block: 8px;
      margin-inline: 0;
    }

    .text-caption {
      color: rgba(var(--v-theme-on-surface), 0.6);
    }
  }

  .ranking-list {
    padding-block: 1rem;
    padding-inline: 0;
  }

  .ranking-item {
    position: relative;
    padding: 1rem;
    border: 1px solid transparent;
    border-radius: 12px;
    background: rgba(var(--v-theme-surface-variant), 0.4);
    margin-block: 1rem;
    margin-inline: 0;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(var(--v-theme-primary), 0.3);
      background: rgba(var(--v-theme-surface-variant), 0.6);
      box-shadow: 0 4px 12px rgba(var(--v-theme-on-surface), 0.08);
      transform: translateY(-2px);
    }

    &.rank-1 {
      border: 1px solid rgba(255, 215, 0, 30%);
      background: linear-gradient(45deg, rgba(255, 215, 0, 10%), rgba(255, 165, 0, 10%));
    }

    &.rank-2 {
      border: 1px solid rgba(192, 192, 192, 30%);
      background: linear-gradient(45deg, rgba(192, 192, 192, 10%), rgba(169, 169, 169, 10%));
    }

    &.rank-3 {
      border: 1px solid rgba(205, 127, 50, 30%);
      background: linear-gradient(45deg, rgba(205, 127, 50, 10%), rgba(139, 69, 19, 10%));
    }
  }

  .rank-medal {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    block-size: 36px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 10%);
    color: white;
    font-weight: bold;
    inline-size: 36px;
    inset-block-start: 50%;
    inset-inline-start: -12px;
    transform: translateY(-50%);

    &.rank-1 {
      background: linear-gradient(45deg, #ffd700, #ffa500);
    }

    &.rank-2 {
      background: linear-gradient(45deg, #c0c0c0, #a9a9a9);
    }

    &.rank-3 {
      background: linear-gradient(45deg, #cd7f32, #8b4513);
    }

    &:not(.rank-1, .rank-2, .rank-3) {
      background: rgba(var(--v-theme-primary), 0.8);
    }
  }

  .ranking-avatar {
    border: 2px solid transparent;

    &.rank-1 {
      border-color: #ffd700;
    }

    &.rank-2 {
      border-color: #c0c0c0;
    }

    &.rank-3 {
      border-color: #cd7f32;
    }
  }
}
</style>
