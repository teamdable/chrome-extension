// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  }
);

chrome.tabs.onActiveChanged.addListener( function (tabId) {
  chrome.browserAction.setBadgeText({ text: "" });
  chrome.tabs.sendMessage(tabId, {"type": "widget"}, function (resp) {
    if (resp.widgets.length > 0) {
      chrome.browserAction.setBadgeText({ text: String(resp.widgets.length) });
    }
  });
});

chrome.webNavigation.onCompleted.addListener( function(details) {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    if (activeTab.id === details.tabId) {
      chrome.tabs.sendMessage(details.tabId, {"type": "widget"}, function (resp) {
        if (resp.widgets.length > 0) {
          chrome.browserAction.setBadgeText({ text: String(resp.widgets.length) });
        }
      });
    }
  });
});
