<script setup>
import {defineEmits} from "vue";

const emit = defineEmits(['add']);
const addDialogVisible = ref(false)

function edit(){
  emit('add')
  addDialogVisible.value = false
}
</script>

<template>
  <VDialog
    v-model="addDialogVisible"
    max-width="600"
  >
    <template #activator>
      <VBtn @click="addDialogVisible = true">添加</VBtn>
    </template>
    <!-- Dialog Content -->
    <VCard title="添加">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="addDialogVisible = false"
      />

      <VCardText>
        <VRow>
          <slot name="content">

          </slot>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn
          color="error"
          @click="addDialogVisible = false"
        >
          取消
        </VBtn>
        <VBtn
          color="success"
          @click="edit"
        >
          添加
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">

</style>
