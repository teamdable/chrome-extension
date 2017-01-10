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
    } else if (message.type === 'focus_widget') {
      var widget_id = message.widget_id;
      var $widget = $('[data-widget_id="' + widget_id + '"]');
      window.scrollTo(0, $widget.offset().top - 100);

      // focus
      var cnt = 0;
      var interval_id = setInterval(function () {
        if (cnt % 2 === 0) {
          $widget.css('outline', 'solid 5px red');
        } else {
          $widget.css('outline', '');
        }
        cnt++;
        if (cnt > 9) clearInterval(interval_id);
      }, 500);
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
