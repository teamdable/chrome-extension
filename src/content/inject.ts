import { css, keyframes } from 'goober';
import type { Message, Widget } from '../types';

const focused = css`
  outline: 5px solid #f00 !important;

  &:before {
    content: 'HERE!';
    position: absolute;
    padding: 5px;
    font-size: 12px;
    background: #f00;
    color: #fff;
  }
`;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWidgetInfo(el: HTMLElement, tryCount = 5): Promise<Widget> {
  const frame = el.querySelector('iframe');
  if (!frame || !el.dataset?.widget_id) {
    throw 'Maybe not a valid widget';
  }

  const isLoading = !!el.querySelector('script');
  if (isLoading) {
    if (tryCount < 1) {
      throw 'Cannot retreive the widget info';
    }

    await sleep(300);

    return await getWidgetInfo(el, tryCount - 1);
  }

  // Give time for the widget to render
  if (tryCount > 1 && (!frame.height || frame.height === '0')) {
    return await getWidgetInfo(el, tryCount - 1);
  }

  return {
    id: el.dataset.widget_id,
    url: frame.getAttribute('src') || frame.dataset.org_src || '',
    height: frame.height || '0',
    originUrl: window.location.href,
    inTopWindow: window.parent === window,
  };
}

async function findWidgets() {
  const widgetEls = document.querySelectorAll<HTMLDivElement>('[data-widget_id]');
  const widgets = (await Promise.allSettled(Array.from(widgetEls).map(getWidgetInfo)))
    .filter((result): result is PromiseFulfilledResult<Widget> => result.status === 'fulfilled')
    .map((result) => result.value);
  
  if (widgets.length > 0) {
    chrome.runtime.sendMessage<Message>({ type: 'foundWidgets', widgets });
  }
}

let activeWidgetId = '';
async function focusWidget(widgetId: string) {
  const el = document.querySelector<HTMLElement>(`[data-widget_id="${widgetId}"]`);
  if (!el) return;

  activeWidgetId = widgetId;

  el.scrollIntoView({ block: 'center' });
  el.classList.add(focused);
  for (let i=0; i < 12; i++) {
    el.classList.toggle(focused);
    await sleep(300);

    if (activeWidgetId !== widgetId) {
      el.classList.remove(focused);
      break;
    }
  }
  el.classList.remove(focused);
}

chrome.runtime.onMessage.addListener((message: Message) => {
  switch (message.type) {
    case 'focusWidget':
      if (message.origin === window.location.href) {
        focusWidget(message.id);
      }
      break;
    case 'refreshWidget':
      chrome.runtime.sendMessage<Message>({ type: 'pageRefreshed' }).then(() => findWidgets());
      break;
  }
});

if (window.top === window) {
  chrome.runtime.sendMessage<Message>({ type: 'pageRefreshed' });
}

findWidgets();
