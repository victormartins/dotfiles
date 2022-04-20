#!/usr/bin/env bash

echo "Running Installation Script"

# Symlink dotfiles
ln -nsf $HOME/dotfiles/.profile  $HOME/.profile
ln -nsf $HOME/dotfiles/.zprofile $HOME/.zprofile
ln -nsf $HOME/dotfiles/.config $HOME/.config
  
# Download Git Auto-Completion for Bash/ZSH
curl "https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash" > $HOME/.git-completion.bash

