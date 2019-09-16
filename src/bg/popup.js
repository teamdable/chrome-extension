/* eslint-disable */
function popup() {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    var tabId = activeTab.id;
    chrome.webNavigation.getAllFrames({ tabId: tabId }, function(details) {
      var widgets = [];
      var urls = [];
      var resp_count = 0;

      details.sort( (a, b) => a.frameId - b.frameId );
      var uniq_pages = details.filter( (d) => {
        if (urls.indexOf(d.url) > -1) return false;
        urls.push(d.url);
        return true;
      });

      var frame_count = details.length;

      uniq_pages.forEach(function (d) {
        chrome.tabs.sendMessage(tabId, {
          "type": "widget",
          url: d.url,
        }, function (resp) {
          resp_count++;

          if (resp && resp.widgets.length > 0) {
            resp.widgets.forEach(function (w) {
              w.is_top = d.parentFrameId === -1;
              if (w.url) {
                w.debug_url = w.url + (w.url.indexOf('?') > -1 ? '&' : '?') + '&debug=1';
              } else {
                w.url = '';
                w.debug_url = '';
              }
            });
            widgets = widgets.concat(resp.widgets);
          }

          if (frame_count === details.length) {
            var el = document.getElementById("widgets");
            el.innerHTML = tmpl("widgets_tmpl", { widgets: widgets });

            var elements = document.getElementsByClassName("widget_id");
            for (var i=0; i<elements.length; i++) {
              elements[i].addEventListener('click', function (e) {
                e.preventDefault();
                focusWidget(
                  this.getAttribute('data-widget_id'),
                  this.getAttribute('data-org_url')
                );
              });
            }
          }
        });
      });
    });
  });
}

function focusWidget(widget_id, org_url) {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      "type": "focus_widget",
      "widget_id": widget_id,
      "url": org_url,
    }, function (resp) {
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  popup();
});
