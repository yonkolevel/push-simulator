import {
  panicAllOff,
  sendCommonCCSweep,
  sendPadSweep,
  sendPitchBend,
  setMidiChannel,
} from './PushContext';
import {
  SendCC,
  SendCCOff,
  SendNoteOff,
  SendPitchBend,
  SetChannel,
} from '../../../../wailsjs/go/push/AbletonPush';
import { ControlId } from '../controls';

const dispatch = jest.fn();

const installWindowShim = () => {
  (globalThis as any).window = {
    setTimeout: globalThis.setTimeout.bind(globalThis),
    clearTimeout: globalThis.clearTimeout.bind(globalThis),
    localStorage: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
    },
  };
};

describe('Push context MIDI helpers', () => {
  beforeEach(() => {
    installWindowShim();
    jest.clearAllMocks();
  });

  test('clamps pitch bend values to the MIDI range before sending', () => {
    sendPitchBend(dispatch, 99_999);
    sendPitchBend(dispatch, -99_999);

    expect(SendPitchBend).toHaveBeenNthCalledWith(1, 8191);
    expect(SendPitchBend).toHaveBeenNthCalledWith(2, -8192);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        payload: expect.objectContaining({ direction: 'sent', value: 8191 }),
      })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        payload: expect.objectContaining({ direction: 'sent', value: -8192 }),
      })
    );
  });

  test('panic sends full MIDI reset including centered pitch bend', () => {
    panicAllOff(dispatch);

    expect(SendNoteOff).toHaveBeenCalledTimes(128);
    expect(SendNoteOff).toHaveBeenCalledWith(0);
    expect(SendNoteOff).toHaveBeenCalledWith(127);
    expect(SendCCOff).toHaveBeenCalledTimes(128);
    expect(SendCCOff).toHaveBeenCalledWith(0);
    expect(SendCCOff).toHaveBeenCalledWith(127);
    expect(SendCC).toHaveBeenCalledWith(123, 0);
    expect(SendPitchBend).toHaveBeenCalledWith(0);
    expect(dispatch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ direction: 'sent', value: 0 }),
      })
    );
  });

  test('releases held controls before changing MIDI channel', async () => {
    await setMidiChannel(dispatch, 3, {
      notesPressed: new Set([60 as ControlId]),
      controlsPressed: new Set([85 as ControlId]),
    });

    expect(SendNoteOff).toHaveBeenCalledWith(60);
    expect(SendCCOff).toHaveBeenCalledWith(85);
    expect(SendPitchBend).toHaveBeenCalledWith(0);
    expect(SetChannel).toHaveBeenCalledWith(3);

    const sendNoteOffMock = SendNoteOff as jest.Mock;
    const sendCCOffMock = SendCCOff as jest.Mock;
    const setChannelMock = SetChannel as jest.Mock;
    expect(sendNoteOffMock.mock.invocationCallOrder[0]).toBeLessThan(setChannelMock.mock.invocationCallOrder[0]);
    expect(sendCCOffMock.mock.invocationCallOrder[0]).toBeLessThan(setChannelMock.mock.invocationCallOrder[0]);
  });

  test('does not send extra releases when changing channel with nothing held', async () => {
    await setMidiChannel(dispatch, 4, {
      notesPressed: new Set(),
      controlsPressed: new Set(),
    });

    expect(SendNoteOff).not.toHaveBeenCalled();
    expect(SendCCOff).not.toHaveBeenCalled();
    expect(SendPitchBend).not.toHaveBeenCalled();
    expect(SetChannel).toHaveBeenCalledWith(4);
  });

  test('does not start pad sweep when already cancelled', async () => {
    const controller = new AbortController();
    controller.abort();

    await sendPadSweep(dispatch, 100, controller.signal);

    expect(SendNoteOff).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  test('does not start CC sweep when already cancelled', async () => {
    const controller = new AbortController();
    controller.abort();

    await sendCommonCCSweep(dispatch, controller.signal);

    expect(SendCCOff).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
