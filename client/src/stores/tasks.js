import { defineStore } from "pinia";
import { apiFetch } from "../api/client";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    items: [],
    loaded: false,
  }),

  actions: {
    async fetchAll() {
      this.items = await apiFetch("/tasks");
      this.loaded = true;
    },

    async create(payload) {
      const task = await apiFetch("/tasks", { method: "POST", body: payload });
      this.items.unshift(task);
      return task;
    },

    async update(id, payload) {
      const updated = await apiFetch(`/tasks/${id}`, { method: "PUT", body: payload });
      const idx = this.items.findIndex((t) => t.id === id);
      if (idx !== -1) this.items[idx] = updated;
      return updated;
    },

    async toggleDone(task) {
      return this.update(task.id, { done: !task.done });
    },

    async remove(id) {
      await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      this.items = this.items.filter((t) => t.id !== id);
    },

    // Used when a task arrives from somewhere other than the tasks API call
    // itself — e.g. the AI chat's "dodaj zadanie" command, which creates the
    // task as a side effect of POST /chat/messages.
    addLocal(task) {
      if (this.items.some((t) => t.id === task.id)) return;
      this.items.unshift(task);
    },
  },
});
