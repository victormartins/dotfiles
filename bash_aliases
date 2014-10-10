time_stamp=$(date +"%Y_%m_%d_%S")

##bash
alias cls='clear'
alias ls='ls -CGaop'
alias lls='clear && ls -CGaop'
alias f='find . -name '

## #Ruby & Rails¶
alias rr_migrate='bundle exec rake db:migrate && bundle exec rake db:migrate RAILS_ENV=test' #using && will only run the next command if the first passes
alias rr_checkup='bundle exec cucumber; bundle exec rspec' #using ; will run the next command even if the first fails
alias rr_pry='pry -r ./config/environment'
alias be='bundle exec'
alias rspec='bundle exec rspec'
alias ss='bundle exec rails server thin'  #start server
alias sg="bundle exec guard"              #start guard
alias stf='bundle exec rspec'              #run tests
alias smt="bundle exec rake db:migrate RAILS_ENV=test"
alias rmglock='find . -name *.lock -exec rm -rf {} \;' #Remove gemfile.lock recursively
alias fu='time bundle exec fudge build | tee ~/Desktop/Temp/__fudge_builds__/fudge_build.$time_stamp.log'

#Git
alias gitk='gitk 2>/dev/null' #to remove the error messages of gitk on osx
alias gst='clear; git status -sb'
alias gitclean='git clean -f -d -n' #DOn't delete, just show the problems
alias gitcleany='git clean -f -d' #Delete at will

#Others

## Project specific
alias g2_sopt='cd ~/Documents/SAGE/code/PT/sageone_pt'
alias g2_mypt='cd ~/Documents/SAGE/code/PT/mysageone_pt'
alias g2_sopt_id='cd ~/Documents/SAGE/code/PT/sageone_sageid'

alias g2_sop='cd ~/Documents/SAGE/code/clones/sop'
alias g2_fuji='cd ~/Documents/SAGE/code/clones/project_fuji'

alias g2_migos='cd ~/Documents/Projects/migos'

alias g2_nft='cd ~/Documents/SAGE/code/BR/nfe_tools'
alias g2_nfe='cd ~/Documents/SAGE/code/BR/nfe'

alias g2_extra='cd ~/Documents/SAGE/code/UK/sage_one_advanced'
alias g2_myuk='cd ~/Documents/SAGE/code/UK/mysageone_uk'

alias _rm_gemfile_locks='g2_sopt; rm Gemfile.lock ; rm host_app/Gemfile.lock; rm sopt_extensions/Gemfile.lock'
