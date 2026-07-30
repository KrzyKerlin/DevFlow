<script setup>
import { ref, computed, watch } from "vue";
import { useProjectsStore } from "../../stores/projects";
import BaseModal from "../modals/BaseModal.vue";
import OverviewPanel from "./OverviewPanel.vue";

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
</script>

<template>
  <BaseModal v-if="project" :show="show" max-width="900px" @close="emit('close')">
    <template #title>
      <span style="margin-right: 6px">{{ project.emoji }}</span>{{ project.name }}
      <span class="badge badge-blue" style="margin-left: 8px">{{ project.type }}</span>
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
        />
        <div v-else class="empty-state">
          <p>Ta zakładka pojawi się w kolejnym commicie.</p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
