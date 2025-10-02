<template>
  <div>
    <h1>班級轉換(113以前)</h1>

    <v-expansion-panels class="mt-4 w-50">
      <v-expansion-panel title="使用教學">
        <v-expansion-panel-text>
          <ul>
            <li>
              在左輸入框貼上從Excel複製的班級簡稱，右邊輸入框會自動產出結果。
            </li>
            <li>貼上後想看不同結果可選擇下拉選項</li>
            <li>可將結果複製貼回Excel中使用。</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- <h2 class="mt-2">使用教學</h2> -->

    <div class="conditional-area d-flex align-center">
      <v-select
        class="function-selector mt-4"
        :items="convert_types"
        label="功能選擇"
        :style="{ maxWidth: `${selectWidth}px` }"
        density="comfortable"
      ></v-select>
    </div>

    <v-container id="mpage" class="px-0">
      <v-row no-gutters class="align-center">
        <v-col cols="auto">
          <v-textarea
            class="resizable-textarea text-right"
            label="輸入框"
          ></v-textarea>
        </v-col>
        <v-col cols="auto" class="px-2 pb-5">
          <div class="d-flex flex-column ga-5">
            <v-btn color="green-lighten-3 text-grey-darken-4">
              Copy
              <v-icon icon="mdi-content-copy" end></v-icon>
            </v-btn>
            <v-btn color="blue-lighten-3 text-grey-darken-4">
              Clear
              <v-icon icon="mdi-close-circle-outline" end></v-icon>
            </v-btn>
          </div>
          <!-- <v-icon
            color="blue-darken-4"
            icon="mdi-arrow-right-bold-circle-outline"
            size="x-large"
          ></v-icon> -->
        </v-col>
        <v-col cols="auto">
          <v-textarea class="resizable-textarea" label="輸出框"></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "layout1",
});

import { ref } from "vue";
const convert_type = ref("");
const convert_types = [
  "系所簡稱",
  "系所全名",
  "學院簡稱",
  "學院全名",
  "系辦助理",
  "系辦助理分機",
  "系辦助理Email",
  "課務承辦人",
  "課務承辦人分機",
  "課務承辦人Email",
];

// 動態計算寬度
const selectWidth = computed(() => {
  // 找出最長的字串
  const longestString = convert_types.reduce(
    (a, b) => (a.length > b.length ? a : b),
    ""
  );
  // 估計每個字元所需的寬度，可以根據你的字體調整
  const characterWidth = 10;
  // 額外加上一些 padding
  const padding = 80;
  return longestString.length * characterWidth + padding;
});
</script>

<style scoped>
li {
  margin-left: 20px;
}
.conditional-area {
}
.v-textarea.resizable-textarea :deep(.v-field) {
  flex: 0 1 auto;
}

.v-textarea.resizable-textarea :deep(textarea) {
  resize: both;
}
.v-textarea.resizable-textarea.text-right :deep(textarea) {
  text-align: right;
}
</style>
