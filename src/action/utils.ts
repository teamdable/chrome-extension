import type { Message, Widget } from '@/types';

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getWidgets() {
  const tabId = (await queryCurrentTab())?.id;
  if (!tabId) return [];

  const widgets = await chrome.runtime.sendMessage<Message, Widget[]>({ type: 'getWidgets', tabId });

  return widgets || [];
}

export async function queryCurrentTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs.length || !tabs[0].id) return null;
  
  return tabs[0];;
}

/**
 * Send message to the current tab
 * @param {Message} message Message to send
 */
export async function sendTabMessage(message: Message) {
  const tabId = (await queryCurrentTab())?.id;
  if (!tabId) return;

  await chrome.tabs.sendMessage<Message>(tabId, message);
}
