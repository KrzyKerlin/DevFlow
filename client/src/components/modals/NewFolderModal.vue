<script setup>
import { ref, watch } from "vue";
import { useFoldersStore } from "../../stores/folders";
import { useToastStore } from "../../stores/toast";
import BaseModal from "./BaseModal.vue";

const props = defineProps({
  show: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);

const foldersStore = useFoldersStore();
const toast = useToastStore();

const name = ref("");
const desc = ref("");

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      name.value = "";
      desc.value = "";
    }
  },
);

async function save() {
  if (!name.value.trim()) {
    toast.show("Podaj nazwę katalogu!", "error");
    return;
  }
  try {
    await foldersStore.create({
      name: name.value.trim(),
      desc: desc.value.trim(),
      x: 40 + Math.random() * 400,
      y: 100 + Math.random() * 200,
    });
    toast.show(`Katalog "${name.value}" utworzony!`, "success");
    emit("close");
  } catch (err) {
    toast.show(err.message, "error");
  }
}
</script>

<template>
  <BaseModal :show="show" title="Nowy katalog" max-width="420px" @close="emit('close')">
    <div class="form-group">
      <label class="form-label">Nazwa katalogu *</label>
      <input class="form-input" v-model="name" placeholder="np. Strony klientów" />
    </div>
    <div class="form-group">
      <label class="form-label">Opis</label>
      <input class="form-input" v-model="desc" placeholder="Opcjonalny opis..." />
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 8px">
      <button class="btn btn-ghost" @click="emit('close')">Anuluj</button>
      <button class="btn btn-primary" @click="save">Utwórz katalog</button>
    </div>
  </BaseModal>
</template>
