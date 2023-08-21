<script setup lang="ts">
const online = useOnline()
</script>

<template>
  <div>
    <Logos mb-6 />
    <ul>
      <li>
        <NuxtLink to="/postprocessing/bloom">
          Bloom
        </NuxtLink>
      </li>
    </ul>

    <Suspense>
      <ClientOnly>
        <ul>
          <NuxtLink to="/pixi/scale">
            Scale
          </NuxtLink>
        </ul>

        <PageView v-if="online" />
        <div v-else text-gray:80>
          You're offline
        </div>
      </ClientOnly>
      <template #fallback>
        <div italic op50>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
    <InputEntry />
  </div>
</template>
