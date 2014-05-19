# to reload:  source ~/.bash_profile

export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"
export PATH="/Applications/Postgres.app/Contents/MacOS/bin:$PATH"

#Set Default Editor
export EDITOR=vim
source ~/dotfiles/git-completion.bash

f [ -f ~/.bash_aliases ]; then
  . ~/.bash_aliases
fi

#------------------------------------------------------------------------------- 
#               Customize Prompt
# http://net.tutsplus.com/tutorials/other/how-to-customize-the-command-prompt/


## COMMANDS

#\d: Date
#\h: Host
#\n: Newline
#\t: Time
#\u: Username
#\W: Current working directory
#\w: Full path to current directory

## COLORS

txtblk='\e[0;30m' # Black - Regular
txtred='\e[0;31m' # Red
txtgrn='\e[0;32m' # Green
txtylw='\e[0;33m' # Yellow
txtblu='\e[0;34m' # Blue
txtpur='\e[0;35m' # Purple
txtcyn='\e[0;36m' # Cyan
txtwht='\e[0;37m' # White

bldblk='\e[1;30m' # Black - Bold
bldred='\e[1;31m' # Red
bldgrn='\e[1;32m' # Green
bldylw='\e[1;33m' # Yellow
bldblu='\e[1;34m' # Blue
bldpur='\e[1;35m' # Purple
bldcyn='\e[1;36m' # Cyan
bldwht='\e[1;37m' # White

unkblk='\e[4;30m' # Black - Underline
undred='\e[4;31m' # Red
undgrn='\e[4;32m' # Green
undylw='\e[4;33m' # Yellow
undblu='\e[4;34m' # Blue
undpur='\e[4;35m' # Purple
undcyn='\e[4;36m' # Cyan
undwht='\e[4;37m' # White

bakblk='\e[40m'   # Black - Background
bakred='\e[41m'   # Red
badgrn='\e[42m'   # Green
bakylw='\e[43m'   # Yellow
bakblu='\e[44m'   # Blue
bakpur='\e[45m'   # Purple
bakcyn='\e[46m'   # Cyan
bakwht='\e[47m'   # White

txtrst='\e[0m'    # Text Reset




bind "set completion-ignore-case on" #make the bash autocomplete case insensitive
bind "set show-all-if-ambiguous on"  #shows all options if ambiguouse, avoiding to press tab twice

# fix ls colors on OSX
export LSCOLORS=gxfxbEaEBxxEhEhBaDaCaD #https://github.com/seebi/dircolors-solarized/issues/10

## CUSTOMIZATION
function GIT_BRANCH {
  local GIT_BRANCH=$(git branch 2>&1 | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
  if [ ${#GIT_BRANCH} != 0 ]; then
#    ruby_rails_versions
     printf "${txtwht} [${bldylw}%s${bldwht}] ${txtrst}" "$GIT_BRANCH"
  fi
}

function ruby_rails_versions {
  local RUBY_VERSION=$(ruby -e 'p RUBY_VERSION')
  local RAILS_VERSION=$(rails -v)
  printf "${txtpur}Ruby %s %s${txtrst} " "${RUBY_VERSION}" "${RAILS_VERSION}"
}

print_before_the_prompt () {
  NOW=$(date "+%Y-%m-%d-%H:%M:%S")

  printf "\n[$NOW] $bldylw%s: $bldgrn%s $txtrst" "$USER" "$PWD"
  GIT_BRANCH
  printf "\n"
}

PROMPT_COMMAND=print_before_the_prompt 
PS1='>>'

export PATH=/usr/local/bin:$PATH
