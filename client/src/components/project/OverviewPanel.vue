<script setup>
import { computed } from "vue";
import { useTasksStore } from "../../stores/tasks";
import { useCommitsStore } from "../../stores/commits";
import TaskItem from "../tasks/TaskItem.vue";

const props = defineProps({
  project: { type: Object, required: true },
});

const emit = defineEmits(["edit-task", "go-to-tasks"]);

const tasksStore = useTasksStore();
const commitsStore = useCommitsStore();

const projectTasks = computed(() => tasksStore.items.filter((t) => t.projectId === props.project.id));
const doneTasks = computed(() => projectTasks.value.filter((t) => t.done));
const openTasks = computed(() => projectTasks.value.filter((t) => !t.done));
const projectCommits = computed(() => commitsStore.items.filter((c) => c.projectId === props.project.id));
const progress = computed(() =>
  projectTasks.value.length ? Math.round((doneTasks.value.length / projectTasks.value.length) * 100) : 0,
);
</script>

<template>
  <div>
    <div class="proj-overview-header">
      <div class="proj-logo-big">
        <img v-if="project.logo" :src="project.logo" alt="" />
        <span v-else>{{ project.emoji || "🚀" }}</span>
      </div>
      <div class="proj-info">
        <h2>{{ project.name }}</h2>
        <div v-if="project.domain" class="domain">🌐 {{ project.domain }}</div>
        <div v-if="project.desc" class="desc">{{ project.desc }}</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value" style="color: var(--accent2)">{{ projectTasks.length }}</div>
        <div class="stat-label">Zadania ogółem</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: var(--feat)">{{ doneTasks.length }}</div>
        <div class="stat-label">Ukończone</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: var(--js)">{{ openTasks.length }}</div>
        <div class="stat-label">Do zrobienia</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: var(--refactor)">{{ projectCommits.length }}</div>
        <div class="stat-label">Commity</div>
      </div>
    </div>

    <div style="margin-bottom: 16px">
      <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 4px">
        <span>Postęp projektu</span><span>{{ progress }}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" :style="{ width: progress + '%' }"></div></div>
    </div>

    <template v-if="project.techs.length">
      <div class="section-title">Stack technologiczny</div>
      <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 16px">
        <span v-for="t in project.techs" :key="t" class="tag tag-style">{{ t }}</span>
      </div>
    </template>

    <div class="section-title">Ostatnie zadania</div>
    <div v-if="!openTasks.length" class="empty-state" style="padding: 16px">
      <p>Brak otwartych zadań 🎉</p>
    </div>
    <TaskItem v-for="task in openTasks.slice(0, 4)" :key="task.id" :task="task" @edit="emit('edit-task', $event)" />
    <div style="margin-top: 8px">
      <button class="btn btn-ghost btn-sm" @click="emit('go-to-tasks')">Wszystkie zadania projektu</button>
    </div>
  </div>
</template>
