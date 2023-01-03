<template>
  <div>
    <h1>Nuxt User Schema</h1>
    <pre>{{ schema }}</pre>
  </div>
</template>

<script setup>
import schema from '#build/schema/nuxt.schema'
</script>
