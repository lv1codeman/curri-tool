<template>
  <v-card
    hover
    class="mx-auto cursor-pointer h-100"
    @click="$emit('copy', { url: imageUrl, title: title })"
  >
    <v-img :src="imageUrl" height="200px" cover class="align-end">
      <v-card-title class="text-white bg-black-alpha-50">{{
        title
      }}</v-card-title>
    </v-img>
  </v-card>
</template>

<script setup>
defineProps({
  title: String,
  imageUrl: String,
});
defineEmits(["copy"]);
</script>

<style scoped>
.bg-black-alpha-50 {
  background: rgba(0, 0, 0, 0.5);
}
</style>
