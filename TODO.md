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


- [ ] LSP works for CSS and JS but not for Ruby in the EASOL project?
  - !! The issue seems to be a conflict with rubocop versions.
    Mason will install the latest version of the gems which then conflicts widn the ones
    specified in the project Gemfile.lock
    - Relates to this issue: https://github.com/castwide/solargraph/issues/479
    - The is an attempt to specify the rubocop version but was not able to make it work:
      https://github.com/castwide/solargraph#rubocop-version
- [ ] Better JS auto complete/documentation? getElementById ...
- [ ] Better CSS auto complete/documentation?

- [ ] dotfiles/.gitconfig
  How to have a home/work version?
  - [ ] email is different
  - [ ] home folder is different (victor.martins vs victormartins)
