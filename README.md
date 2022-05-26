# Steps to configure a new Mac
- Install Homebrew:
  https://brew.sh

- Install git with homebrew
- Clone dotfiles repo with git to the home folder
  ```
  cd ~
  git clone https://github.com/victormartins/dotfiles.git
  ```
- Run the install script
  ```
  cd ~/dotfiles
  ./install.sh
  ```


# Post Install
- Configure Keyboard:
  - Keyboard Type: ANSI
  - Configure Language: English(US)

Check the Keybindings file and do OSX ones.
`./help/keybindings.md`


# Configure Applications
- Configure Alfred
  - I could sync with with dropbox but requires power pack $60
  - Hotkey CMD + r
  - Features > Default Results > extras: folders
- Configure Amethyst
  - Export/Import feature is pending: https://github.com/ianyh/Amethyst/issues/1217
- Configure OSX Keyboard shortcuts
- Enable Dropbox
- Get KeepassXC up and running (DB in Dropbox)
- Sync Brave Browser
- Config Email and Calendar
- Config Slack

- Copy my .shh folder from Keybase private folder
  - Login to Github
  - Configure local dotfiles folder to use ssh to connect to github
  ```bash
  git remote rm origin
  git remote add origin git@github.com:victormartins/dotfiles.git
  ```


# Configure Dev tools
## Configure NVIM
In vim, run `:checkhealth` to see with depenencies are missing.
We start by installing the depenencies:
- Install node depenencies
  ```
  npm install -g neovim
  npm install -g yarn
  ```

- Install ruby (rbenv was installed by the script)
  ```
  rbenv install -l     # check available versions
  rbenv install 2.7.2  # install a given version
  ```

- Install gem depenencies
  ```
  gem install neovim
  ```

- Configure [NVIM](NVIM)
  - Open nvim and run `:PlugInstall`




# App Store Apps

## 2DO
Sync with dropbox. Go to settings, select sync and dropbox.
Then click "link to account" and use dropbox credentials.
