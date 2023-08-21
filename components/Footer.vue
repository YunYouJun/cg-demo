<script setup lang="ts">
import { repository } from '~/package.json'
</script>

<template>
  <div text="xl gray4" flex="~ gap3" m-5 justify-center>
    <NuxtLink i-carbon-campsite to="/" />
    <a i-carbon-logo-github :href="repository.url" target="_blank" />
    <DarkToggle />
  </div>
</template>
