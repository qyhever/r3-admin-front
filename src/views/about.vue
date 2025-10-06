<template>
  <div>
    <div class="grid grid-cols-3 2xl:grid-cols-4 gap-4">
      <div v-for="(item, index) in 5" :key="index" class="rounded-lg bg-fuchsia-500 p-4">
        {{ item }}
      </div>
      <div class="col-span-3 grid grid-cols-subgrid gap-4">
        <div class="col-start-2">06</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AboutView',
})
</script>

<style scoped></style>
