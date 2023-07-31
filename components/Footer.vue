<script setup lang="ts">
import { repository } from '~/package.json'
</script>

<template>
  <div text="xl gray4" m-5 flex="~ gap3" justify-center>
    <NuxtLink i-carbon-campsite to="/" />
    <a i-carbon-logo-github :href="repository.url" target="_blank" />
    <DarkToggle />
  </div>
</template>
