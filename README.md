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
* `ln -nfs ~/dotfiles/vim/ .vim`
* `ln -nfs ~/dotfiles/vimrc .vimrc`
* `ln -nfs ~/dotfiles/bash_profile .bash_profile`
* `ln -nfs ~/dotfiles/bash_aliases .bash_aliases`
* `ln -nfs ~/dotfiles/gitconfig .gitconfig`

##Fetch submodules after cloning repo, in ~/dotfiles

* `cd ~/dotfiles`
* `git submodule update --init`
## If issues with Vim Plugins, go to ~/dotfiles/vim/bundle and git clone the repos of empty folders. Will resolve this.