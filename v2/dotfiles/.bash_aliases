function todaystr {
  echo $(date "+%Y%m%d")
}

alias nvim='nvim'
alias cls='clear'
alias ..='cd ..'
alias ls='ls -CGAop -lh'
alias lls='clear && ls'
alias f='find . -name '
alias today='date +%a_%b\(%d-%m-%Y\)'
alias wtf='top -o mem -O cpu -n 20'

alias be='bundle exec'
alias g2_today="cd ./$(todaystr)"
alias kata='cp -r ./starting_point ./$(todaystr) && echo created ./$(todaystr) && g2_today && git add . && git commit -m "start"'
alias kkata='kata && code . && be guard'
alias jskata='kata && npm install && code . && npx jest --watch'


# Show/hide hidden files in Finder
alias dot_show="defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder"
alias dot_hide="defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder"


#Git
alias gst='clear; git status -sb'
alias gitclean='git clean -f -d -n' #DOn't delete, just show the problems
alias gitcleany='git clean -f -d' #Delete at will
alias gco='git checkout'
alias gl="git log  --pretty=format:'%Cgreen %ci %Cred %h %Cgreen(%Cblue%an%Cgreen) %Creset %s'"
alias gls="git log  --oneline -10"
alias glg="git log --graph --decorate --pretty=oneline --abbrev-commit --all --date=local"
