<script setup>
import { onMounted, ref } from "vue";
import { useToastStore } from "../stores/toast";
import { useProjectsStore } from "../stores/projects";
import { useFoldersStore } from "../stores/folders";
import { useTasksStore } from "../stores/tasks";
import { useCommitsStore } from "../stores/commits";
import TheTaskbar from "../components/layout/TheTaskbar.vue";
import ProjectCard from "../components/desktop/ProjectCard.vue";
import FolderCard from "../components/desktop/FolderCard.vue";
import NewFolderModal from "../components/modals/NewFolderModal.vue";
import NewTaskModal from "../components/modals/NewTaskModal.vue";
import AllTasksModal from "../components/modals/AllTasksModal.vue";
import NewProjectModal from "../components/modals/NewProjectModal.vue";

const toast = useToastStore();
const projectsStore = useProjectsStore();
const foldersStore = useFoldersStore();
const tasksStore = useTasksStore();
const commitsStore = useCommitsStore();

onMounted(async () => {
  try {
    await Promise.all([
      projectsStore.fetchAll(),
      foldersStore.fetchAll(),
      tasksStore.fetchAll(),
      commitsStore.fetchAll(),
    ]);
  } catch (err) {
    toast.show(err.message, "error");
  }
});

function notImplementedYet() {
  toast.show("Ta funkcja pojawi się w kolejnym commicie.", "info");
}

function moveProject(id, x, y) {
  projectsStore.update(id, { x, y }).catch((err) => toast.show(err.message, "error"));
}

function moveFolder(id, x, y) {
  foldersStore.update(id, { x, y }).catch((err) => toast.show(err.message, "error"));
}

const showNewFolderModal = ref(false);
const showNewTaskModal = ref(false);
const showAllTasksModal = ref(false);
const showNewProjectModal = ref(false);
</script>

<template>
  <div class="dashboard">
    <div class="desktop-area">
      <FolderCard
        v-for="folder in foldersStore.items"
        :key="folder.id"
        :folder="folder"
        :style="{ left: folder.x + 'px', top: folder.y + 'px' }"
        @open="notImplementedYet"
        @contextmenu="notImplementedYet"
        @move="moveFolder"
      />
      <ProjectCard
        v-for="project in projectsStore.items"
        :key="project.id"
        :project="project"
        :style="{ left: project.x + 'px', top: project.y + 'px' }"
        @open="notImplementedYet"
        @contextmenu="notImplementedYet"
        @move="moveProject"
      />
    </div>

    <TheTaskbar
      @new-project="showNewProjectModal = true"
      @new-task="showNewTaskModal = true"
      @new-folder="showNewFolderModal = true"
      @all-tasks="showAllTasksModal = true"
      @toggle-calendar="notImplementedYet"
      @toggle-chat="notImplementedYet"
    />

    <NewFolderModal :show="showNewFolderModal" @close="showNewFolderModal = false" />
    <NewTaskModal :show="showNewTaskModal" @close="showNewTaskModal = false" />
    <AllTasksModal :show="showAllTasksModal" @close="showAllTasksModal = false" />
    <NewProjectModal :show="showNewProjectModal" @close="showNewProjectModal = false" />
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  height: 100vh;
}
.desktop-area {
  position: relative;
  height: calc(100vh - var(--taskbar-h));
  overflow: auto;
}
</style>
