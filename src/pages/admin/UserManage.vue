<script setup>

import TableHead from "@/views/TableHead.vue";

//搜索框的值
const searchValue = ref('')

//搜索
function search(value){
  searchValue.value = value
}
</script>

<template>
  <VCard>
    <TableHead @search="search">
      <template #one>
        <VTextField label="名称"></VTextField>
      </template>
    </TableHead>
  </VCard>
</template>

<style scoped lang="scss">

</style>
