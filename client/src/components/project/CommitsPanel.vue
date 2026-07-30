<script setup>
import { computed } from "vue";
import { useCommitsStore } from "../../stores/commits";

const props = defineProps({
  project: { type: Object, required: true },
});

const emit = defineEmits(["add-commit"]);

const commitsStore = useCommitsStore();

const projectCommits = computed(() =>
  [...commitsStore.items]
    .filter((c) => c.projectId === props.project.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
);

function fmtDateTime(iso) {
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
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px">
      <div class="section-title" style="margin: 0">Historia commitów</div>
      <button class="btn btn-primary btn-sm" @click="emit('add-commit')">+ Dodaj commit</button>
    </div>
    <div v-if="!projectCommits.length" class="empty-state">
      <p>Brak commitów. Dodaj pierwszy!</p>
    </div>
    <div v-for="c in projectCommits" :key="c.id" class="commit-item">
      <span class="commit-hash">{{ c.hash }}</span>
      <div style="flex: 1">
        <div class="commit-msg">
          <span class="tag tag-style" :class="`tag-${c.type}`">{{ c.type }}</span>
          {{ c.message }}
        </div>
        <div v-if="c.desc" style="font-size: 0.68rem; color: var(--text-muted); margin-top: 3px">{{ c.desc }}</div>
      </div>
      <span class="commit-date">{{ fmtDateTime(c.createdAt) }}</span>
    </div>
  </div>
</template>
