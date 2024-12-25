export const getBySelector = (selector: string, id: string) =>
  document.querySelector(`[${selector}="${id}"]`);

export const getCenter = (element: HTMLElement) => {
  const { x, y, width, height } = element.getBoundingClientRect();

  return {
    x: x + width / 2,
    y: y + height / 2
  };
}