<template>
  <div class="card-grid-container">
    <div class="card-grid">
      <v-card
        class="card-item cursor-pointer"
        title="行事曆"
        subtitle="各學年度行事曆"
        :href="'https://acadaff.ncue.edu.tw/p/412-1002-2143.php?Lang=zh-tw'"
        target="_blank"
      >
      </v-card>
      <v-card
        class="card-item cursor-pointer"
        title="跨校修課優惠一覽表"
        subtitle="「臺灣國立大學系統」及「彰雲嘉大學校院聯盟」跨校修課優惠一覽表"
        :href="'https://acadaff.ncue.edu.tw/var/file/2/1002/img/786/691174704.pdf'"
        target="_blank"
      >
      </v-card>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "layout1",
});
</script>

<!-- https://acadaff.ncue.edu.tw/var/file/2/1002/img/786/691174704.pdf -->
<style scoped>
/* 1. 外層容器：設置最大寬度並置中 */
.card-grid-container {
  /* 將 max-width 更新為 1516px (1500 + 16) */
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 2. 內層 Flexbox 容器：控制間距和換行 */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 3. 確保卡片寬度為 500px，垂直間距保持不變 */
.card-item {
  width: 300px;
  flex-shrink: 1;
  margin-bottom: 20px; /* 垂直間距也建議同步改為 8px，以保持視覺一致 */
}

.cursor-pointer {
  cursor: pointer;
}
</style>
