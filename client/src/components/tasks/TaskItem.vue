<script setup>
import { computed } from "vue";
import { useTasksStore } from "../../stores/tasks";
import { useProjectsStore } from "../../stores/projects";
import { useToastStore } from "../../stores/toast";

const props = defineProps({
  task: { type: Object, required: true },
});

const emit = defineEmits(["edit"]);

const tasksStore = useTasksStore();
const projectsStore = useProjectsStore();
const toast = useToastStore();

const typeLabels = {
  fix: "fix",
  feat: "feat",
  js: "script",
  style: "style",
  refactor: "refactor",
  test: "test",
  docs: "docs",
  perf: "perf",
  chore: "chore",
};

const priorityColors = {
  low: "var(--text-muted)",
  medium: "var(--js)",
  high: "var(--fix)",
};

const project = computed(
  () => (props.task.projectId ? projectsStore.items.find((p) => p.id === props.task.projectId) : null),
);

const isOverdue = computed(
  () => props.task.due && !props.task.done && new Date(props.task.due) < new Date(),
);

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pl-PL", { day: "2-digit", month: "short", year: "numeric" });
}

async function toggle() {
  try {
    await tasksStore.toggleDone(props.task);
  } catch (err) {
    toast.show(err.message, "error");
  }
}

async function remove() {
  if (!confirm("Usunąć to zadanie?")) return;
  try {
    await tasksStore.remove(props.task.id);
    toast.show("Zadanie usunięte", "info");
  } catch (err) {
    toast.show(err.message, "error");
  }
}
</script>

<template>
  <div class="task-item" :class="{ done: task.done }">
    <div class="task-priority" :style="{ background: priorityColors[task.priority] }"></div>
    <div class="task-check" :class="{ checked: task.done }" @click="toggle">
      <span v-if="task.done">✓</span>
    </div>
    <div class="task-content">
      <div class="task-title">{{ task.title }}</div>
      <div class="task-meta">
        <span class="tag" :class="`tag-${task.type}`">{{ typeLabels[task.type] || task.type }}</span>
        <span v-if="task.due" class="task-date" :style="{ color: isOverdue ? 'var(--fix)' : '' }">
          {{ fmtDate(task.due) }}{{ isOverdue ? " ⚠" : "" }}
        </span>
        <span v-if="project" class="badge badge-blue">{{ project.name }}</span>
      </div>
    </div>
    <div class="task-actions">
      <button class="task-action-btn edit" title="Edytuj" @click="emit('edit', task)">✎</button>
      <button class="task-action-btn del" title="Usuń" @click="remove">🗑</button>
    </div>
  </div>
</template>
