<script setup>
import { ref, watch } from "vue";
import { useTasksStore } from "../../stores/tasks";
import { useToastStore } from "../../stores/toast";
import BaseModal from "./BaseModal.vue";

const props = defineProps({
  show: { type: Boolean, required: true },
  task: { type: Object, default: null },
});

const emit = defineEmits(["close"]);

const tasksStore = useTasksStore();
const toast = useToastStore();

const title = ref("");
const type = ref("feat");
const priority = ref("medium");
const due = ref("");
const desc = ref("");

watch(
  () => props.task,
  (task) => {
    if (task) {
      title.value = task.title;
      type.value = task.type;
      priority.value = task.priority;
      due.value = task.due || "";
      desc.value = task.desc || "";
    }
  },
  { immediate: true },
);

async function save() {
  try {
    await tasksStore.update(props.task.id, {
      title: title.value.trim() || props.task.title,
      type: type.value,
      priority: priority.value,
      due: due.value || null,
      desc: desc.value.trim(),
    });
    toast.show("Zadanie zaktualizowane!", "success");
    emit("close");
  } catch (err) {
    toast.show(err.message, "error");
  }
}
</script>

<template>
  <BaseModal :show="show" title="Edytuj zadanie" max-width="520px" @close="emit('close')">
    <div class="form-group">
      <label class="form-label">Tytuł</label>
      <input class="form-input" v-model="title" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Typ</label>
        <select class="form-select" v-model="type">
          <option value="fix">🔴 Fix</option>
          <option value="feat">🟢 Feat</option>
          <option value="js">🟡 Script</option>
          <option value="style">🔵 Style</option>
          <option value="refactor">🟣 Refactor</option>
          <option value="test">🩵 Test</option>
          <option value="docs">🟠 Docs</option>
          <option value="perf">🩷 Performance</option>
          <option value="chore">⚪ Chore</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Priorytet</label>
        <select class="form-select" v-model="priority">
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Termin</label>
      <input class="form-input" type="date" v-model="due" />
    </div>
    <div class="form-group">
      <label class="form-label">Opis</label>
      <textarea class="form-textarea" v-model="desc"></textarea>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 8px">
      <button class="btn btn-ghost" @click="emit('close')">Anuluj</button>
      <button class="btn btn-primary" @click="save">Zapisz</button>
    </div>
  </BaseModal>
</template>
