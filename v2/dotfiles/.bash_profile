############################
# Source Files
############################

source "$HOME/.env.personal"
source "$HOME/.env.work"

source "$HOME/.bash_config"
source "$HOME/.bash_colors"
source "$HOME/.bash_prompt"
source "$HOME/.bash_aliases"
source "$HOME/.git-completion.bash"



############################
# Configs
############################

# Use vim keybindings on the terminal edit line
# https://unix.stackexchange.com/questions/30454/advantages-of-using-set-o-vi
set -o vi

# Set Default Editor
export EDITOR=nvim


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
if [ -f ~/.git-completion.bash ]; then
    source ~/.git-completion.bash
fi
