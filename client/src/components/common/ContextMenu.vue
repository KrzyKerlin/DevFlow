<script setup>
const props = defineProps({
  show: { type: Boolean, required: true },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  items: { type: Array, required: true },
});

const emit = defineEmits(["close"]);

function run(item) {
  item.action();
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="ctx-backdrop" @click="emit('close')" @contextmenu.prevent="emit('close')">
      <div class="ctx-menu" :style="{ left: x + 'px', top: y + 'px' }" @click.stop>
        <div
          v-for="item in items"
          :key="item.label"
          class="ctx-item"
          :class="{ danger: item.danger }"
          @click="run(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ctx-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9000;
}
.ctx-menu {
  position: fixed;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow);
  min-width: 160px;
  padding: 4px;
}
.ctx-item {
  padding: 8px 12px;
  border-radius: 7px;
  font-size: 0.78rem;
  cursor: pointer;
  color: var(--text-muted);
}
.ctx-item:hover {
  background: var(--bg-hover);
  color: var(--text);
}
.ctx-item.danger:hover {
  background: var(--fix-bg);
  color: var(--fix);
}
</style>
