#!/usr/bin/env bash

echo "Installing/Updating Cashs..."

CASKS=(
tmux
alacritty
meld
neofetch
)

brew cask install ${CASKS[@]}

echo "Complete √"
