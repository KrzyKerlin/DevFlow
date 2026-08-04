<script setup>
import { useChatStore } from "../../stores/chat";

const chatStore = useChatStore();
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
</style>
