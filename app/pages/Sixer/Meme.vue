<template>
  <v-container>
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="搜尋梗圖關鍵字..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="(meme, index) in filteredMemes"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MemeCard
          :title="meme.title"
          :image-url="meme.url"
          @copy="copyImageToClipboard"
        />
      </v-col>

      <v-col cols="12" v-if="filteredMemes.length === 0" class="text-center">
        <v-icon size="64" color="grey-lighten-1"
          >mdi-image-search-outline</v-icon
        >
        <p class="text-grey">找不到相關的梗圖...</p>
      </v-col>
    </v-row>
  </v-container>

  <v-snackbar v-model="snackbar" :timeout="2000" :color="snackbarColor">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({ layout: "layout1" });

// 1. 原始資料
const memes = ref([
  { title: "霹靂卡霹靂拉拉，就你在那GG88", url: "/memes/doremig8.png" },
  { title: "大笑狗狗", url: "/memes/laughing_dogs.png" },
  { title: "發抖海豹", url: "/memes/trembling_seal.png" },
  { title: "熊貓蝦", url: "/memes/panda_shrimp.png" },
  { title: "洗勒烤", url: "/memes/whining.png" },
]);

// 2. 搜尋狀態
const searchQuery = ref("");

// 3. 核心搜尋邏輯：即時過濾
const filteredMemes = computed(() => {
  if (!searchQuery.value) return memes.value;
  const q = searchQuery.value.toLowerCase();
  return memes.value.filter((m) => m.title.toLowerCase().includes(q));
});

// 4. 複製圖片邏輯
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

async function copyImageToClipboard({ url, title }) {
  try {
    // 步驟 A: 將圖片下載為 Blob
    const response = await fetch(url);
    const blob = await response.blob();

    // 步驟 B: 檢查瀏覽器是否支援 ClipboardItem (主要是 Chrome/Edge/Safari)
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error("瀏覽器不支援圖片複製");
    }

    // 步驟 C: 寫入剪貼簿
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);

    snackbarText.value = `✅ 「${title}」已複製到剪貼簿！`;
    snackbarColor.value = "success";
    snackbar.value = true;
  } catch (err) {
    console.error(err);
    snackbarText.value = "❌ 複製失敗，部分瀏覽器限制圖片跨域複製。";
    snackbarColor.value = "error";
    snackbar.value = true;
  }
}
</script>
