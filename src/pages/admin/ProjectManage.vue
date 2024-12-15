<script setup>
import { getProjectList } from '@/api/project';
import { snackbar } from "@/utils/ty";
import { onMounted, ref } from 'vue';

// 项目列表
const projectList = ref([])
const projectData = ref([])

// 获取项目列表
const getProjects = async () => {
  try {
    const res = await getProjectList()
    if (res.code === 1) {
      projectData.value = res.data.map(item => ({
        ...item,
        startDate: item.startDate?.split('T')[0] || '-',
        endDate: item.endDate?.split('T')[0] || '-',
      }))
      projectList.value = projectData.value
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
    snackbar.value = {
      show: true,
      text: '获取项目列表失败',
      color: 'error',
    }
  }
}

// ... 其他增删改查代码 ...

onMounted(() => {
  getProjects()
})
</script>

<template>
  <!-- 项目管理界面模板 -->
</template> 
