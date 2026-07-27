<script setup>
import { ref, watch } from "vue";
import { useTasksStore } from "../../stores/tasks";
import { useProjectsStore } from "../../stores/projects";
import { useToastStore } from "../../stores/toast";
import BaseModal from "./BaseModal.vue";

const props = defineProps({
  show: { type: Boolean, required: true },
  defaultProjectId: { type: String, default: null },
});

const emit = defineEmits(["close"]);

const tasksStore = useTasksStore();
const projectsStore = useProjectsStore();
const toast = useToastStore();

const title = ref("");
const type = ref("feat");
const priority = ref("medium");
const projectId = ref("");
const due = ref("");
const desc = ref("");

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      title.value = "";
      type.value = "feat";
      priority.value = "medium";
      projectId.value = props.defaultProjectId || "";
      due.value = "";
      desc.value = "";
    }
  },
);

async function save() {
  if (!title.value.trim()) {
    toast.show("Podaj tytuł zadania!", "error");
    return;
  }
  try {
    await tasksStore.create({
      title: title.value.trim(),
      type: type.value,
      priority: priority.value,
      projectId: projectId.value || null,
      due: due.value || null,
      desc: desc.value.trim(),
    });
    toast.show("Zadanie dodane!", "success");
    emit("close");
  } catch (err) {
    toast.show(err.message, "error");
  }
}
</script>

<template>
  <BaseModal :show="show" title="Nowe zadanie" max-width="540px" @close="emit('close')">
    <div class="form-group">
      <label class="form-label">Tytuł zadania *</label>
      <input class="form-input" v-model="title" placeholder="Co trzeba zrobić?" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Typ zadania</label>
        <select class="form-select" v-model="type">
          <option value="fix">🔴 Fix — poprawka błędu</option>
          <option value="feat">🟢 Feat — nowa funkcja</option>
          <option value="js">🟡 Script — JS/logika</option>
          <option value="style">🔵 Style — wygląd/CSS</option>
          <option value="refactor">🟣 Refactor</option>
          <option value="test">🩵 Test</option>
          <option value="docs">🟠 Docs</option>
          <option value="perf">🩷 Performance</option>
          <option value="chore">⚪ Chore</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Projekt</label>
        <select class="form-select" v-model="projectId">
          <option value="">— globalnie —</option>
          <option v-for="p in projectsStore.items" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Priorytet</label>
        <select class="form-select" v-model="priority">
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Termin</label>
        <input class="form-input" type="date" v-model="due" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Opis / notatki</label>
      <textarea class="form-textarea" v-model="desc" placeholder="Szczegóły zadania..."></textarea>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 8px">
      <button class="btn btn-ghost" @click="emit('close')">Anuluj</button>
      <button class="btn btn-primary" @click="save">Dodaj zadanie</button>
    </div>
  </BaseModal>
</template>
