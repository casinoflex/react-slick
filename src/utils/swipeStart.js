import safePreventDefault from "./safePreventDefault";

export default function swipeStart(e, swipe, draggable) {
  e.target.tagName === "IMG" && safePreventDefault(e);

  if (!swipe || (!draggable && e.type.indexOf("mouse") !== -1)) return "";

  return {
    dragging: true,
    touchObject: {
      startX: e.touches ? e.touches[0].pageX : e.clientX,
      startY: e.touches ? e.touches[0].pageY : e.clientY,
      curX: e.touches ? e.touches[0].pageX : e.clientX,
      curY: e.touches ? e.touches[0].pageY : e.clientY
    }
  };
}
