Homebrew Tutorial: Simplify Software Installation on Mac Using This Package Manager
https://www.youtube.com/watch?v=SELYgZvAZbU


# Pre Instalation
Before installing Homebrew we need to install the **xcode** toll set.
```
xcode-select --install
```
# Instalation
Just use the link in homebrew:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Notice how this technique uses a github repository to have a shellscript that we can run locally.
This way there isn't a duplication of a script in every manual that needs to be updated.
This is actually a RUBY script :P

@ Doctor
This command can show warnings or errors but still not be a problem for us.
Read the output.
```
brew doctor
```

@ Formulae vs Casks
A Formulae is a command line application
A Cask is a desktop app

@ Find Packages
```
// Find all packages that can be installed
brew search

// Find a specific package
brew search postgres
```

@ Installing a Package
```
brew install tree
```

@ Get info about package
This will also show info on uninstalled packages, which will tell about dependencies.
```
brew info tree
```

@ Uninstall Packages
```
brew uninstall tree
```

@ Install GNU version of MAC BSD version
ex: grep --version
vs: brew info grep

```
brew install grep
ggrep --version  // brew installed version
grep  --version  // mac version
```

Notice that all commands installed this way have a "g" prefix.
To use the programs with the normal name, we need to add the "gnubin" directory to the path.
```
PATH="/usr/local/opt/grep/libexec/gnubin:$PATH"
```

@ Updating Packages
```
brew update // update all

brew outdated    // show outdated packages
brew update tree // update  specific package
brew cleanup     // remove older version of packages ( put in cron job )
```

@ Install Desktop Apps
```
brew cask info firefox    // Check info
brew cask home firefox    // Check official page
brew cask install firefox // Install
```

@ Install Packages from a different Repository
For example to install the heroku client, we need to add their repository first. 

```
brew search heroku   // will not find heroku
brew tap heroku/brew // add code (git) repository
brew search heroku   // now we will find heroku
brew install heroku  // now install it
```
















