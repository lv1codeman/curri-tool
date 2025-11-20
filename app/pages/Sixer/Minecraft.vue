<template>
  <div class="card-grid-container">
    <div class="card-grid">
      <CopyCard
        title="要塞（Stronghold）"
        :subtitle="find_stronghold"
        @copy="copyCode($event)"
        class="card-item"
      />

      <CopyCard
        title="堡壘遺跡（Bastion Remnant）"
        :subtitle="find_bastion_remnant"
        @copy="copyCode($event)"
        class="card-item"
      />

      <CopyCard
        title="地獄堡壘（Nether Fortress）"
        :subtitle="find_fortress"
        @copy="copyCode($event)"
        class="card-item"
      />

      <CopyCard
        title="扭曲森林（Warped Forest)"
        :subtitle="find_warped_forest"
        @copy="copyCode($event)"
        class="card-item"
      />
    </div>
  </div>

  <v-snackbar
    v-model="snackbar"
    :timeout="3000"
    color="success"
    location="bottom right"
  >
    {{ snackbarText }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="snackbar = false">
        關閉
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref } from "vue";
import CopyCard from "@/components/CopyCard.vue"; // 確保路徑正確

// 忽略 Nuxt 相關 import (保持簡潔)
definePageMeta({
  layout: "layout1",
});

// 1. 響應式狀態 (指令變數)
const find_warped_forest = "/locate biome minecraft:warped_forest";
const find_stronghold = "/locate structure minecraft:stronghold";
const find_bastion_remnant = "/locate structure minecraft:bastion_remnant";
const find_fortress = "/locate structure minecraft:fortress";

// 2. 複製邏輯所需的本地狀態
const snackbar = ref(false);
const snackbarText = ref("");

// 3. 函數：處理複製和通知 (本地實現)
async function copyCode(codeToCopy) {
  try {
    // 核心複製邏輯
    await navigator.clipboard.writeText(codeToCopy);

    // 複製成功，更新本地 ref
    snackbarText.value = "✅ 指令已成功複製到剪貼簿！";
    snackbar.value = true;
  } catch (err) {
    console.error("無法複製文字:", err);
    snackbarText.value =
      "❌ 複製失敗：您的瀏覽器可能不支援自動複製功能。請手動複製。";
    snackbar.value = true;
  }
}
</script>

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
}

/* 3. 確保卡片寬度為 500px，垂直間距保持不變 */
.card-item {
  min-width: 350px;
  flex-shrink: 1;
  margin-bottom: 20px; /* 垂直間距也建議同步改為 8px，以保持視覺一致 */
}

.cursor-pointer {
  cursor: pointer;
}
</style>
