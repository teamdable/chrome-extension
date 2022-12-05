// Message protocol for communication between the content script and the popup window.
export type Message = |
  { type: 'focusWidget', id: string, origin: string } |
  { type: 'foundWidgets', widgets: Widget[] } |
  { type: 'getWidgets', tabId: number } |
  { type: 'pageRefreshed' } |
  { type: 'refreshWidget' };

export type Widget = {
  id: string;
  url: string;
  height: string;
  originUrl: string;
  inTopWindow: boolean;
};
