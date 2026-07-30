<script setup>
import { ref, computed } from "vue";
import { useTasksStore } from "../../stores/tasks";
import TaskItem from "../tasks/TaskItem.vue";

const props = defineProps({
  project: { type: Object, required: true },
});

const emit = defineEmits(["edit-task", "new-task"]);

const tasksStore = useTasksStore();

const filters = ["all", "fix", "feat", "js", "style", "refactor"];
const activeFilter = ref("all");

const projectTasks = computed(() => tasksStore.items.filter((t) => t.projectId === props.project.id));
const filteredTasks = computed(() =>
  activeFilter.value === "all"
    ? projectTasks.value
    : projectTasks.value.filter((t) => t.type === activeFilter.value),
);
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px">
      <div class="section-title" style="margin: 0">Zadania projektu</div>
      <button class="btn btn-primary btn-sm" @click="emit('new-task')">+ Nowe zadanie</button>
    </div>
    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px">
      <button
        v-for="f in filters"
        :key="f"
        class="btn btn-ghost btn-sm"
        :class="{ active: activeFilter === f }"
        @click="activeFilter = f"
      >
        {{ f === "all" ? "Wszystkie" : f }}
      </button>
    </div>
    <div v-if="!filteredTasks.length" class="empty-state">
      <p>Brak zadań. Dodaj pierwsze!</p>
    </div>
    <TaskItem v-for="task in filteredTasks" :key="task.id" :task="task" @edit="emit('edit-task', $event)" />
  </div>
</template>

<style scoped>
.btn.active {
  border-color: var(--accent);
  color: var(--accent2);
}
</style>
