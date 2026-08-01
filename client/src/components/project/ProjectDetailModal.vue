<script setup>
import { ref, computed, watch } from "vue";
import { useProjectsStore } from "../../stores/projects";
import BaseModal from "../modals/BaseModal.vue";
import OverviewPanel from "./OverviewPanel.vue";
import TasksPanel from "./TasksPanel.vue";
import CommitsPanel from "./CommitsPanel.vue";
import DesignPanel from "./DesignPanel.vue";
import NotesPanel from "./NotesPanel.vue";
import NewTaskModal from "../modals/NewTaskModal.vue";
import EditTaskModal from "../modals/EditTaskModal.vue";
import AddCommitModal from "../modals/AddCommitModal.vue";
import EditProjectModal from "../modals/EditProjectModal.vue";

const props = defineProps({
  show: { type: Boolean, required: true },
  projectId: { type: String, default: null },
});

const emit = defineEmits(["close"]);

const projectsStore = useProjectsStore();

const tabs = [
  { key: "overview", label: "Przegląd" },
  { key: "tasks", label: "Zadania" },
  { key: "commits", label: "Commity" },
  { key: "design", label: "Design" },
  { key: "notes", label: "Notatki" },
];
const activeTab = ref("overview");

const project = computed(() => projectsStore.items.find((p) => p.id === props.projectId));

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) activeTab.value = "overview";
  },
);

const showNewTaskModal = ref(false);
const editingTask = ref(null);
const showAddCommitModal = ref(false);
const showEditProjectModal = ref(false);

function onProjectDeleted() {
  showEditProjectModal.value = false;
  emit("close");
}
</script>

<template>
  <BaseModal v-if="project" :show="show" max-width="900px" resizable @close="emit('close')">
    <template #title>
      <span style="margin-right: 6px">{{ project.emoji }}</span>{{ project.name }}
      <span class="badge badge-blue" style="margin-left: 8px">{{ project.type }}</span>
    </template>
    <template #header-actions>
      <button class="modal-close" title="Edytuj projekt" @click="showEditProjectModal = true">✎</button>
    </template>

    <div class="project-panel">
      <div class="panel-sidebar">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="panel-nav-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>
      <div class="panel-main">
        <OverviewPanel
          v-if="activeTab === 'overview'"
          :project="project"
          @go-to-tasks="activeTab = 'tasks'"
          @edit-task="editingTask = $event"
        />
        <TasksPanel
          v-else-if="activeTab === 'tasks'"
          :project="project"
          @new-task="showNewTaskModal = true"
          @edit-task="editingTask = $event"
        />
        <CommitsPanel
          v-else-if="activeTab === 'commits'"
          :project="project"
          @add-commit="showAddCommitModal = true"
        />
        <DesignPanel v-else-if="activeTab === 'design'" :project="project" />
        <NotesPanel v-else-if="activeTab === 'notes'" :project="project" />
      </div>
    </div>

    <NewTaskModal :show="showNewTaskModal" :default-project-id="project.id" @close="showNewTaskModal = false" />
    <EditTaskModal :show="!!editingTask" :task="editingTask" @close="editingTask = null" />
    <AddCommitModal :show="showAddCommitModal" :project-id="project.id" @close="showAddCommitModal = false" />
    <EditProjectModal
      :show="showEditProjectModal"
      :project="project"
      @close="showEditProjectModal = false"
      @deleted="onProjectDeleted"
    />
  </BaseModal>
</template>
