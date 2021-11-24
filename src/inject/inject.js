/* eslint-disable */

let loaded = false;
function onLoadPage() {
  const widget_els = document.querySelectorAll('[data-widget_id]');
  if (widget_els.length === 0 || loaded) return;
  loaded = true;

  let widget_count = widget_els.length;
  const widget_list = [];
  let widget_checked_els = 0;

  const done = function () {
    chrome.runtime.sendMessage(
      { widget_count, widget_list }
    );
  };

  const checkWidgetEl = function (el, tries = 5) {
    const f = el.getElementsByTagName('iframe')[0];
    const is_loading = !!el.getElementsByTagName('script')[0];
    if (f) {
      widget_list.push( {
        widget_id: el.getAttribute('data-widget_id'),
        url: f.getAttribute('src') || f.getAttribute('data-org_src'),
        height: f.height,
        org_url: window.location.href,
        is_top: window.top === window,
      } );
      widget_checked_els++;
    } else if (is_loading) {
      setTimeout(() => {
      }, 300);
    } else if (tries > 0) {
      setTimeout(() => {
        checkWidgetEl(el, tries - 1);
      }, 300);
    } else {
      widget_count--;
    }

    if (widget_checked_els === widget_count) done();
  };

  widget_els.forEach(function (el) {
    checkWidgetEl(el);
  });
}

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.type === 'focusWidget' && message.url === window.location.href) {
      var widget_id = message.widget_id;
      var widget_el = document.querySelector('[data-widget_id="' + widget_id + '"]');
      if (!widget_el) return;
      var offset_top = widget_el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo(0, offset_top - 100);

      // focus
      var cnt = 0;
      var interval_id = setInterval(function () {
        if (cnt % 2 === 0) {
          widget_el.style.outline = 'solid 5px red';
        } else {
          widget_el.style.outline = '';
        }
        cnt++;
        if (cnt > 9) clearInterval(interval_id);
      }, 500);
    } else if (message.type === 'refreshWidget') {
      loaded = false;
      onLoadPage();
    }
  }
);

if (document.readyState === 'complete')
  onLoadPage();
else
  window.addEventListener("load", function() {
    setTimeout(onLoadPage, 0);
  });

if (window.top === window && performance.navigation.type == 1) {
  chrome.runtime.sendMessage("pageRefreshed");
}
