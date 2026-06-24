export const SendCCOn = jest.fn();
export const SendCC = jest.fn();
export const SendCCOff = jest.fn();
export const SendNoteOn = jest.fn();
export const SendNoteOff = jest.fn();
export const SendPitchBend = jest.fn();
export const GetMIDIStatus = jest.fn(() => Promise.resolve({
  ready: true,
  livePort: 'Ableton Push 2 Live Port',
  userPort: 'Ableton Push 2 User Port',
  mode: 'live',
  channel: 1,
}));
export const SetChannel = jest.fn(() => Promise.resolve());
export const SetUserMode = jest.fn();
export const SetLiveMode = jest.fn();
export const SetScaleMode = jest.fn();
