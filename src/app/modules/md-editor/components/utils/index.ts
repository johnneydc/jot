import {toBase64} from '../../../core/utils/base64';
import {isValidHttpUrl} from '../../../core/utils/isUrl';

export function canBeAnImage(clipboardData: DataTransfer) {
  return (clipboardData.types.includes('Files') && clipboardData.types.includes('text/html'))
    || (clipboardData.types.includes('Files') && clipboardData.files.item(0).type === 'image/png');
}

export async function insertImage(ev: ClipboardEvent) {
  const base64Img = await toBase64(ev.clipboardData.files[0]);
  document.execCommand('insertHTML', false, `<img src="${base64Img}" />`);
}

export function canBeAUrl(clipboardData: DataTransfer) {
  const text = clipboardData.getData('text/plain');
  return isValidHttpUrl(text);
}

export function insertLink(ev: ClipboardEvent) {
  let text = ev.clipboardData.getData('text/plain');
  text = `<a contenteditable="false" href="${text}" target="_blank">${text}</a>`;

  document.execCommand('insertHTML', false, text);
}

export function insertText(ev: ClipboardEvent) {
  const text = ev.clipboardData.getData('text/plain');
  document.execCommand('insertHTML', false, text);
}

export function insertTab(ev: KeyboardEvent) {
  ev.preventDefault();
  document.execCommand('insertHTML', false, '&nbsp;&nbsp;');
}

export function  parseKeyboardShortcut(ev: KeyboardEvent) {
  const keys = [];

  if (ev.ctrlKey) { keys.push('ctrl'); }
  if (ev.shiftKey) { keys.push('shift'); }

  keys.push(ev.key.toLowerCase());

  return keys.join('+');
}

export function boldSelection(ev: KeyboardEvent) {
  document.execCommand('bold');
}

export function italicizeSelection(ev: KeyboardEvent) {
  document.execCommand('italic');
}
