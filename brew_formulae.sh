#!/usr/bin/env bash

echo "Installing/Updating Formulaes..."

brew install neofetch
brew install neovim
brew install nvm       # Node JS version Manager
brew install exa       # ls replacement
brew install fd        # find replacement
brew install ripgrep   # find replacement
brew install jq        # JSON tool
brew install svn       # Subversion. Required to install fonts with brew
# brew install ranger  # File navigator

brew install starship  # http://starship.rs  this is the promt program

brew install zsh
brew install zplug                    # plugin manager for zsh
brew install zsh-completions
brew install zsh-syntax-highlighting
brew install fzf

brew install libyaml # dependency to install ruby
brew install rbenv
# brew install python3

brew install tree
brew install htop

brew install awscli
brew install aws-iam-authenticator
brew install kubectl                # work with kubernetes
brew install minikube               # use kubernetes locally

# Dev tools
# https://edgeguides.rubyonrails.org/development_dependencies_install.html#local-development
brew install vips                   # Rails Dependency
brew install poppler                # Rails Dependency
brew install mupdf                  # Rails Dependency
brew install ffmpeg                 # Rails Dependency
brew install imagemagick            # Rails Dependency
brew install ffmpeg                 # Rails Dependency
brew install esbuild                # Rails Dependency. Extremely fast JavaScript bundler and minifier
brew install yarn                   # Rails Dependency
brew install redis
brew install memcached
brew install postgres

# Java Stuff
# https://www.youtube.com/watch?v=dkjnY_RY75o
# brew install openjdk # Install Java OpenJDK
# brew install maven   # Java Project Management
# brew install jenv # to manage multiple java versions
# brew install openapi-generator
