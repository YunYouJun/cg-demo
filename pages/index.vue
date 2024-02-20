<script setup lang="ts">
const demoLinks = [
  {
    title: 'Bloom',
    path: '/postprocessing/bloom',
  },
  {
    title: 'Scale',
    path: '/pixi/scale',
  },
  {
    title: 'Points',
    path: '/pixi/points',
  },
]
</script>

<template>
  <div>
    <Logos mb-6 />
    <ul>
      <li v-for="link in demoLinks" :key="link.title">
        <NuxtLink :to="link.path">
          {{ link.title }}
        </NuxtLink>
      </li>
    </ul>

    <Suspense>
      <template #fallback>
        <div italic op50>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
    <InputEntry />
  </div>
</template>
