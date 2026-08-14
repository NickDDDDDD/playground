export function setButtonSpotlightPosition(
  element: HTMLElement,
  clientX: number,
  clientY: number
) {
  const rect = element.getBoundingClientRect();

  element.style.setProperty("--button-spotlight-x", `${clientX - rect.left}px`);
  element.style.setProperty("--button-spotlight-y", `${clientY - rect.top}px`);
}
