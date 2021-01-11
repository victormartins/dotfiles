#!/usr/bin/env bash

homedir=$HOME
dotfiledir=${homedir}/dotfiles/v2/dotfiles

############################
# Pre Conditions
############################

touch ${homedir}/.env.work
touch ${homedir}/.env.personal

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

# Run the Homebrew Scripts
# ./brew_casks.sh
# ./brew_formulae.sh
