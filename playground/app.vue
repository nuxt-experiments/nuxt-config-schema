<template>
  <div>
    Nuxt module playground!
    App Config: {{ useAppConfig() }}
  </div>
</template>

<script setup>
import { useAppConfig } from '#app'
</script>
