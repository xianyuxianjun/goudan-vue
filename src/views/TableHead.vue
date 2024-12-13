<script setup>
import { defineEmits } from 'vue';

const searchValue = ref('')
// 定义事件
const emit = defineEmits(['search']);

// 搜索函数，触发父组件的搜索行为
function handleSearch() {
  emit('search', searchValue.value);
}
</script>

<template>
  <VCardText>
    <VRow class="mb-4">
      <VCol cols="12" md="2">
        <VTextField
          v-model="searchValue"
          label="搜索"
          placeholder="搜索"
          prepend-inner-icon="ri-search-line"
          @keyup.enter="handleSearch"
        ></VTextField>
      </VCol>
      <VCol cols="12" md="2">
        <slot name="one"></slot>
      </VCol>
      <VCol cols="12" md="2">
        <slot name="two"></slot>
      </VCol>
      <VCol cols="12" md="2">
        <slot name="three"></slot>
      </VCol>
      <VCol cols="12" md="2">
        <slot name="four"></slot>
      </VCol>
      <VCol cols="12" md="2">
        <slot name="five"></slot>
      </VCol>
    </VRow>
  </VCardText>
</template>

<style scoped lang="scss">

</style>
