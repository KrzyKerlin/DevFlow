<script setup>
import { ref, watch } from "vue";
import { useProjectsStore } from "../../stores/projects";
import { useFoldersStore } from "../../stores/folders";
import { useToastStore } from "../../stores/toast";
import BaseModal from "./BaseModal.vue";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ImagePlus,
  X,
  Trash2,
  Globe,
  AppWindow,
  ShoppingCart,
  Code,
  Smartphone,
  Puzzle,
} from "@lucide/vue";

const props = defineProps({
  show: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);

const projectsStore = useProjectsStore();
const foldersStore = useFoldersStore();
const toast = useToastStore();

const TECH_OPTIONS = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "Vue.js",
  "React",
  "Next.js",
  "Node.js",
  "PHP",
  "WordPress",
  "Tailwind",
];

const TYPE_OPTIONS = [
  { value: "website", label: "Website", icon: Globe },
  { value: "webapp", label: "Web App", icon: AppWindow },
  { value: "ecommerce", label: "E-commerce", icon: ShoppingCart },
  { value: "api", label: "API/Backend", icon: Code },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "other", label: "Inne", icon: Puzzle },
];

const step = ref(1);
const name = ref("");
const domain = ref("");
const desc = ref("");
const type = ref("website");
const folderId = ref("");
const logo = ref(null);
const colors = ref([]);
const colorPicker = ref("#3b82f6");
const fonts = ref([]);
const fontName = ref("");
const fontType = ref("primary");
const techs = ref([]);
const notes = ref("");
const repo = ref("");

function resetForm() {
  step.value = 1;
  name.value = "";
  domain.value = "";
  desc.value = "";
  type.value = "website";
  folderId.value = "";
  logo.value = null;
  colors.value = [];
  fonts.value = [];
  techs.value = [];
  notes.value = "";
  repo.value = "";
}

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) resetForm();
  },
);

function nextFromStep1() {
  if (!name.value.trim()) {
    toast.show("Podaj nazwę projektu!", "error");
    return;
  }
  step.value = 2;
}

function addColor() {
  if (colors.value.includes(colorPicker.value)) {
    toast.show("Kolor już dodany!", "info");
    return;
  }
  colors.value.push(colorPicker.value);
}

function removeColor(index) {
  colors.value.splice(index, 1);
}

function addFont() {
  if (!fontName.value.trim()) {
    toast.show("Podaj nazwę czcionki!", "error");
    return;
  }
  fonts.value.push({ name: fontName.value.trim(), type: fontType.value });
  fontName.value = "";
}

function removeFont(index) {
  fonts.value.splice(index, 1);
}

function toggleTech(tech) {
  const idx = techs.value.indexOf(tech);
  if (idx > -1) techs.value.splice(idx, 1);
  else techs.value.push(tech);
}

function onLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    logo.value = ev.target.result;
  };
  reader.readAsDataURL(file);
}

async function create() {
  if (!name.value.trim()) {
    toast.show("Podaj nazwę projektu!", "error");
    step.value = 1;
    return;
  }
  try {
    await projectsStore.create({
      name: name.value.trim(),
      domain: domain.value.trim(),
      desc: desc.value.trim(),
      type: type.value,
      colors: colors.value,
      fonts: fonts.value,
      techs: techs.value,
      logo: logo.value,
      notes: notes.value.trim(),
      repo: repo.value.trim(),
      folderId: folderId.value || null,
      x: 40 + Math.random() * 300,
      y: 40 + Math.random() * 200,
    });
    toast.show(`Projekt "${name.value}" utworzony!`, "success");
    emit("close");
  } catch (err) {
    toast.show(err.message, "error");
  }
}
</script>

<template>
  <BaseModal :show="show" title="Nowy projekt" max-width="600px" @close="emit('close')">
    <div class="wizard-steps">
      <div class="wizard-step" :class="{ active: step === 1, done: step > 1 }">1. Podstawy</div>
      <div class="wizard-step" :class="{ active: step === 2, done: step > 2 }">2. Wygląd</div>
      <div class="wizard-step" :class="{ active: step === 3 }">3. Technologie</div>
    </div>

    <!-- Step 1 -->
    <div v-if="step === 1">
      <div class="form-group">
        <label class="form-label">Nazwa projektu *</label>
        <input class="form-input" v-model="name" placeholder="np. Synapse Website" />
      </div>
      <div class="form-group">
        <label class="form-label">Domena / URL</label>
        <input class="form-input" v-model="domain" placeholder="np. synapse.pl" />
      </div>
      <div class="form-group">
        <label class="form-label">Opis</label>
        <textarea class="form-textarea" v-model="desc" placeholder="Krótki opis projektu..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Typ projektu</label>
        <div class="type-grid">
          <div
            v-for="opt in TYPE_OPTIONS"
            :key="opt.value"
            class="type-opt"
            :class="{ selected: type === opt.value }"
            @click="type = opt.value"
          >
            <component :is="opt.icon" :size="18" />
            <span>{{ opt.label }}</span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Folder nadrzędny (opcjonalnie)</label>
        <select class="form-select" v-model="folderId">
          <option value="">— brak —</option>
          <option v-for="f in foldersStore.items" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>
      </div>
      <div class="wizard-actions right">
        <button class="btn btn-primary" @click="nextFromStep1">Dalej <ArrowRight :size="14" /></button>
      </div>
    </div>

    <!-- Step 2 -->
    <div v-else-if="step === 2">
      <div class="form-group">
        <label class="form-label">Logo projektu</label>
        <label class="logo-upload-area">
          <span v-if="!logo" class="upload-hint"><ImagePlus :size="16" /> Kliknij aby przesłać logo</span>
          <img v-else :src="logo" class="logo-preview" alt="" />
          <input type="file" accept="image/*" style="display: none" @change="onLogoUpload" />
        </label>
      </div>
      <div class="form-group">
        <label class="form-label">Kolory projektu</label>
        <div class="color-row">
          <input type="color" v-model="colorPicker" class="color-picker" />
          <button class="btn btn-ghost btn-sm" @click="addColor">+ Dodaj kolor</button>
        </div>
        <div class="color-swatches">
          <div v-for="(c, i) in colors" :key="c" class="color-swatch" :style="{ background: c }" :title="c">
            <div class="remove-swatch" @click="removeColor(i)"><X :size="9" /></div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Czcionki</label>
        <div class="font-row">
          <input class="form-input" v-model="fontName" placeholder="np. Inter, Poppins..." />
          <select class="form-select font-type" v-model="fontType">
            <option value="primary">Główna</option>
            <option value="secondary">Dodatkowa</option>
            <option value="mono">Monospace</option>
          </select>
          <button class="btn btn-ghost btn-sm" @click="addFont">+</button>
        </div>
        <div v-for="(f, i) in fonts" :key="i" class="font-item">
          <div>
            <div class="font-preview" :style="{ fontFamily: f.name }">{{ f.name }}</div>
            <div class="font-type-label">{{ f.type }}</div>
          </div>
          <button class="btn btn-ghost btn-sm" @click="removeFont(i)"><Trash2 :size="13" /></button>
        </div>
      </div>
      <div class="wizard-actions">
        <button class="btn btn-ghost" @click="step = 1"><ArrowLeft :size="14" /> Wstecz</button>
        <button class="btn btn-primary" @click="step = 3">Dalej <ArrowRight :size="14" /></button>
      </div>
    </div>

    <!-- Step 3 -->
    <div v-else>
      <div class="form-group">
        <label class="form-label">Stack technologiczny</label>
        <div class="tech-tags">
          <span
            v-for="t in TECH_OPTIONS"
            :key="t"
            class="tag tag-style"
            :class="{ 'tech-selected': techs.includes(t) }"
            @click="toggleTech(t)"
          >
            {{ t }}
          </span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Notatki startowe</label>
        <textarea class="form-textarea" v-model="notes" placeholder="Dodatkowe uwagi, linki, hasła testowe..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Repozytorium Git</label>
        <input class="form-input" v-model="repo" placeholder="https://github.com/..." />
      </div>
      <div class="wizard-actions">
        <button class="btn btn-ghost" @click="step = 2"><ArrowLeft :size="14" /> Wstecz</button>
        <button class="btn btn-primary" @click="create"><Check :size="14" /> Utwórz projekt</button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.wizard-steps {
  display: flex;
  margin-bottom: 20px;
}
.wizard-step {
  flex: 1;
  padding: 8px;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  border-bottom: 2px solid var(--border);
}
.wizard-step.active {
  color: var(--accent2);
  border-color: var(--accent);
}
.wizard-step.done {
  color: var(--feat);
  border-color: var(--feat);
}
.wizard-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}
.wizard-actions.right {
  justify-content: flex-end;
}
.type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.type-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  text-align: center;
  cursor: pointer;
  font-size: 0.7rem;
  background: var(--bg-card2);
}
.type-opt.selected {
  border-color: var(--accent);
  background: rgba(59, 130, 246, 0.12);
  color: var(--accent2);
}
.logo-upload-area {
  display: block;
  border: 2px dashed var(--border);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  font-size: 0.78rem;
  color: var(--text-muted);
}
.logo-upload-area:hover {
  border-color: var(--accent);
  color: var(--text);
}
.logo-preview {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
}
.upload-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.color-row {
  display: flex;
  gap: 6px;
  align-items: center;
}
.color-picker {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  padding: 2px;
}
.color-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}
.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  position: relative;
  cursor: pointer;
}
.remove-swatch {
  display: none;
  position: absolute;
  top: -5px;
  right: -5px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--fix);
  color: #fff;
  font-size: 0.45rem;
  align-items: center;
  justify-content: center;
}
.color-swatch:hover .remove-swatch {
  display: flex;
}
.font-row {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}
.font-row .form-input {
  flex: 1;
}
.font-type {
  width: 120px;
}
.font-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-card2);
  border: 1px solid var(--border);
  margin-bottom: 6px;
}
.font-preview {
  font-size: 1.1rem;
}
.font-type-label {
  font-size: 0.72rem;
  color: var(--text-muted);
}
.tech-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tech-tags .tag {
  cursor: pointer;
}
.tech-selected {
  opacity: 0.4;
}
</style>
