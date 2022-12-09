import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { setup, styled } from 'goober';
import { Search } from 'lucide-preact';
import { Widget } from '@/types';
import { Button } from './button';
import { WidgetList } from './widget-list';
import { getWidgets, sendTabMessage, sleep } from './utils';

setup(h);

export function Popup() {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  // Load widgets when the popup is opened.
  useEffect(() => {
    sendTabMessage({type: 'refreshWidget'}).then(() => sleep(10)).then(getWidgets).then(setWidgets);
  }, []);

  return (
    <>
      <Container>
        <Button
          onClick={async () => {
            await sendTabMessage({type: 'refreshWidget'});
            await sleep(100);
            getWidgets().then(setWidgets);
          }}
          isPrimary
        >
          <Search /> Find all widgets in the current page
        </Button>
        <Small>
          * Try refresh when the result doesn't look good
        </Small>
      </Container>
      <WidgetList widgets={ widgets } />
      <Footer>
        Powered by
        <img src="./dable-logo.svg" />
      </Footer>
    </>
  );
}

const Container = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Small = styled('small')`
  display: inline-block;
  white-space: nowrap;
  color: #878787;
`

const Footer = styled('footer')`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  img {
    height: 1.5rem;
  }
`;
