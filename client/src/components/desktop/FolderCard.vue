<script setup>
import { computed, ref } from "vue";
import { useProjectsStore } from "../../stores/projects";
import { useDraggable } from "../../composables/useDraggable";

const props = defineProps({
  folder: { type: Object, required: true },
});

const emit = defineEmits(["open", "contextmenu", "move"]);

const projectsStore = useProjectsStore();
const cardRef = ref(null);

useDraggable(cardRef, (x, y) => emit("move", props.folder.id, x, y));

const projectCount = computed(
  () => projectsStore.items.filter((p) => p.folderId === props.folder.id).length,
);
</script>

<template>
  <div
    ref="cardRef"
    class="folder-card"
    @dblclick="emit('open', folder.id)"
    @contextmenu.prevent="emit('contextmenu', $event, folder.id)"
  >
    <button class="open-btn" @click="emit('open', folder.id)">→</button>
    <div class="icon">📁</div>
    <div class="title">{{ folder.name }}</div>
    <div class="count">{{ projectCount }} projekt{{ projectCount === 1 ? "" : "ów" }}</div>
  </div>
</template>

<style scoped>
.folder-card {
  position: absolute;
  width: 190px;
  background: rgba(17, 24, 39, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  cursor: grab;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.folder-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--js);
  border-radius: var(--radius) var(--radius) 0 0;
}
.folder-card:hover {
  border-color: var(--js);
  box-shadow: 0 0 24px rgba(234, 179, 8, 0.15);
}
.folder-card.dragging {
  cursor: grabbing;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  z-index: 500;
}
.open-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--bg-card2);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.7rem;
}
.icon {
  font-size: 2rem;
  margin-bottom: 8px;
}
.title {
  font-size: 0.8rem;
  font-weight: 700;
}
.count {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-top: 3px;
}
</style>
