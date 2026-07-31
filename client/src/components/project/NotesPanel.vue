<script setup>
import { ref, watch } from "vue";
import { useProjectsStore } from "../../stores/projects";
import { useToastStore } from "../../stores/toast";

const props = defineProps({
  project: { type: Object, required: true },
});

const projectsStore = useProjectsStore();
const toast = useToastStore();

const notes = ref(props.project.notes);

watch(
  () => props.project.id,
  () => {
    notes.value = props.project.notes;
  },
);

async function save() {
  try {
    await projectsStore.update(props.project.id, { notes: notes.value });
    toast.show("Notatki zapisane!", "success");
  } catch (err) {
    toast.show(err.message, "error");
  }
}

function fmtDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("pl-PL", { day: "2-digit", month: "short" }) +
    " " +
    d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
  );
}
</script>

<template>
  <div>
    <div class="section-title">Notatki projektu</div>
    <textarea
      class="form-textarea"
      style="min-height: 180px"
      v-model="notes"
      placeholder="Notatki, linki, hasła testowe..."
    ></textarea>
    <div style="display: flex; justify-content: flex-end; margin-top: 8px">
      <button class="btn btn-primary btn-sm" @click="save">Zapisz notatki</button>
    </div>

    <template v-if="project.repo">
      <div class="section-title" style="margin-top: 20px">Repozytorium</div>
      <div style="display: flex; align-items: center; gap: 8px; padding: 10px; background: var(--bg-card2); border: 1px solid var(--border); border-radius: 8px">
        <a :href="project.repo" target="_blank" style="color: var(--accent2); font-family: monospace; font-size: 0.75rem">{{ project.repo }}</a>
      </div>
    </template>

    <div class="section-title" style="margin-top: 20px">Informacje</div>
    <div style="font-size: 0.72rem; color: var(--text-muted)">
      <div style="margin-bottom: 4px">Utworzono: {{ fmtDateTime(project.createdAt) }}</div>
      <div v-if="project.updatedAt">Ostatnia modyfikacja: {{ fmtDateTime(project.updatedAt) }}</div>
    </div>
  </div>
</template>
