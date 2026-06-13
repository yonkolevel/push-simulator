import {
  panicAllOff,
  sendCommonCCSweep,
  sendPadSweep,
  sendPitchBend,
} from './PushContext';
import {
  SendCC,
  SendCCOff,
  SendNoteOff,
  SendPitchBend,
} from '../../../../wailsjs/go/push/AbletonPush';

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
