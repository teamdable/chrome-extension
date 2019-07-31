function popup() {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    var tabId = activeTab.id;
    document.querySelector("#test_inarticle").addEventListener('click', testInarticle);
    chrome.webNavigation.getAllFrames({ tabId: tabId }, function(details) {
      var widgets = [];
      var resp_count = 0;
      var frame_count = details.length;

      details.forEach(function (d) {
        chrome.tabs.sendMessage(tabId, {
          "type": "widget",
          url: d.url,
        }, function (resp) {
          resp_count++;

          if (resp && resp.widgets.length > 0) {
            resp.widgets.forEach(function (w) {
              w.is_top = d.parentFrameId === -1;
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

function testInarticle() {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      "type": "test_inarticle",
      "url": activeTab.url,
      "auto_scroll": document.querySelector('#auto_scroll').checked,
      "vertical_ratio": document.querySelector('#vertical_ratio').value,
      "step_delay": document.querySelector('#step_delay').value,
    }, function (resp) {
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
