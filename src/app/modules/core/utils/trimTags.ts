export function trimTags(text: string): string {
  const span = document.createElement('span');
  span.innerHTML = text;
  return span.textContent || span.innerText;
}
