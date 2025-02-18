declare module "react-piano" {
  import React from "react";

  export interface NoteRange {
    first: number;
    last: number;
  }

  export interface KeyboardShortcut {
    key: string;
    midiNumber: number;
  }

  export interface KeyboardShortcutConfig {
    firstNote: number;
    lastNote: number;
    keyboardConfig: KeyboardShortcut[];
  }

  export interface PianoProps {
    noteRange: NoteRange;
    onPlayNote?: (midiNumber: number) => void;
    onStopNote?: (midiNumber: number) => void;
    width?: number;
    keyboardShortcuts?: KeyboardShortcut[];
  }

  export class Piano extends React.Component<PianoProps> {}

  export class KeyboardShortcuts {
    static create(config: KeyboardShortcutConfig): KeyboardShortcut[];
    static HOME_ROW: KeyboardShortcut[];
  }
}
