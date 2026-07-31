<script setup>
import { ref, watch } from "vue";
import { useProjectsStore } from "../../stores/projects";
import { useToastStore } from "../../stores/toast";
import BaseModal from "./BaseModal.vue";

const props = defineProps({
  show: { type: Boolean, required: true },
  project: { type: Object, default: null },
});

const emit = defineEmits(["close", "deleted"]);

const projectsStore = useProjectsStore();
const toast = useToastStore();

const name = ref("");
const domain = ref("");
const desc = ref("");
const repo = ref("");
const emoji = ref("");

watch(
  () => props.project,
  (project) => {
    if (project) {
      name.value = project.name;
      domain.value = project.domain || "";
      desc.value = project.desc || "";
      repo.value = project.repo || "";
      emoji.value = project.emoji || "";
    }
  },
  { immediate: true },
);

async function save() {
  try {
    await projectsStore.update(props.project.id, {
      name: name.value.trim() || props.project.name,
      domain: domain.value.trim(),
      desc: desc.value.trim(),
      repo: repo.value.trim(),
      emoji: emoji.value || props.project.emoji,
    });
    toast.show("Projekt zaktualizowany!", "success");
    emit("close");
  } catch (err) {
    toast.show(err.message, "error");
  }
}

async function remove() {
  if (!confirm("Czy na pewno chcesz usunąć ten projekt? Wszystkie zadania i commity projektu zostaną usunięte!"))
    return;
  try {
    await projectsStore.remove(props.project.id);
    toast.show("Projekt usunięty", "info");
    emit("deleted");
  } catch (err) {
    toast.show(err.message, "error");
  }
}
</script>

<template>
  <BaseModal :show="show" title="Edytuj projekt" max-width="480px" @close="emit('close')">
    <div class="form-group">
      <label class="form-label">Nazwa</label>
      <input class="form-input" v-model="name" />
    </div>
    <div class="form-group">
      <label class="form-label">Domena</label>
      <input class="form-input" v-model="domain" />
    </div>
    <div class="form-group">
      <label class="form-label">Opis</label>
      <textarea class="form-textarea" v-model="desc"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Repozytorium</label>
      <input class="form-input" v-model="repo" />
    </div>
    <div class="form-group">
      <label class="form-label">Emoji logo</label>
      <input class="form-input" v-model="emoji" maxlength="2" style="width: 80px" />
    </div>
    <div style="display: flex; justify-content: space-between; gap: 8px">
      <button class="btn btn-danger" @click="remove">Usuń projekt</button>
      <div style="display: flex; gap: 8px">
        <button class="btn btn-ghost" @click="emit('close')">Anuluj</button>
        <button class="btn btn-primary" @click="save">Zapisz</button>
      </div>
    </div>
  </BaseModal>
</template>
