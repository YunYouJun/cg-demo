<script lang="ts" setup>
defineProps<{
  msg: {
    a: string
  }
}>()

// watch(() => props.msg.a, (val) => {
//   // engine
// })
</script>

<template>
  <div>
    <div>
      {{ msg }}
      {{ msg.a }}
    </div>
  </div>
</template>
