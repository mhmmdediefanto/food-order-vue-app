<template>
  <input
    :type="type"
    class="px-2 py-1 border border-gray-400 rounded-lg w-full"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :id="id"
  />
</template>

<script setup>
defineProps(["id", "placeholder", "modelValue", "type"]);

defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped></style>
