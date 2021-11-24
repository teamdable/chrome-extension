/* eslint-disable */

function getWidgetsHtml(widgets) {
  let t = `
<table>
  <thead>
    <tr>
      <th>WidgetID</th>
      <th>WidgetURL</th>
      <th>Height</th>
      <th>Dashboard</th>
    </tr>
  </head>
  <tbody>
`;
  if (widgets.length > 0) {
    for (var i=0; i<widgets.length; i++) {
      const w = widgets[i];
      t += `
        <tr>
          <td>
      `;
      if (w.is_top) {
        t += `
        <a href="#" class="widget_id"
          data-widget_id="${w.widget_id}"
          data-org_url="${w.org_url}"
          data-is_top="${w.is_top}"
        >${w.widget_id}</a>
        `;
      } else {
        t += `
        ${w.widget_id}<br />
        (in frame)
        `;
      }
      t += `
          </td>
          <td><a href="${w.debug_url}" class="url" target="_blank">
              ${w.debug_url}</a></td>
          <td>${w.height}px</td>
          <td><a href="https://admin.dable.io/redirect/widgets/${w.widget_id}" target="_blank">Go</a></td>
        </tr>
      `;
    }
  } else {
    t += `
      <tr>
        <td colspan="4" style="text-align:center">No widget installed.</td>
      </tr>
    `;
  }
  t += `
  </tbody>
</table>
  `;
  return t;
}

function popup() {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    const activeTab = tabs[0];
    const tabId = activeTab.id;

    chrome.runtime.sendMessage(
      { request_widget_list: true, tabId },
      function ({ widget_list }) {
        widget_list.forEach(function (w) {
          if (w.url) {
            w.debug_url = w.url + (w.url.indexOf('?') > -1 ? '&' : '?') + '&debug=1';
          } else {
            w.url = '';
            w.debug_url = '';
          }
        });

        const el = document.getElementById("widgets");
        el.innerHTML = getWidgetsHtml(widget_list);

        const elements = document.getElementsByClassName("widget_id");
        for (let i=0; i<elements.length; i++) {
          elements[i].addEventListener('click', function (e) {
            e.preventDefault();
            focusWidget(
              this.getAttribute('data-widget_id'),
              this.getAttribute('data-org_url')
            );
          });
        }
      }
    );
  });
}

function focusWidget(widget_id, org_url) {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      "type": "focus_widget",
      "widget_id": widget_id,
      "url": org_url,
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  popup();
});

document.getElementById("check_widget").addEventListener("click", function() {
  popup();
});
