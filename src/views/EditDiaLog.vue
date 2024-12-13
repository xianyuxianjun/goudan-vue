<script setup>
import { defineEmits, watch } from "vue";

const emit = defineEmits(['edit', 'update']);
const editDialogVisible = ref(false)

function edit(){
  emit('edit')
  editDialogVisible.value = false
}

watch(editDialogVisible, (newVal) => {
  if (newVal) {
    emit('update')
  }
})
</script>

<template>
  <VDialog
    v-model="editDialogVisible"
    max-width="600"
  >
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        icon
        size="small"
        color="primary"
        variant="text"
      >
        <VIcon size="20" icon="ri-edit-line"/>
        <slot></slot>
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard title="编辑">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="editDialogVisible = false"
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
          @click="editDialogVisible = false"
        >
          取消
        </VBtn>
        <VBtn
          color="success"
          @click="edit"
        >
          修改
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">

</style>
