import { onMounted, onUnmounted } from "vue";

// Makes an absolutely-positioned element draggable within its offset parent.
// A small movement threshold stops accidental drags from swallowing clicks.
export function useDraggable(elRef, onDrop) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let origX = 0;
  let origY = 0;

  function onMouseDown(e) {
    if (e.button !== 0) return;
    if (e.target.closest("button")) return;

    dragging = false;
    startX = e.clientX;
    startY = e.clientY;
    origX = elRef.value.offsetLeft;
    origY = elRef.value.offsetTop;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!dragging && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      dragging = true;
      elRef.value.classList.add("dragging");
    }

    if (dragging) {
      const parent = elRef.value.offsetParent;
      const maxX = parent.offsetWidth - elRef.value.offsetWidth;
      const maxY = parent.offsetHeight - elRef.value.offsetHeight;
      elRef.value.style.left = `${Math.max(0, Math.min(maxX, origX + dx))}px`;
      elRef.value.style.top = `${Math.max(0, Math.min(maxY, origY + dy))}px`;
    }
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    if (dragging) {
      elRef.value.classList.remove("dragging");
      onDrop(parseInt(elRef.value.style.left), parseInt(elRef.value.style.top));
    }
  }

  onMounted(() => elRef.value?.addEventListener("mousedown", onMouseDown));
  onUnmounted(() => elRef.value?.removeEventListener("mousedown", onMouseDown));
}
