#!/usr/bin/env bash

homedir=$HOME
root=${homedir}/dotfiles/v2
dotfiledir=${root}/dotfiles
configdir=${root}/.config

############################
# Pre Conditions
############################

touch ${homedir}/.env.work
touch ${homedir}/.env.personal
mkdir -p ~/.nvm

# Download Git Auto-Completion
curl "https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash" > ${homedir}/.git-completion.bash

############################
# Create symlinks of configuration files
############################

# list of files/folders to symlink in ${homedir}
files="bash_aliases bash_colors bash_config bash_profile bash_prompt bashrc"

# change to the dotfiles directory
echo "Changing to the ${dotfiledir} directory"
cd ${dotfiledir}
echo "...done"

# create symlinks (will overwrite old dotfiles)
for file in ${files}; do
    echo "Creating symlink to $file in home directory."
    ln -sf ${dotfiledir}/.${file} ${homedir}/.${file}
done
unset files

############################
# Install Homebrew Packages
############################
echo "Changing to the ${root} directory"
cd ${root}
echo "...done"

# Run the Homebrew Scripts
./brew_casks.sh
./brew_formulae.sh
./brew_fonts.sh


############################
# Symlink .config files
############################
echo "Changing to the ${configdir} directory"
cd ${configdir}
echo "...done"

ln -nfs ${root}/.config/alacritty ${homedir}/.config/alacritty
ln -nfs ${root}/.config/ranger ${homedir}/.config/ranger
ln -nfs ${root}/.config/nvim ${homedir}/.config/nvim

############################
# Config nvim
############################
# Install vim-plug
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'

