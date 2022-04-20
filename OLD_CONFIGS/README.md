My Dotfiles
========

These are my dotfiles for my bash profile, aliases and vim plugins. If you wish to use this has a starting point, I suggest forking the repo and then amending gitconfig to use your own details.

Usage
========

##Clone into ~/dotfiles/

* `cd ~/`
* `git clone git@github.com:victormartins/dotfiles.git`

##Then add symlinks in your ~/ directory

* `cd ~/`
* `ln -nfs ~/dotfiles/rspec ~/.rspec`
* `ln -nfs ~/dotfiles/Gemfile ~/Gemfile`
* `ln -nfs ~/dotfiles/bash_profile ~/.bash_profile`
* `ln -nfs ~/dotfiles/bash_aliases ~/.bash_aliases`
* `ln -nfs ~/dotfiles/gitconfig ~/.gitconfig`
* `ln -nfs ~/dotfiles/gitignore_global ~/.gitignore_global`
* `ln -nfs ~/dotfiles/vimrc ~/.vimrc`
* `ln -nfs ~/dotfiles/rubocop ~/.rubocop`
* `ln -nfs ~/dotfiles/reek ~/.reek`

##Fetch submodules after cloning repo, in ~/dotfiles

* `cd ~/dotfiles`
* `git submodule update --init`
