import { useState } from 'preact/hooks';
import { styled } from 'goober';
import { Copy, Check, ExternalLink, Search } from 'lucide-preact';
import { Widget } from '@/types';
import { Button } from './button';
import { sendTabMessage, sleep } from './utils';

type Props = {
  widgets: Widget[];
};

export function WidgetList({ widgets }: Props) {
  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>WidgetID</th>
            <th>WidgetURL</th>
            <th>Height</th>
            <th>Dashboard</th>
          </tr>
        </thead>
        <tbody>
          { widgets.length === 0 && (
            <tr>
              <td colSpan={4}><p style={{textAlign: 'center'}}>No widgets found.</p></td>
            </tr>
          ) }
          { widgets.map( ({ id, url, height, originUrl }) => (
            <tr key={id}>
              <td className="widget-id">
                <Button align="left" onClick={() => sendTabMessage({ type: 'focusWidget', id, origin: originUrl })}>
                  <Search /> {id}
                </Button>
              </td>
              <td>
                <LinkContainer>
                  <Link href={url} target="_blank">{url}</Link>
                  <CopyButton url={url} />
                </LinkContainer>
              </td>
              <td>{height}px</td>
              <td>
                <Link href={`https://admin.dable.io/redirect/widgets/${id}`} target="_blank">
                  Go <ExternalLink />
                </Link>
              </td>
            </tr>
          ) ) }
        </tbody>
      </table>
    </Container>
  );
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const icon = copied ? <Check /> : <Copy />;

  return (
    <Button
      title="Copy this widget URL"
      onClick={async () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        await sleep(1500);
        setCopied(false);
      }}
      isCompact
    >
      {icon}
    </Button>
  );
}

const Container = styled('div')`
  border: 1px solid #ccc;
  border-radius: 7px;
  padding: 10px;
  margin: 10px 0;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    vertical-align: middle;
    padding: 3px 5px;
  }

  th {
    border-bottom: 1px solid #ddd;
  }

  tr:nth-child(even) td {
    background-color: #f2f2f2;
  }

  tr:last-child td {
    border-bottom: 1px solid #ddd;
  }
`;

const LinkContainer = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const Link = styled('a')`
  display: block;
  flex-grow: 1;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  color: #00f;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 12px;
    vertical-align: middle;
  }
`;
