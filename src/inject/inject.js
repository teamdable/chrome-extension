/* eslint-disable */
chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.type === 'widget' && message.url === window.location.href) {
      var widget_list = [];
      var $widgets = $('[data-widget_id]');
      $widgets.each(function () {
        widget_list.push( {
          widget_id: $(this).attr('data-widget_id'),
          url: $(this).find('iframe').attr('src') || $(this).find('iframe').attr('data-org_src'),
          height: $(this).find('iframe').height(),
          org_url: window.location.href,
        } );
      });
      sendResponse({
        widgets: widget_list
      });
    } else if (message.type === 'focus_widget' && message.url === window.location.href) {
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
);
