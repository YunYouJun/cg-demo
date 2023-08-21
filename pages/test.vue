<script lang="ts" setup>
const msg = ref({
  a: 'hello',
})
</script>

<template>
  <TestComp :msg="msg" />

  <input v-model="msg.a" class="border-1 bg-white text-black">
</template>
