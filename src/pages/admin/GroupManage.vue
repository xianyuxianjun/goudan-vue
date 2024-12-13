<script setup>
import { addProjectGroup, deleteProjectGroup, getProjectGroupList, updateProjectGroup } from "@/api/projectGroup.js";
import { options, snackbar } from "@/utils/ty.js";
import AddDialog from "@/views/AddDialog.vue";
import DetectDialog from "@/views/DetectDialog.vue";
import EditDiaLog from "@/views/EditDiaLog.vue";
import TableHead from "@/views/TableHead.vue";

//表头
const groupTableHeaders = ref([
  {title: '项目组编号', key: 'id'},
  {title: '项目组名称', key: 'name'},
  {title: '项目组介绍', key: 'description'},
  {title: '操作', key: 'operation'},
])
//搜索框的值
const searchValue = ref('')

//搜索
function search(value) {
  searchValue.value = value
  groupList.value = groupData.value.filter(item => item.name === value || item.name.includes(value))
}

//后端获取的项目组数据
const groupData = ref([])
//展示的项目组数据
const groupList = ref([])
//编辑的项目组
const editGroup = ref({
  id: '',
  name: '',
  description: '',
})

//打开编辑对话框
function editItem(item) {
  editGroup.value = { ...item }
}

//新增的项目组
const newGroup = ref({})

//添加项目组
function tianjia() {
  addProjectGroup(newGroup.value).then(res => {
    isSuccess(res)
    getGroupList()
  })
}

//获取后端数据
function getGroupList() {
  getProjectGroupList().then(res => {
    groupData.value = res.data
    groupList.value = groupData.value
  })
}

//删除项目组
function shanchu(item) {
  deleteProjectGroup(item.id).then(res => {
    isSuccess(res)
    getGroupList()
  })
}

//修改项目组
function edit() {
  updateProjectGroup(editGroup.value).then(res => {
    isSuccess(res)
    getGroupList()
  })
}


onMounted(() => {
  getGroupList()
})

</script>

<template>
  <VCard>
    <TableHead @search="search">
      <template #one>
        <AddDialog @add="tianjia">
          <template #content>
            <VCol
              cols="12"
              sm="6"
              md="12"
            >
              <VTextField
                label="项目组名称"
                v-model="newGroup.name"
              />
            </VCol>
            <VCol
              cols="12"

            >
              <VTextarea label="项目介绍" v-model="newGroup.description"/>
            </VCol>
          </template>
        </AddDialog>
      </template>
    </TableHead>
    <VDataTable :headers="groupTableHeaders"
                :items="groupList"
                :items-per-page="options.itemsPerPage"
                :page="options.page"
                :options="options">
      <template #item.operation="{ item }">
        <div class="d-flex align-center">
          <div class="me-2">
            <EditDiaLog 
              @edit="edit" 
              @update="editItem(item)"
            >
              <VTooltip activator="parent" location="top">编辑信息</VTooltip>
              <template #content>
                <VCol cols="12">
                  <VTextField
                    label="项目名称"
                    v-model="editGroup.name"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextarea 
                    label="项目介绍" 
                    v-model="editGroup.description"
                  />
                </VCol>
              </template>
            </EditDiaLog>
          </div>
          <div class="me-2">
            <DetectDialog @delete="shanchu(item)">
              <VTooltip activator="parent" location="top">删除项目组</VTooltip>
            </DetectDialog>
          </div>
        </div>
      </template>
      <template #bottom>
        <VPagination
          v-model="options.page"
          :total-visible="$vuetify.display.smAndDown ? 2 : 3"
          :length="Math.ceil(groupList.length / options.itemsPerPage)"
        />
      </template>
    </VDataTable>
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
</template>

<style scoped lang="scss">

</style>
