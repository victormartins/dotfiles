# Enable colors and change prompt:
autoload -U colors && colors	# Load colors
eval "$(starship init zsh)"
# PS1="%B%{$fg[red]%}[%{$fg[yellow]%}%n%{$fg[green]%}@%{$fg[blue]%}%M %{$fg[magenta]%}%~%{$fg[red]%}]%{$reset_color%}$%b "
setopt autocd		# Automatically cd into typed directory.
stty stop undef		# Disable ctrl-s to freeze terminal.
setopt interactive_comments

# History in cache directory:
HISTSIZE=10000000
SAVEHIST=10000000
HISTFILE=~/.cache/zsh/history

# Allow setting the terminal title
DISABLE_AUTO_TITLE="true"
function set-title() {
  echo -en "\e]2;$@\a"
}
