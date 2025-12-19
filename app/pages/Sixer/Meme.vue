<template>
  <v-container>
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="6" class="d-flex align-center">
        <v-text-field
          v-model="searchQuery"
          label="搜尋梗圖關鍵字..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          class="mr-4"
        ></v-text-field>
        <v-btn
          color="primary"
          prepend-icon="mdi-upload"
          @click="uploadDialog = true"
        >
          上傳梗圖
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="!isLoading" class="px-15">
      <v-col
        v-for="(meme, index) in filteredMemes"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="py-4"
      >
        <v-menu
          open-on-hover
          :open-delay="200"
          location="top center"
          offset="15"
          transition="scale-transition"
        >
          <template v-slot:activator="{ props: menuProps }">
            <div
              v-bind="menuProps"
              class="cursor-pointer transition-card"
              @click="copyImageToClipboard(meme)"
            >
              <MemeCard
                :title="meme.title"
                :image-url="ensureHttps(meme.url)"
                @copy="copyImageToClipboard"
              />
            </div>
          </template>

          <v-card
            width="300"
            elevation="24"
            class="rounded-xl overflow-hidden border"
          >
            <v-img
              :src="ensureHttps(meme.url)"
              max-height="400"
              contain
              class="bg-grey-darken-4"
            ></v-img>
            <v-card-text class="bg-surface text-center py-2 font-weight-bold">
              {{ meme.title }}
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>

      <v-col
        cols="12"
        v-if="filteredMemes.length === 0"
        class="text-center py-12"
      >
        <v-icon size="64" color="grey-lighten-1"
          >mdi-image-search-outline</v-icon
        >
        <p class="text-grey mt-2">找不到相關梗圖，換個關鍵字試試？</p>
      </v-col>
    </v-row>

    <v-row v-else justify="center">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <p class="mt-4">梗圖載入中...</p>
      </v-col>
    </v-row>

    <v-dialog v-model="uploadDialog" max-width="450px" persistent>
      <v-card>
        <v-card-title class="bg-primary text-white">上傳新梗圖</v-card-title>
        <v-card-text class="pt-8 px-6">
          <v-text-field
            v-model="newTitle"
            label="梗圖描述與關鍵字"
            variant="outlined"
            placeholder="例如：熊貓驚訝 表情包 嚇死我了"
            hint="輸入愈詳細，之後搜尋愈容易找到喔！"
            persistent-hint
            class="mb-10"
          ></v-text-field>
          <v-file-input
            v-model="selectedFile"
            label="選擇圖片檔案"
            accept="image/*"
            variant="outlined"
            prepend-icon="mdi-camera"
            :show-size="1024"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="closeUploadDialog"
            :disabled="isUploading"
            >取消</v-btn
          >
          <v-btn
            color="primary"
            variant="elevated"
            :loading="isUploading"
            @click="handleUpload"
            >確認上傳</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      location="bottom right"
      timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, mergeProps } from "vue";

// 設定 Layout
definePageMeta({ layout: "layout1" });

// 取得注入的 Axios 實例
const { $curridataAPI } = useNuxtApp();

// --- 狀態定義 ---
interface Meme {
  title: string;
  url: string;
}

const memes = ref<Meme[]>([]);
const searchQuery = ref("");
const isLoading = ref(true);
const uploadDialog = ref(false);
const isUploading = ref(false);

// 表單欄位
const newTitle = ref("");
const selectedFile = ref<File | File[] | null>(null);

// Snackbar 狀態
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

// --- API 請求邏輯 ---

async function fetchMemes() {
  isLoading.value = true;
  try {
    const response = await ($curridataAPI as any).get("/api/memes");
    memes.value = response.data;
  } catch (error) {
    console.error("無法取得梗圖列表:", error);
    showToast("❌ 無法連線至伺服器", "error");
  } finally {
    isLoading.value = false;
  }
}

async function handleUpload() {
  if (!selectedFile.value || !newTitle.value) {
    showToast("請輸入名稱並選擇圖片", "warning");
    return;
  }

  isUploading.value = true;
  const formData = new FormData();
  const file = Array.isArray(selectedFile.value)
    ? selectedFile.value[0]
    : selectedFile.value;
  formData.append("file", file as Blob);
  formData.append("title", newTitle.value);

  try {
    await ($curridataAPI as any).post("/api/upload-meme", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    showToast("✅ 梗圖上傳成功！", "success");
    closeUploadDialog();
    await fetchMemes();
  } catch (error) {
    showToast("❌ 上傳失敗", "error");
  } finally {
    isUploading.value = false;
  }
}

// --- 功能邏輯 ---

const filteredMemes = computed(() => {
  if (!searchQuery.value) return memes.value;
  const keywords = searchQuery.value.toLowerCase().trim().split(/\s+/);
  return memes.value.filter((meme) => {
    const title = meme.title.toLowerCase();
    return keywords.every((key) => title.includes(key));
  });
});

async function copyImageToClipboard({ url, title }: Meme) {
  try {
    const finalUrl = url.replace("http://", "https://") + `?t=${Date.now()}`;
    const response = await fetch(finalUrl, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    if (!response.ok) throw new Error(`HTTP 錯誤: ${response.status}`);
    const blob = await response.blob();

    const img = new Image();
    img.crossOrigin = "anonymous";
    const objectUrl = URL.createObjectURL(blob);
    img.src = objectUrl;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Canvas 渲染失敗"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d")?.drawImage(img, 0, 0);

    canvas.toBlob(async (pngBlob) => {
      if (!pngBlob) return;
      try {
        const item = new ClipboardItem({ "image/png": pngBlob });
        await navigator.clipboard.write([item]);
        showToast(`✅ 已複製 「${title}」`, "success");
      } catch (err) {
        showToast("❌ 寫入剪貼簿失敗", "error");
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    }, "image/png");
  } catch (err) {
    showToast("❌ 複製失敗", "error");
  }
}

function closeUploadDialog() {
  uploadDialog.value = false;
  newTitle.value = "";
  selectedFile.value = null;
}

function showToast(text: string, color: string = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
}

function ensureHttps(url: string) {
  if (!url) return "";
  return url.replace("http://", "https://");
}

onMounted(() => {
  fetchMemes();
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.transition-card {
  width: 300px; /* 強制固定寬度，你可以改成你要的數值 (例如 200px) */
  /* height: 320px; 強制固定高度 */
  margin: 0 auto;
  transition: transform 0.2s ease-in-out;
}
.transition-card:hover {
  transform: translateY(-5px);
}
</style>
