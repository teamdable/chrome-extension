import { render } from 'preact';
import { Popup } from './popup';

const container = document.getElementById('app');
if (container) render(<Popup />, container);
