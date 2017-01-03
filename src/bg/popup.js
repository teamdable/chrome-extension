function popup() {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"type": "widget"}, function (resp) {
      console.log(resp);
      var widgets = document.getElementById("widgets");
      widgets.innerHTML = tmpl("widgets_tmpl", resp);
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("check_widget").addEventListener("click", popup);
});
