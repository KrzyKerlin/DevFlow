import { defineStore } from "pinia";
import { apiFetch } from "../api/client";
import { useTasksStore } from "./tasks";

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [],
    loaded: false,
    sending: false,
    isOpen: false,
    contextProjectId: null,
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
          body: { text, contextProjectId: this.contextProjectId },
        });
        this.messages.push({
          id: `local-ai-${Date.now()}`,
          role: "ai",
          text: data.reply,
          createdAt: new Date().toISOString(),
        });
        // The backend may have created a task as a side effect (the "dodaj
        // zadanie" command) — reflect it in the tasks store immediately
        // instead of waiting for a manual reload.
        if (data.task) {
          useTasksStore().addLocal(data.task);
        }
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

    setContext(projectId) {
      this.contextProjectId = projectId;
      this.isOpen = true;
    },
    clearContext() {
      this.contextProjectId = null;
    },

    async reset() {
      await apiFetch("/chat/messages", { method: "DELETE" });
      this.messages = [];
    },
  },
});
