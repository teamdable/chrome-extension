/* eslint-disable */

const widget_data = {};

chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    const tabId = sender.tab && sender.tab.id || request.tabId || null;
    if (!tabId) return;

    if (request.widget_count) {
      const frameId = sender.frameId;
      if (!widget_data[tabId]) widget_data[tabId] = {count: 0, list: []};
      widget_data[tabId].count += request.widget_count;
      widget_data[tabId].list.push(...request.widget_list);

      chrome.action.setBadgeText({
        tabId: sender.tab.id,
        text: String(widget_data[tabId].count),
      });
    } else if (request.request_widget_list) {
      sendResponse({
        widget_list: widget_data[tabId] && widget_data[tabId].list || [],
      });
    }

    // chrome.pageAction.show(sender.tab.id);
    // if (sendResponse) sendResponse();
  }
);

chrome.tabs.onCreated.addListener( function ({ tabId }) {
  chrome.action.setBadgeText({
    tabId, text: "",
  });
});
