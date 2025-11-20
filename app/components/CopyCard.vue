<template>
  <v-card
    class="mx-auto cursor-pointer"
    max-width="400"
    :title="title"
    :subtitle="subtitle"
    @click="$emit('copy', subtitle)"
  >
  </v-card>
</template>

<script setup>
// 定義組件接收的屬性 (Props)
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
});

// 定義組件可以發射的事件
const emit = defineEmits(["copy"]);
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
