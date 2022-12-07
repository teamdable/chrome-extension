import type { Message, Widget } from './types';

type TabID = number;

const widgetData: Map<TabID, Widget[]> = new Map();

chrome.runtime.onMessage.addListener(async (request: Message, sender, sendResponse) => {
  const tabId = sender.tab?.id  || (request.type === 'getWidgets' && request.tabId) || 0;

  if (!tabId) return;

  switch (request.type) {
    case 'pageRefreshed':
      widgetData.delete(tabId);
      break;
    case 'foundWidgets':
      widgetData.set(tabId, [...(widgetData.get(tabId)||[]), ...request.widgets]);
      break;
    case 'getWidgets':
      sendResponse(widgetData.get(tabId) || []);
      return;
  }

  upateBadgeText(tabId);
});

// Clear the badge text for the newly created tab
chrome.tabs.onCreated.addListener( (tab) => {
  tab.id && upateBadgeText(tab.id);
});

function upateBadgeText(tabId: TabID) {
  chrome.action.setBadgeText({
    tabId, text: '' + (widgetData.get(tabId)?.length || ''),
  });
}
