<script setup>
import { ref, computed } from "vue";
import { useTasksStore } from "../../stores/tasks";
import { useProjectsStore } from "../../stores/projects";
import BaseModal from "./BaseModal.vue";
import TaskItem from "../tasks/TaskItem.vue";
import EditTaskModal from "./EditTaskModal.vue";

const props = defineProps({
  show: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);

const tasksStore = useTasksStore();
const projectsStore = useProjectsStore();

const filters = [
  { key: "all", label: "Wszystkie" },
  { key: "fix", label: "🔴 Fix" },
  { key: "feat", label: "🟢 Feat" },
  { key: "js", label: "🟡 Script" },
  { key: "style", label: "🔵 Style" },
  { key: "refactor", label: "🟣 Refactor" },
  { key: "done", label: "✅ Ukończone" },
];
const activeFilter = ref("all");

const filteredTasks = computed(() => {
  if (activeFilter.value === "done") return tasksStore.items.filter((t) => t.done);
  if (activeFilter.value === "all") return tasksStore.items.filter((t) => !t.done);
  return tasksStore.items.filter((t) => t.type === activeFilter.value && !t.done);
});

const groupedTasks = computed(() => {
  const groups = {};
  filteredTasks.value.forEach((task) => {
    const key = task.projectId || "__global__";
    if (!groups[key]) groups[key] = [];
    groups[key].push(task);
  });
  return Object.entries(groups).map(([projectId, tasks]) => ({
    projectId,
    projectName:
      projectId === "__global__"
        ? "🌐 Globalne"
        : projectsStore.items.find((p) => p.id === projectId)?.name || "—",
    tasks,
  }));
});

const editingTask = ref(null);
function openEdit(task) {
  editingTask.value = task;
}
</script>

<template>
  <BaseModal :show="show" title="Wszystkie zadania" max-width="780px" @close="emit('close')">
    <div class="filters">
      <button
        v-for="f in filters"
        :key="f.key"
        class="btn btn-ghost btn-sm"
        :class="{ active: activeFilter === f.key }"
        @click="activeFilter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="!filteredTasks.length" class="empty-state">
      <p>Brak zadań w tej kategorii</p>
    </div>
    <template v-else>
      <div v-for="group in groupedTasks" :key="group.projectId" class="group">
        <div class="section-title">{{ group.projectName }}</div>
        <TaskItem v-for="task in group.tasks" :key="task.id" :task="task" @edit="openEdit" />
      </div>
    </template>

    <EditTaskModal :show="!!editingTask" :task="editingTask" @close="editingTask = null" />
  </BaseModal>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.filters .btn.active {
  border-color: var(--accent);
  color: var(--accent2);
}
.group {
  margin-top: 12px;
}
</style>
