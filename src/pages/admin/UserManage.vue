<script setup>
import avatar from "@/assets/images/avatars/avatar-1.png"
import TableHead from "@/views/TableHead.vue";
import {getUserList, detectUser, addUser, updateUser} from "@/api/user.js";
import {onMounted} from "vue"
import {getProjectKVList} from "@/api/projectGroup.js";
import AddDialog from "@/views/AddDialog.vue";
import EditDiaLog from "@/views/EditDiaLog.vue";
import DetectDialog from "@/views/DetectDialog.vue";


//搜索框的值
const searchValue = ref('')

//搜索
function search(value) {
  searchValue.value = value
  userList.value = userData.value.filter(item => item.name === value || item.name.includes(value))
}

//表头
const userTableHeader = ref([
  {title: '成员编号', key: 'userId'},
  {title: '姓名', key: 'name'},
  {title: '性别', key: 'sex'},
  {title: '年龄', key: 'age'},
  {title: '邮箱', key: 'email'},
  {title: '班级', key: 'className'},
  {title: '专业', key: 'major'},
  {title: '项目组', key: 'groupName'},
  {title: '状态', key: 'status'},
  {title: '操作', key: 'operation'},
])
//后端获取的数据
const userData = ref([])
//表格站式的数据
const userList = ref([{
  userId: 'S202209512245',
  name: '陈咸鱼',
  sex: '男',
  age: '19',
  email: '1796792003@qq.com',
  classesName: '22软件工程2班',
  major: '软件工程',
  post: '组长',
  status: '在岗',
  groupName: '一站式智慧管理系统',
}])
//后端获取的项目组列表
const groupList = ref([])
//编辑的用户
const editUser = ref([{
  userId: '',
  name: '',
  sex: '',
  age: '',
  className: '',
  email: '',
  major: '',
  post: '',
  status: '',
  groupName: '',
}])

//打开编辑对话框
function editItem(item) {
  editUser.value = item
}

//新增的用户
const newUser = ref({
  userId: '',
  name: '',
  sex: '',
  age: '',
  className: '',
  email: '',
  major: '',
  post: '',
  status: '',
  groupName: '',
})

//获取数据
function getData() {
  getUserList().then(res => {
    userData.value = res.data
    userList.value = userData.value
  })
}


//添加用户
function insterUser() {
  addUser(newUser.value).then(res => {
    console.log(res)
    getData()
    addDialogVisible.value = false
  })
}

//删除用户
function shanchu(item) {
  detectUser(item.userId).then(res => {
    isSuccess(res)
    getData()
    deleteDialogVisible.value = false
  })
}

//修改用户
function xiugai() {
  updateUser(editUser.value).then(res => {
    isSuccess(res)
    getData()
    editDialogVisible.value = false
  })
}

//获取项目组选择框数组
function getGroupKVList() {
  getProjectKVList().then(res => {
    groupList.value = res.data
    groupList.value.push({title: '全部', value: '1'})
  })
}

//筛选的值
const shaiValue = ref('')

//筛选
watch(shaiValue, value => {
  if (value === '1') {
    userList.value = userData.value
    return
  }
  userList.value = userData.value.filter(item => item.groupName === value)
})

onMounted(() => {
  getData()
  getGroupKVList()
})
</script>

<template>
  <VCard>
    <TableHead @search="search">
      <template #tow>
        <AddDialog @add="insterUser">
          <template #content>
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                label="名称"
                v-model="newUser.name"
              />
            </VCol>
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="newUser.age"
                label="年龄"
              />
            </VCol>
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VSelect v-model="newUser.sex" label="性别" :items="[{title:'男',value:'男'},{title:'女',value:'女'}]"/>
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="newUser.email"
                label="Email"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <VTextField
                v-model="newUser.className"
                label="班级"
              />
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <VTextField
                v-model="newUser.major"
                label="专业"
              />
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <VSelect label="职位" v-model="newUser.post"
                       :items="[{title:'组员',value:'组员'},{title:'老师',value:'老师'},{title:'主管',value:'主管'},{title:'组长',value:'组长'}]"/>

            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <VSelect v-model="newUser.status" label="状态"
                       :items="[{title:'在岗',value:'在岗'},{title:'离岗',value:'离岗'}]"/>
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <VSelect label="项目组" v-model="newUser.groupName" :items="groupList"/>
            </VCol>
          </template>
        </AddDialog>
      </template>
      <template #one>
        <VSelect label="筛选" :items="groupList" v-model="shaiValue"/>
      </template>
    </TableHead>
    <VCardText>
      <VDataTable
        :headers="userTableHeader"
        :items="userList"
        :items-per-page="options.itemsPerPage"
        :page="options.page"
        :options="options"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              size="34"
              class="me-3"
            >
              <VImg
                v-if="avatar"
                :src="toAvatar(item)"
              />
              <span v-else>{{ avatarText(item.name) }}</span>
            </VAvatar>

            <div class="d-flex flex-column">
              {{ item.name }}
              <span class="text-sm text-medium-emphasis">{{ item.post }}</span>
            </div>
          </div>
        </template>
        <template #item.status="{ item }">
          <VChip color="success">{{ item.status }}</VChip>
        </template>
        <template #item.operation="{ item }">
          <EditDiaLog @edit="xiugai" @click="editItem(item)">
            <template #content>
              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <VTextField
                  label="名称"
                  v-model="editUser.name"
                />
              </VCol>
              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <VTextField
                  v-model="editUser.age"
                  label="年龄"
                />
              </VCol>
              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <VSelect label="性别" :items="[{title:'男',value:'男'},{title:'女',value:'女'}]"/>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="editUser.email"
                  label="Email"
                />
              </VCol>

              <VCol
                cols="12"
                sm="6"
              >
                <VTextField
                  v-model="editUser.className"
                  label="班级"
                />
              </VCol>
              <VCol
                cols="12"
                sm="6"
              >
                <VTextField
                  v-model="editUser.major"
                  label="专业"
                />
              </VCol>
              <VCol
                cols="12"
                sm="6"
              >
                <VSelect label="职位" v-model="editUser.post"
                         :items="[{title:'组员',value:'组员'},{title:'老师',value:'老师'},{title:'主管',value:'主管'},{title:'组长',value:'组长'}]"/>
              </VCol>
              <VCol
                cols="12"
                sm="6"
              >
                <VSelect label="状态" v-model="editUser.status"
                         :items="[{title:'在岗',value:'在岗'},{title:'离岗',value:'离岗'}]"/>
              </VCol>
              <VCol
                cols="12"
                sm="6"
              >
                <VSelect label="项目组" v-model="editUser.groupName" :items="groupList"/>
              </VCol>
            </template>
          </EditDiaLog>
          <DetectDialog @delete="shanchu(item)"/>
        </template>
        <template #bottom>
          <VPagination
            v-model="options.page"
            :total-visible="$vuetify.display.smAndDown ? 2 : 3"
            :length="Math.ceil(userList.length / options.itemsPerPage)"
          />
        </template>
      </VDataTable>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
