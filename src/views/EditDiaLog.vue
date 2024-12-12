<script setup>
import {defineEmits} from "vue";

const emit = defineEmits(['edit']);
const editDialogVisible = ref(false)

function edit(){
  emit('edit')
  editDialogVisible.value = false
}
</script>

<template>
  <VDialog
    v-model="editDialogVisible"
    max-width="600"
  >
    <template #activator>
                <IconBtn
                  size="small"
                  @click="editDialogVisible=true"
                >
                  <VIcon icon="ri-pencil-line" />
                </IconBtn>
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
