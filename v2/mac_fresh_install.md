How I Setup a New Development Machine - Using Scripts to Automate Installs and Save Time
https://www.youtube.com/watch?v=kIdiWut8eD8


- Configure Keyboard: 
  Keyboard Type: ANSI

- Configure Language: English(US)
- Install Xcode
- Install Homebrew: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
- Get my scripts: https://github.com/victormartins/dotfiles.git

./dotfiles/v2/mac_fresh_install.sh


# Manual Steps
- Enable Dropbox
- Get KeepassXC up and running (DB in Dropbox)
- Sync Brave Browser
- Config Email and Calendar
- Config Slack
- Install NodeJS (nvm was installed by the script)
  ```
  nvm install 14
  ```
- Install node depenencies
  ```
  npm install -g neovim
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

