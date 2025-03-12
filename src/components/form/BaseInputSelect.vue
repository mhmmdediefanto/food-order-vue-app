<template>
  <select
    :name="name"
    :id="id"
    class="px-2 py-1 border border-gray-400 rounded-lg w-full"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option value="" disabled selected>{{ placeholder }}</option>
    <option
      v-for="(option, index) in options"
      :key="index"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  name: String,
  id: String,
  modelValue: String, // Binding v-model
  placeholder: { type: String, default: "Pilih opsi" },
  options: { type: Array, required: true }, // Array of options: [{ value, label }]
});

defineEmits(["update:modelValue"]);
</script>

<style lang="" scoped>
/* Styling opsional */
</style>
