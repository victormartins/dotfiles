TODO: #! /usr/bin bash


copy my .ssh (encrypt/decrypt)
-> encrypted repository :)


# install homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

==> Next steps:
    echo 'eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)' >> /home/musashi/.bash_profile
    eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
    sudo pacman -S base-devel
    brew install gcc

    ==> Caveats
	isl@0.18 is keg-only, which means it was not symlinked into /home/linuxbrew/.linuxbrew,
	because this is an alternate version of another formula.

	For compilers to find isl@0.18 you may need to set:
	  export LDFLAGS="-L/home/linuxbrew/.linuxbrew/opt/isl@0.18/lib"
	  export CPPFLAGS="-I/home/linuxbrew/.linuxbrew/opt/isl@0.18/include"

	For pkg-config to find isl@0.18 you may need to set:
	  export PKG_CONFIG_PATH="/home/linuxbrew/.linuxbrew/opt/isl@0.18/lib/pkgconfig"

	==> Summary
	🍺  /home/linuxbrew/.linuxbrew/Cellar/isl@0.18/0.18: 81 files, 6.4MB
	==> Installing gcc
	==> Pouring gcc-5.5.0_7.x86_64_linux.bottle.1.tar.gz
	==> Creating the GCC specs file: /home/linuxbrew/.linuxbrew/Cellar/gcc/5.5.0_7/lib/gcc/x86_64-unknown-linux-gnu/5.5.0/specs
	🍺  /home/linuxbrew/.linuxbrew/Cellar/gcc/5.5.0_7: 1,351 files, 173MB
	==> Caveats
	==> isl@0.18
	isl@0.18 is keg-only, which means it was not symlinked into /home/linuxbrew/.linuxbrew,
	because this is an alternate version of another formula.

	For compilers to find isl@0.18 you may need to set:
	  export LDFLAGS="-L/home/linuxbrew/.linuxbrew/opt/isl@0.18/lib"
	  export CPPFLAGS="-I/home/linuxbrew/.linuxbrew/opt/isl@0.18/include"

	For pkg-config to find isl@0.18 you may need to set:
	  export PKG_CONFIG_PATH="/home/linuxbrew/.linuxbrew/opt/isl@0.18/lib/pkgconfig"


./brew_formulae.sh






  mkdir ~/.nvm

Add the following to /home/musashi/.bash_profile or your desired shell
configuration file:

  export NVM_DIR="$HOME/.nvm"
  [ -s "/home/linuxbrew/.linuxbrew/opt/nvm/nvm.sh" ] && . "/home/linuxbrew/.linuxbrew/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/home/linuxbrew/.linuxbrew/opt/nvm/etc/bash_completion.d/nvm" ] && . "/home/linuxbrew/.linuxbrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

You can set $NVM_DIR to any location, but leaving it unchanged from
/home/linuxbrew/.linuxbrew/opt/nvm will destroy any nvm-installed Node installations
upon upgrade/reinstall.








sudo pacman -S keepassxc

# install vim plug: https://github.com/junegunn/vim-plug
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'




# I need to install rbenv before loading the zshrc script since it is a dependency
# Maybe I can do an if statement? if which rbenv ....

.zshrc -> /home/musashi/dotfiles/v2/dotfiles/.zprofile
