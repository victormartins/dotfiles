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

#Git auto-complete
if [ -f ~/.git-completion.bash ]; then
    source ~/.git-completion.bash
fi


############################
# Configs
############################

# Use vim keybindings on the terminal edit line
# https://unix.stackexchange.com/questions/30454/advantages-of-using-set-o-vi
set -o vi

# Set Default Editor
export EDITOR=nvim
