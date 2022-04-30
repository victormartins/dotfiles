#!/usr/bin/env zsh

echo "Running Installation Script"

# This is a place to add personal ENV variables
touch $HOME/.env.personal

# Make a folder for nvm if it does not exist
mkdir -p $HOME/.nvm

# Symlink dotfiles
ln -nsf $HOME/dotfiles/.zprofile  $HOME/.zprofile
ln -nsf $HOME/dotfiles/.gitconfig $HOME/.gitconfig
ln -nsf $HOME/dotfiles/.config    $HOME/.config

# Download Git Auto-Completion for Bash/ZSH
curl "https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash" > $HOME/.git-completion.bash

# Run the Homebrew Scripts
sh -c '$HOME/dotfiles/brew_casks.sh'
sh -c '$HOME/dotfiles/brew_formulae.sh'
sh -c '$HOME/dotfiles/brew_fonts.sh'

############################
# Config nvim
############################
# Install vim-plug
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'


# Install nodejs with nvm (installed with brew_formulae)
## We start by loading the nvm tool (node version manager)
[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh
## Now we install Node JS LTL version (Long Term Support)
nvm install --lts
