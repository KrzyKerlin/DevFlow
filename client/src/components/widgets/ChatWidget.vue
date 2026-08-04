<script setup>
import { ref, nextTick, watch } from "vue";
import { useChatStore } from "../../stores/chat";
import { useToastStore } from "../../stores/toast";

const chatStore = useChatStore();
const toast = useToastStore();

const input = ref("");
const messagesEl = ref(null);

const suggestions = [
  "jakie mam zadania?",
  "przeterminowane zadania",
  "statystyki",
  "który projekt ma najwięcej zadań?",
  "co na dziś?",
];

watch(
  () => chatStore.isOpen,
  (isOpen) => {
    if (isOpen) chatStore.loadHistory();
  },
);

watch(
  () => chatStore.messages.length,
  () => {
    nextTick(() => {
      if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    });
  },
);

async function send(text) {
  const value = (text ?? input.value).trim();
  if (!value) return;
  input.value = "";
  try {
    await chatStore.send(value);
  } catch (err) {
    toast.show(err.message, "error");
  }
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
}
</script>

<template>
  <div v-if="chatStore.isOpen" class="floating-widget chat-widget" style="right: 10px; width: 340px">
    <div class="chat-header">
      <div class="chat-avatar">🤖</div>
      <div style="flex: 1">
        <div class="chat-name">Synapse AI</div>
        <div class="chat-status">Online</div>
      </div>
      <button class="modal-close" @click="chatStore.close()">✕</button>
    </div>

    <div ref="messagesEl" class="chat-messages">
      <div v-if="!chatStore.messages.length" class="chat-msg ai">
        <div class="chat-bubble">
          Cześć! 👋 Jestem Synapse AI. Zapytaj mnie o projekty, zadania, kolory, terminy — albo napisz np.
          "dodaj zadanie: popraw stopkę priorytet wysoki termin jutro".
        </div>
      </div>
      <div v-for="m in chatStore.messages" :key="m.id" class="chat-msg" :class="m.role">
        <div class="chat-bubble" style="white-space: pre-line">{{ m.text }}</div>
        <div class="chat-time">{{ fmtTime(m.createdAt) }}</div>
      </div>
      <div v-if="chatStore.sending" class="chat-msg ai">
        <div class="chat-bubble">…</div>
      </div>
    </div>

    <div class="chat-suggestions">
      <div v-for="s in suggestions" :key="s" class="chat-suggestion-chip" @click="send(s)">{{ s }}</div>
    </div>

    <div class="chat-input-area">
      <input
        class="chat-input"
        v-model="input"
        placeholder="Zapytaj o projekty, zadania..."
        @keydown.enter="send()"
      />
      <button class="chat-send" @click="send()">➤</button>
    </div>
  </div>
  <button v-else class="chat-launcher" title="AI Asystent" @click="chatStore.toggle()">
    🤖
  </button>
</template>

<style scoped>
.chat-widget {
  bottom: calc(var(--taskbar-h) + 10px);
  display: flex;
  flex-direction: column;
  max-height: 520px;
}
.chat-launcher {
  position: fixed;
  bottom: calc(var(--taskbar-h) + 10px);
  right: 10px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--refactor));
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: var(--shadow);
  z-index: 850;
}
.chat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-card2);
  border-radius: 16px 16px 0 0;
}
.chat-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--refactor));
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-name {
  font-size: 0.82rem;
  font-weight: 700;
}
.chat-status {
  font-size: 0.65rem;
  color: var(--feat);
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 120px;
  max-height: 320px;
}
.chat-msg {
  max-width: 85%;
}
.chat-msg.ai {
  align-self: flex-start;
}
.chat-msg.user {
  align-self: flex-end;
}
.chat-bubble {
  padding: 9px 12px;
  border-radius: 12px;
  font-size: 0.78rem;
  line-height: 1.45;
}
.chat-msg.ai .chat-bubble {
  background: var(--bg-card2);
  border: 1px solid var(--border);
  border-bottom-left-radius: 4px;
}
.chat-msg.user .chat-bubble {
  background: var(--accent);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.chat-time {
  font-size: 0.6rem;
  color: var(--text-muted);
  margin-top: 3px;
  padding: 0 4px;
}
.chat-msg.user .chat-time {
  text-align: right;
}
.chat-suggestions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 0 12px 8px;
}
.chat-suggestion-chip {
  font-size: 0.65rem;
  padding: 4px 9px;
  border-radius: 99px;
  background: var(--bg-card2);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
}
.chat-suggestion-chip:hover {
  border-color: var(--accent);
  color: var(--accent2);
}
.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--border);
}
.chat-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-card2);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: inherit;
  font-size: 0.78rem;
  outline: none;
}
.chat-send {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
  background: var(--accent);
  border: none;
  color: #fff;
  cursor: pointer;
}
</style>
