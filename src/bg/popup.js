function popup() {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"type": "widget"}, function (resp) {
      var widgets = document.getElementById("widgets");
      widgets.innerHTML = tmpl("widgets_tmpl", resp);

      var elements = document.getElementsByClassName("widget_id");
      for (var i=0; i<elements.length; i++) {
        elements[i].addEventListener('click', function (e) {
          e.preventDefault();
          focusWidget(this.getAttribute('data-widget_id'));
        });
      }
    });
  });
}

function focusWidget(widget_id) {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"type": "focus_widget",
        "widget_id": widget_id}, function (resp) {
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  popup();
});
