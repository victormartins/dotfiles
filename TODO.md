- Alacritty
  - Fix opening a terminal in the same directory
    This should be handles by this keybinding, but it is not working on new mac M1
    ```
    key_bindings:
      - { key: N,        mods: Command, action: SpawnNewInstance } # Open new Alacritty window
    ```

- Keybase.io
  - Finder integration is failing to install
  "kbfuse.fs" can't be opened. OSX is blocking it.
