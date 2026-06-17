<template>
  <div class="d-flex justify-center">
    <div>
      <h1>生日轉民國碼</h1>
      <div class="d-flex">
        <v-card class="my-2 my-card-wrapper" variant="tonal" color="teal">
          <v-card-item>
            <v-card-title>使用教學</v-card-title>
            <v-card-subtitle
              >輸入限制：中文日期格式 (如：89年06月22日)</v-card-subtitle
            >
          </v-card-item>
          <v-card-text>
            <ul>
              <li>
                在左輸入框貼上從 Excel 複製的生日字串
                (每行一個)，右邊輸入框會自動產出 7 碼民國碼。
              </li>
              <li>結果可將複製貼回 Excel 中使用。</li>
            </ul>
            <v-divider class="my-3"></v-divider>
            <p><strong>轉換規則說明：</strong></p>
            <ul>
              <li>
                將「XX年XX月XX日」統一轉換為「3碼年份 + 2碼月份 + 2碼日期」
              </li>
              <li>年份若不足 3 碼（如 89），會自動在前方補 0 變為 089</li>
              <li>格式不符或空行會自動顯示「格式錯誤」或跳過</li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="teal-lighten-3 text-white"
              variant="elevated"
              @click="copySampleToClipboard"
            >
              點我複製範例
              <v-icon icon="mdi-content-copy" end></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <v-container id="mpage" class="px-0 pt-4">
        <v-row no-gutters class="align-center">
          <v-col cols="auto">
            <v-textarea
              ref="inputRef"
              v-model="inputText"
              class="resizable-textarea text-right"
              label="輸入生日 (每行一個)"
              @paste="handlePaste"
            ></v-textarea>
          </v-col>
          <v-col cols="auto" class="px-2 pb-5">
            <div class="d-flex flex-column ga-5">
              <v-btn
                color="green-lighten-3 text-grey-darken-4"
                @click="copyToClipboard"
              >
                Copy
                <v-icon icon="mdi-content-copy" end></v-icon>
              </v-btn>
              <v-btn
                color="blue-lighten-3 text-grey-darken-4"
                @click="clearTextareas"
              >
                Clear
                <v-icon icon="mdi-close-circle-outline" end></v-icon>
              </v-btn>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-textarea
              ref="outputRef"
              v-model="outputText"
              class="resizable-textarea"
              label="輸出民國碼"
              readonly
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>

      <v-snackbar
        v-model="snackbar"
        :timeout="2000"
        color="success"
        location="bottom right"
      >
        已複製到剪貼簿
      </v-snackbar>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// 適合生日格式的範例字串
const sampleContent = "89年06月22日\n88年11月06日\n103年1月2日\n5年5月20日";

// 套用 layout
definePageMeta({
  layout: "layout1",
});

// --- 狀態變數 ---
const inputText = ref("");
const outputText = ref("");
const inputRef = ref(null);
const outputRef = ref(null);
const snackbar = ref(false);

// --- 轉換邏輯 ---
const convertBirthToFormat = (birthStr) => {
  if (!birthStr || typeof birthStr !== "string") {
    return "格式錯誤";
  }

  // 移除非必要的空格
  const cleanStr = birthStr.trim();

  // 使用正則表達式匹配「X年X月X日」的數字
  // 支援 1~3 碼年、1~2 碼月、1~2 碼日
  const regex = /^(\d{1,3})年(\d{1,2})月(\d{1,2})日$/;
  const match = cleanStr.match(regex);

  if (match) {
    const year = match[1];
    const month = match[2];
    const day = match[3];

    // 格式化補零：年補滿 3 碼，月、日補滿 2 碼
    const paddedYear = year.padStart(3, "0");
    const paddedMonth = month.padStart(2, "0");
    const paddedDay = day.padStart(2, "0");

    return `${paddedYear}${paddedMonth}${paddedDay}`;
  }

  return "格式錯誤";
};

const convertedText = computed(() => {
  if (!inputText.value) {
    return "";
  }

  // 將輸入內容按換行符號分割，並保留空行對應（避免使用者 Excel 欄位對不起來）
  const lines = inputText.value.split("\n");

  const results = lines.map((line) => {
    // 如果是完全空的一行，就回傳空字串，保持 Excel 對齊
    if (line.trim().length === 0) return "";
    return convertBirthToFormat(line);
  });

  return results.join("\n");
});

watch(convertedText, (newValue) => {
  outputText.value = newValue;
});

// --- 處理貼上事件的函式 ---
const handlePaste = (event) => {
  event.preventDefault();
  const pasteData = event.clipboardData.getData("text");
  // 移除最前後的空白，但保留中間的換行
  inputText.value = pasteData.trim();
};

// --- 清空函式 ---
const clearTextareas = () => {
  inputText.value = "";
  outputText.value = "";
};

// --- 複製到剪貼簿函式 (輸出結果) ---
const copyToClipboard = async () => {
  try {
    if (!navigator.clipboard) {
      alert("你的瀏覽器不支援剪貼簿功能，請手動複製。");
      return;
    }
    await navigator.clipboard.writeText(outputText.value);
    snackbar.value = true;
  } catch (err) {
    console.error("複製失敗:", err);
    alert("複製失敗，請手動複製。");
  }
};

// --- 複製到剪貼簿函式 (範例內容) ---
const copySampleToClipboard = async () => {
  try {
    if (!navigator.clipboard) {
      alert("你的瀏覽器不支援剪貼簿功能，請手動複製。");
      return;
    }
    await navigator.clipboard.writeText(sampleContent);
    snackbar.value = true;
  } catch (err) {
    console.error("複製失敗:", err);
    alert("複製失敗，請手動複製。");
  }
};
</script>

<style scoped>
li {
  margin-left: 20px;
}
.v-textarea.resizable-textarea :deep(.v-field) {
  flex: 0 1 auto;
}
.v-textarea.resizable-textarea :deep(textarea) {
  width: 250px !important;
  height: 350px !important;
  min-width: 200px;
  min-height: 200px;
}
.v-textarea.resizable-textarea.text-right :deep(textarea) {
  text-align: right;
}
</style>
