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

    <v-row v-if="!isLoading">
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
        <v-card-text class="pt-4">
          <v-text-field
            v-model="newTitle"
            label="梗圖描述與關鍵字"
            variant="outlined"
            placeholder="例如：熊貓驚訝 表情包 嚇死我了"
            hint="輸入愈詳細，之後搜尋愈容易找到喔！"
            persistent-hint
            class="mb-4"
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
import { ref, computed, onMounted } from "vue";

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

// 1. 取得梗圖清單 (整合 Axios)
async function fetchMemes() {
  isLoading.value = true;
  try {
    const response = await ($curridataAPI as any).get("/api/memes");
    memes.value = response.data;
  } catch (error) {
    console.error("無法取得梗圖列表:", error);
    showToast("❌ 無法連線至伺服器，請檢查後端是否啟動", "error");
  } finally {
    isLoading.value = false;
  }
}

// 2. 處理上傳 (整合 Axios + FormData)
async function handleUpload() {
  if (!selectedFile.value || !newTitle.value) {
    showToast("請輸入名稱並選擇圖片", "warning");
    return;
  }

  isUploading.value = true;
  const formData = new FormData();

  // 處理 Vuetify 可能產生的陣列格式
  const file = Array.isArray(selectedFile.value)
    ? selectedFile.value[0]
    : selectedFile.value;
  formData.append("file", file as Blob);
  formData.append("title", newTitle.value);

  try {
    // 🎯 呼叫 FastAPI 上傳 API
    await ($curridataAPI as any).post("/api/upload-meme", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    showToast("✅ 梗圖上傳成功！", "success");
    closeUploadDialog();
    await fetchMemes(); // 重新讀取清單
  } catch (error) {
    console.error("上傳失敗:", error);
    showToast("❌ 上傳失敗，請稍後再試", "error");
  } finally {
    isUploading.value = false;
  }
}

// --- 功能邏輯 ---

// 搜尋過濾
const filteredMemes = computed(() => {
  if (!searchQuery.value) return memes.value;

  // 將搜尋詞轉為小寫，並支援空白分割多關鍵字 (例如搜尋: "熊貓 驚訝")
  const keywords = searchQuery.value.toLowerCase().trim().split(/\s+/);

  return memes.value.filter((meme) => {
    const title = meme.title.toLowerCase();
    // 必須包含所有的關鍵字才顯示
    return keywords.every((key) => title.includes(key));
  });
});

// 複製圖片到剪貼簿 (用於直接在 Discord/Line 貼上)
async function copyImageToClipboard({ url, title }: Meme) {
  try {
    // 1. 強制確保 URL 使用 HTTPS 並加上時間戳破解快取
    const finalUrl = url.replace("http://", "https://") + `?t=${Date.now()}`;

    // 2. 使用 fetch 抓取 blob，這會直接測試 CORS
    const response = await fetch(finalUrl, {
      method: "GET",
      mode: "cors", // 🎯 強制開啟 CORS 模式
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) throw new Error(`HTTP 錯誤: ${response.status}`);
    const blob = await response.blob();

    // 3. 建立 Image 並畫入 Canvas (為了轉成 LINE 能用的 PNG)
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
        console.error("剪貼簿寫入錯誤:", err);
        showToast("❌ 寫入剪貼簿失敗", "error");
      } finally {
        URL.revokeObjectURL(objectUrl); // 釋放記憶體
      }
    }, "image/png");
  } catch (err) {
    console.error("複製完整錯誤細節:", err);
    showToast("❌ 權限不足或 Server 設定錯誤", "error");
  }
}

// 關閉對話框並重置
function closeUploadDialog() {
  uploadDialog.value = false;
  newTitle.value = "";
  selectedFile.value = null;
}

// 顯示提示
function showToast(text: string, color: string = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
}

// 生命週期
onMounted(() => {
  fetchMemes();
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
