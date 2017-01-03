chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.type === 'widget') {
      var $widgets = $('[data-widget_id]');
      var widget_list = [];
      $widgets.each(function () {
        widget_list.push( {
          widget_id: $(this).attr('data-widget_id'),
          url: $(this).find('iframe').attr('src'),
          height: $(this).find('iframe').height(),
        } );
      });
      sendResponse({
        widgets: widget_list
      });
    }
  }
)


chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
    }
  }, 10);
});
