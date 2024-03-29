#!/usr/bin/env bash

echo "Installing/Updating Casks..."

brew install --cask brave-browser
brew install --cask google-chrome
brew install --cask firefox

brew install --cask google-backup-and-sync
brew install --cask dropbox

brew install --cask keepassxc
brew install --cask alfred
brew install --cask boostnote

brew install --cask skype
brew install --cask zoom
brew install --cask slack
brew install --cask vlc
brew install --cask gimp

brew install --cask caffeine
brew install --cask amethyst
brew install --cask alacritty
brew install --cask meld
brew install --cask licecap
brew install --cask sourcetree

brew install --cask docker
brew install --cask pgadmin4
brew install --cask postman

# To install Java JDK
# To chose other java versions see https://github.com/AdoptOpenJDK/homebrew-openjdk
# https://www.youtube.com/watch?v=dkjnY_RY75o
brew install --cask adoptopenjdk   # Java JDK instalation
