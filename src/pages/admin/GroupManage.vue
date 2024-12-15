<script setup>
import { addProjectGroup, deleteProjectGroup, getProjectGroupList, updateProjectGroup } from "@/api/projectGroup"
import { options, snackbar } from "@/utils/ty"
import AddDialog from "@/views/AddDialog.vue"
import DetectDialog from "@/views/DetectDialog.vue"
import EditDiaLog from "@/views/EditDiaLog.vue"
import TableHead from "@/views/TableHead.vue"
import { onMounted, ref } from 'vue'

// 表头
const groupTableHeaders = ref([
  { title: '项目组编号', key: 'id', sortable: true },
  { title: '项目组名称', key: 'name', sortable: true },
  { title: '项目组介绍', key: 'description' },
  { title: '创建时间', key: 'createdAt', sortable: true },
  { title: '操作', key: 'actions' },
])

// 搜索和筛选
const searchValue = ref('')
const groupData = ref([])
const groupList = ref([])

// 搜索功能
const search = value => {
  searchValue.value = value
  filterData()
}

// 筛选数据
const filterData = () => {
  if (searchValue.value) {
    groupList.value = groupData.value.filter(item => 
      item.name.includes(searchValue.value),
    )
  } else {
    groupList.value = groupData.value
  }
}

// 获取项目组列表
const getGroups = async () => {
  try {
    const res = await getProjectGroupList()
    if (res.code === 1) {
      groupData.value = res.data.map(item => ({
        ...item,
        createdAt: item.createdAt?.split('T')[0] || '-',
        description: item.description || '-',
      }))
      groupList.value = groupData.value
    }
  } catch (error) {
    console.error('获取项目组列表失败:', error)
    snackbar.value = {
      show: true,
      text: '获取项目组列表失败',
      color: 'error',
    }
  }
}

// 新增项目组
const newGroup = ref({
  name: '',
  description: '',
})

// 添加项目组
const handleAdd = async () => {
  if (!newGroup.value.name?.trim()) {
    snackbar.value = {
      show: true,
      text: '请输入项目组名称',
      color: 'warning',
    }
    
    return
  }

  try {
    const res = await addProjectGroup({
      name: newGroup.value.name.trim(),
      description: newGroup.value.description?.trim(),
    })

    if (res.code === 1) {
      snackbar.value = {
        show: true,
        text: '添加成功',
        color: 'success',
      }
      getGroups()

      // 重置表单
      newGroup.value = {
        name: '',
        description: '',
      }
    }
  } catch (error) {
    console.error('添加项目组失败:', error)
    snackbar.value = {
      show: true,
      text: '添加失败',
      color: 'error',
    }
  }
}

// 编辑项目组
const editGroup = ref({
  id: '',
  name: '',
  description: '',
})

// 打开编辑对话框
const openEdit = item => {
  editGroup.value = { ...item }
}

// 提交编辑
const handleEdit = async () => {
  if (!editGroup.value.name?.trim()) {
    snackbar.value = {
      show: true,
      text: '请输入项目组名称',
      color: 'warning',
    }
    
    return
  }

  try {
    const res = await updateProjectGroup({
      id: editGroup.value.id,
      name: editGroup.value.name.trim(),
      description: editGroup.value.description?.trim(),
    })

    if (res.code === 1) {
      snackbar.value = {
        show: true,
        text: '修改成功',
        color: 'success',
      }
      getGroups()
    }
  } catch (error) {
    console.error('修改项目组失败:', error)
    snackbar.value = {
      show: true,
      text: '修改失败',
      color: 'error',
    }
  }
}

// 删除项目组
const handleDelete = async item => {
  try {
    const res = await deleteProjectGroup(item.id)
    if (res.code === 1) {
      snackbar.value = {
        show: true,
        text: '删除成功',
        color: 'success',
      }
      getGroups()
    }
  } catch (error) {
    console.error('删除项目组失败:', error)
    snackbar.value = {
      show: true,
      text: '删除失败',
      color: 'error',
    }
  }
}

onMounted(() => {
  getGroups()
})
</script>

<template>
  <VCard>
    <TableHead @search="search">
      <template #one>
        <AddDialog @add="handleAdd">
          <template #content>
            <VCol cols="12">
              <VTextField
                v-model="newGroup.name"
                label="项目组名称"
                :rules="[v => !!v || '请输入项目组名称']"
                required
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="newGroup.description"
                label="项目组介绍"
                rows="3"
              />
            </VCol>
          </template>
        </AddDialog>
      </template>
    </TableHead>

    <VDataTable
      :headers="groupTableHeaders"
      :items="groupList"
      :items-per-page="options.itemsPerPage"
      :page="options.page"
      hover
    >
      <template #item.actions="{ item }">
        <div class="d-flex align-center">
          <EditDiaLog
            @edit="handleEdit"
            @update="openEdit(item)"
          >
            <VTooltip
              activator="parent"
              location="top"
            >
              编辑信息
            </VTooltip>
            <template #content>
              <VCol cols="12">
                <VTextField
                  v-model="editGroup.name"
                  label="项目组名称"
                  :rules="[v => !!v || '请输入项目组名称']"
                  required
                />
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="editGroup.description"
                  label="项目组介绍"
                  rows="3"
                />
              </VCol>
            </template>
          </EditDiaLog>

          <DetectDialog @delete="handleDelete(item)">
            <VTooltip
              activator="parent"
              location="top"
            >
              删除项目组
            </VTooltip>
          </DetectDialog>
        </div>
      </template>

      <template #bottom>
        <VDivider />
        <div class="d-flex align-center justify-space-between pa-4">
          <div class="text-caption">
            共 {{ groupList.length }} 条记录
          </div>
          <VPagination
            v-model="options.page"
            :total-visible="$vuetify.display.smAndDown ? 2 : 3"
            :length="Math.ceil(groupList.length / options.itemsPerPage)"
            rounded="circle"
          />
        </div>
      </template>
    </VDataTable>
  </VCard>
</template>

<style scoped lang="scss">

</style>
