import { defineStore } from "pinia";
import { apiFetch } from "../api/client";

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [],
    loaded: false,
    sending: false,
    isOpen: false,
  }),

  actions: {
    async loadHistory() {
      if (this.loaded) return;
      this.messages = await apiFetch("/chat/messages");
      this.loaded = true;
    },

    async send(text) {
      this.messages.push({
        id: `local-${Date.now()}`,
        role: "user",
        text,
        createdAt: new Date().toISOString(),
      });
      this.sending = true;
      try {
        const data = await apiFetch("/chat/messages", {
          method: "POST",
          body: { text },
        });
        this.messages.push({
          id: `local-ai-${Date.now()}`,
          role: "ai",
          text: data.reply,
          createdAt: new Date().toISOString(),
        });
        return data;
      } finally {
        this.sending = false;
      }
    },

    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    toggle() {
      this.isOpen = !this.isOpen;
    },
  },
});
