<script setup>
import { ref } from "vue";
import { useProjectsStore } from "../../stores/projects";
import { useToastStore } from "../../stores/toast";

const props = defineProps({
  project: { type: Object, required: true },
});

const projectsStore = useProjectsStore();
const toast = useToastStore();

const colorPicker = ref("#3b82f6");
const fontName = ref("");
const fontType = ref("primary");
const techName = ref("");

function save(payload) {
  return projectsStore.update(props.project.id, payload).catch((err) => toast.show(err.message, "error"));
}

function addColor() {
  if (props.project.colors.includes(colorPicker.value)) return;
  save({ colors: [...props.project.colors, colorPicker.value] });
}
function removeColor(color) {
  save({ colors: props.project.colors.filter((c) => c !== color) });
}

function addFont() {
  if (!fontName.value.trim()) {
    toast.show("Podaj nazwę czcionki!", "error");
    return;
  }
  save({ fonts: [...props.project.fonts, { name: fontName.value.trim(), type: fontType.value }] });
  fontName.value = "";
}
function removeFont(index) {
  const fonts = [...props.project.fonts];
  fonts.splice(index, 1);
  save({ fonts });
}

function addTech() {
  const tech = techName.value.trim();
  if (!tech) {
    toast.show("Podaj nazwę technologii!", "error");
    return;
  }
  if (props.project.techs.some((t) => t.toLowerCase() === tech.toLowerCase())) {
    toast.show("Ta technologia jest już dodana!", "info");
    return;
  }
  save({ techs: [...props.project.techs, tech] });
  techName.value = "";
}
function removeTech(index) {
  const techs = [...props.project.techs];
  techs.splice(index, 1);
  save({ techs });
}

function onLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => save({ logo: ev.target.result });
  reader.readAsDataURL(file);
}
function removeLogo() {
  save({ logo: null });
}
</script>

<template>
  <div>
    <div class="section-title">Logo projektu</div>
    <div class="logo-row">
      <div class="logo-preview">
        <img v-if="project.logo" :src="project.logo" alt="" />
        <span v-else>{{ project.emoji || "🚀" }}</span>
      </div>
      <label class="btn btn-ghost btn-sm">
        Zmień logo
        <input type="file" accept="image/*" style="display: none" @change="onLogoUpload" />
      </label>
      <button v-if="project.logo" class="btn btn-ghost btn-sm" @click="removeLogo">Usuń obraz</button>
    </div>

    <div class="section-title" style="margin-top: 20px">Kolory projektu</div>
    <div class="color-swatches" style="margin-bottom: 10px">
      <div v-for="c in project.colors" :key="c" class="color-swatch" :style="{ background: c }" :title="c">
        <div class="remove-swatch" @click="removeColor(c)">✕</div>
      </div>
    </div>
    <div class="color-row">
      <input type="color" v-model="colorPicker" class="color-picker" />
      <button class="btn btn-ghost btn-sm" @click="addColor">+ Dodaj kolor</button>
    </div>

    <div class="section-title" style="margin-top: 20px">Czcionki</div>
    <div v-for="(f, i) in project.fonts" :key="i" class="font-item">
      <div>
        <div class="font-preview" :style="{ fontFamily: f.name }">{{ f.name }}</div>
        <div class="font-type-label">{{ f.type }}</div>
      </div>
      <button class="btn btn-ghost btn-sm" @click="removeFont(i)">🗑</button>
    </div>
    <div class="font-row">
      <input class="form-input" v-model="fontName" placeholder="Dodaj czcionkę..." />
      <select class="form-select font-type" v-model="fontType">
        <option value="primary">Główna</option>
        <option value="secondary">Dodatkowa</option>
        <option value="mono">Monospace</option>
      </select>
      <button class="btn btn-ghost btn-sm" @click="addFont">+</button>
    </div>

    <div class="section-title" style="margin-top: 20px">Technologie</div>
    <div class="tech-tags" style="margin-bottom: 10px">
      <span
        v-for="(t, i) in project.techs"
        :key="t"
        class="tag tag-style"
        style="cursor: pointer"
        title="Kliknij, żeby usunąć"
        @click="removeTech(i)"
      >
        {{ t }} ✕
      </span>
    </div>
    <div class="font-row">
      <input class="form-input" v-model="techName" placeholder="np. Vue.js, Laravel..." @keydown.enter="addTech" />
      <button class="btn btn-ghost btn-sm" @click="addTech">+</button>
    </div>
  </div>
</template>

<style scoped>
.logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-preview {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--bg-card2);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  overflow: hidden;
  flex-shrink: 0;
}
.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.color-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 8px;
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
.color-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
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
.font-row {
  display: flex;
  gap: 6px;
}
.font-row .form-input {
  flex: 1;
}
.font-type {
  width: 120px;
}
.tech-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
</style>
