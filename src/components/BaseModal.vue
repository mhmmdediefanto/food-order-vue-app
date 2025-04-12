<script setup>
defineProps(["show"]);
defineEmits(["close"]);
</script>
<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 "
    @click.self="close"
  >
    <div class="bg-white rounded-xl shadow-lg max-w-lg w-full p-6">
      <slot name="header">
        <h2 class="text-xl font-semibold">Default Header</h2>
      </slot>

      <div class="mt-4">
        <slot />
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <slot name="footer">
          <button @click="close" class="px-4 py-2 bg-gray-300 rounded">
            Tutup
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
