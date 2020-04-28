#!/usr/bin/env bash

echo "Installing/Updating Cashs..."

CASKS=(
alacritty
meld
neofetch
)

brew cask install ${CASKS[@]}

echo "Complete √"
