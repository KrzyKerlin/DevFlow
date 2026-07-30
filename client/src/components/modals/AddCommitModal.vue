<script setup>
import { ref, watch } from "vue";
import { useCommitsStore } from "../../stores/commits";
import { useToastStore } from "../../stores/toast";
import BaseModal from "./BaseModal.vue";

const props = defineProps({
  show: { type: Boolean, required: true },
  projectId: { type: String, required: true },
});

const emit = defineEmits(["close"]);

const commitsStore = useCommitsStore();
const toast = useToastStore();

const type = ref("feat");
const message = ref("");
const desc = ref("");

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      type.value = "feat";
      message.value = "";
      desc.value = "";
    }
  },
);

async function save() {
  if (!message.value.trim()) {
    toast.show("Podaj wiadomość commita!", "error");
    return;
  }
  try {
    await commitsStore.create({
      type: type.value,
      message: message.value.trim(),
      desc: desc.value.trim(),
      projectId: props.projectId,
    });
    toast.show("Commit zapisany!", "success");
    emit("close");
  } catch (err) {
    toast.show(err.message, "error");
  }
}
</script>

<template>
  <BaseModal :show="show" title="Dodaj commit" max-width="500px" @close="emit('close')">
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Typ</label>
        <select class="form-select" v-model="type">
          <option value="feat">feat</option>
          <option value="fix">fix</option>
          <option value="style">style</option>
          <option value="refactor">refactor</option>
          <option value="test">test</option>
          <option value="docs">docs</option>
          <option value="perf">perf</option>
          <option value="chore">chore</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Wiadomość</label>
        <input class="form-input" v-model="message" placeholder="co zostało zmienione..." />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Opis (opcjonalnie)</label>
      <textarea class="form-textarea" v-model="desc" style="min-height: 60px"></textarea>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 8px">
      <button class="btn btn-ghost" @click="emit('close')">Anuluj</button>
      <button class="btn btn-primary" @click="save">Zapisz commit</button>
    </div>
  </BaseModal>
</template>
