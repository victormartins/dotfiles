############################
# Source Files
############################

source "$HOME/.env.personal"
source "$HOME/.env.work"

if [ $(echo $SHELL) = '/bin/bash' ]; then
source "$HOME/.bash_config"
source "$HOME/.bash_prompt"
fi

source "$HOME/.shell_colors"
source "$HOME/.shell_aliases"
# source "$HOME/.git-completion.bash"    ## TODO: see what git-completion zhs supports



############################
# Configs
############################

# Use vim keybindings on the terminal edit line
# https://unix.stackexchange.com/questions/30454/advantages-of-using-set-o-vi
set -o vi

# Set Default Editor
export EDITOR=nvim

# To link Rubies to Homebrew's OpenSSL 1.1 (which is upgraded) add the following
export RUBY_CONFIGURE_OPTS="--with-openssl-dir=$(brew --prefix openssl@1.1)"
# Fixes to install ruby versions with rbenv
export RUBY_CFLAGS="-Wno-error=implicit-function-declaration"
export PKG_CONFIG_PATH="/usr/local/opt/libffi/lib/pkgconfig"
export LDFLAGS="-L/usr/local/opt/libffi/lib"
export CPPFLAGS="-I/usr/local/opt/libffi/include"



############################
# NodeJS
# https://github.com/nvm-sh/nvm
############################
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion


############################
# Other App Configs
############################

# Enable rbenv ruby versions
eval "$(rbenv init -)"

#Git auto-complete
# if [ -f ~/.git-completion.bash ]; then
#     source ~/.git-completion.bash
# fi

if [ -f ~/.shell_local ]; then
    source ~/.shell_local
fi


############################
# util functions
############################
# set the window title. eg: set-title my special window
set-title() {
  TITLE="$@"
  PROMPT_COMMAND='echo -ne "\033]0;${TITLE}\007"'
}
