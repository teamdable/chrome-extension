import { styled } from 'goober';
import type { ComponentChildren } from 'preact';

type Props = {
  children: ComponentChildren;
  className?: string;
  isCompact?: boolean;
  isPrimary?: boolean;
  align?: 'auto' | 'left' | 'center' | 'right';
  title?: string;
  onClick?: () => void | Promise<void>;
};

export function Button({ children, ...props }: Props) {
  const className = [
    props.className,
    props.isCompact ? 'is-compact' : '',
    props.isPrimary ? 'is-primary' : '',
    props.align ? `align-${props.align}` : '',
  ].filter(Boolean).join(' ');

  return (
    <BaseButton onClick={props.onClick} className={className} title={props.title}>
      { children }
    </BaseButton>
  );
}

const BaseButton = styled('button')`
  display: inline-flex;
  width: 100%;
  white-space: nowrap;
  cursor: pointer;
  font-size: inherit;
  border-radius: 3px;
  background: #d0d0d0;
  color: #333;
  border: 1px solid #ccc;
  padding: 3px 5px;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #dedede;
  }

  &.is-primary {
    background: #3182ce;
    color: #fff;
    padding: 5px 10px;
    border: 1px solid #3376b5;
    &:hover {
      background: #4791d6;
    }
  }

  &.is-compact {
    border: none;
    padding: 0;
    outline: 0;
    background: transparent;
    color: #777;

    &:hover {
      text-decoration: underline;
    }
  }

  &.align-left {
    justify-content: flex-start;
  }

  &.align-right,  {
    justify-content: flex-end;
  }

  svg {
    height: 1em;
  }
`;
