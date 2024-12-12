<script setup>
import {defineEmits} from "vue";

const emit = defineEmits(['delete']);
const deleteDialogVisible = ref(false)

function handleDelete() {
  emit('delete')
  deleteDialogVisible.value = false
}
</script>

<template>
  <VDialog
    v-model="deleteDialogVisible"
    persistent
    class="v-dialog-sm"
  >
    <template #activator>
      <IconBtn
        size="small"
        @click="deleteDialogVisible = true"
      >
        <VIcon icon="ri-delete-bin-line" />
      </IconBtn>
    </template>
    <!-- Dialog Content -->
    <VCard title="删除">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="deleteDialogVisible = false"
      />

      <VCardText>
        你确定要删除吗？
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn
          color="error"
          @click="deleteDialogVisible = false"
        >
          取消
        </VBtn>
        <VBtn
          color="success"
          @click="handleDelete"
        >
          确定
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">

</style>
