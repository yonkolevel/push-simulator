import * as React from 'react';
import {
  ccDown,
  ccUp,
  padDown,
  padUp,
  selectControl,
  useAppDispatch,
  useAppState,
} from '../../libs/push2/context/PushContext';
import { ControlId, ControlType } from '../../libs/push2/controls';
import { Mode } from '../../libs/push2/core';

interface IControlProps extends React.SVGProps<SVGGElement> {
  controlId: ControlId;
  name: string | undefined;
  type: ControlType;
  color?: string;
}

const Control: React.FunctionComponent<IControlProps> = ({
  controlId,
  children,
  name,
  type,
  color,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onMouseEnter,
  onFocus,
  ...props
}) => {
  const { tapMode, notesPressed, controlsPressed, controlsState, padVelocity } =
    useAppState();
  const dispatch = useAppDispatch();

  const isTapped =
    type === ControlType.CC
      ? controlsPressed.has(controlId)
      : notesPressed.has(controlId);

  const controllerState = controlsState.get(controlId);
  const isOn = type === ControlType.CC && Boolean(controllerState?.velocity);
  const isActive = isTapped || isOn;

  const release = type === ControlType.CC ? ccUp : padUp;
  const tap = () => {
    if (type === ControlType.CC) {
      ccDown(dispatch, controlId);
    } else {
      padDown(dispatch, controlId, padVelocity);
    }
  };
  const controlName = name || 'control';
  const controlLabel = `${controlName} — ${type.toUpperCase()} ${controlId}`;
  const updateSelectedControl = () => {
    selectControl(dispatch, { name: controlName, type, id: controlId });
  };

  return (
    <g
      {...props}
      id={name}
      role="button"
      aria-label={controlLabel}
      aria-pressed={isActive}
      data-active={isActive ? 'true' : 'false'}
      tabIndex={0}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        updateSelectedControl();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        updateSelectedControl();
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        if (tapMode === Mode.MultiTap) {
          return;
        }

        if (isTapped) {
          release(dispatch, controlId);
        }
      }}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        tap();
      }}
      onMouseUp={(event) => {
        onMouseUp?.(event);
        if (tapMode === Mode.MultiTap) {
          return;
        }

        release(dispatch, controlId);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          tap();
        }
        props.onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          release(dispatch, controlId);
        }
        props.onKeyUp?.(event);
      }}
      fill={color || '#3C3C3B'}
      style={{
        cursor: 'pointer',
        opacity: isTapped ? 0.86 : 1,
        transition: 'opacity 80ms ease, filter 80ms ease, transform 80ms ease',
        filter: isActive
          ? 'brightness(1.25) drop-shadow(0 0 3px rgba(0, 210, 190, 0.8))'
          : undefined,
        transform: isTapped ? 'translateY(0.35px)' : undefined,
        ...props.style,
      }}
    >
      <title>{controlLabel}</title>
      {children}
    </g>
  );
};

export default Control;
