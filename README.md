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

- Copy my .shh folder from Keybase private folder

# Post Install
- Configure Keyboard:
  - Keyboard Type: ANSI
  - Configure Language: English(US)

- Change mouse config: remove check of "natural" scroll


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



# Configure Dev tools
- Install NodeJS (nvm was installed by the script)
  ```
  nvm install 14
  ```
- Install node depenencies
  ```
  npm install -g neovim
  npm install -g yarn
  ```
- Install gem depenencies
  ```
  gem install neovim
  ```
- Install ruby (rbenv was installed by the script)
  ```
  rbenv install -l     # check available versions
  rbenv install 2.7.2  # install a given version
  ```

- Configure [NVIM](NVIM)
  - Open nvim and run `:PlugInstall`
