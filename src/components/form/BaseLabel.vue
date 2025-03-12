<template>
  <label :for="forHtml" class="block mb-2 text-sm font-medium">{{
    label
  }}</label>
</template>

<script setup>
defineProps({
  label: String,
  forHtml: String,
});
</script>

<style lang="scss" scoped></style>
