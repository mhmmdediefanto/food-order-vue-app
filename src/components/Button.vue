<template>
  <button @click="$emit('click')" :class="customClass" :to="to">
    {{ label }}
  </button>
</template>

<script setup>
defineProps(["label", "customClass", "to"]);
</script>

<style lang="" scoped></style>
