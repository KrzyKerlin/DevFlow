<script setup>
defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: "" },
  maxWidth: { type: String, default: "580px" },
});

const emit = defineEmits(["close"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="emit('close')">
      <div class="modal" :style="{ maxWidth }">
        <div class="modal-header">
          <span class="modal-title"><slot name="title">{{ title }}</slot></span>
          <slot name="header-actions" />
          <button class="modal-close" @click="emit('close')">✕</button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
