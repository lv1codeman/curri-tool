<template>
  <v-app>
    <v-app-bar app>
      <NuxtLink to="/">
        <v-app-bar-title class="pl-4">課務輔助工具</v-app-bar-title>
      </NuxtLink>
    </v-app-bar>
    <v-navigation-drawer expand-on-hover permanent rail app>
      <v-list nav>
        <v-list-item
          title="回首頁"
          link
          to="/"
          prepend-icon="mdi-home-outline"
        ></v-list-item>
        <v-list-group value="database_maintenance">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-database-cog"
              title="資料庫維護"
            ></v-list-item>
          </template>
          <v-list-item
            title="系所表維護"
            link
            to="/DB/DBmaintain"
            prepend-icon="mdi-table-edit"
          ></v-list-item>
          <!-- <a href="/DB/DBmaintain" style="text-decoration: none">
            <v-list-item
              title="系所表維護"
              prepend-icon="mdi-table-edit"
              link
            ></v-list-item>
          </a> -->
          <!-- 應用 v-tooltip 來顯示完整標題 -->
          <v-tooltip text="班級-系所簡稱對照表維護" location="end">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                title="班級-系所簡稱對照表維護"
                link
                to="/DB/ClassDeptshort"
                prepend-icon="mdi-compare-horizontal"
              ></v-list-item>
            </template>
          </v-tooltip>
          <v-list-item
            title="課務承辦維護"
            link
            to="/DB/CurriAgent"
            prepend-icon="mdi-account-edit"
          ></v-list-item>
        </v-list-group>
        <v-list-group value="curriculum_tools">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-tools"
              title="課務工具"
            ></v-list-item>
          </template>
          <v-list-item
            title="班級轉換(114)"
            link
            to="/ClassConverter/ClassConverter114"
            prepend-icon="mdi-file-swap"
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main class="d-flex justify-center mt-2">
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// 這個版本不需要額外的 script 來控制展開狀態
</script>

<style scoped>
.v-app-bar a {
  text-decoration: none;
  color: inherit;
}
</style>
