function timestamp {
	echo $(date +"%Y_%m_%d__%H_%M_%S")
}

##bash
alias vim='nvim'
alias cls='clear'
alias ..='cd ..'
alias ls='ls -CGAop -lh'
alias lls='clear && ls'
alias f='find . -name '
alias today='date +%a_%b\(%d-%m-%Y\)'
alias wtf='top -o mem -O cpu -n 20'

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
alias fu='file="fudge_build.$(timestamp).log" && touch $file && echo $(GIT_BRANCH) >> $file && echo $(git log -1)  >> $file && echo '' >> $file && echo '' >> $file && time bundle exec fudge build | tee -a $file && mv $file ~/Desktop/Temp/__fudge_builds__'
alias start_jobs='be rake jobs:work'
alias start_redis='redis-server /usr/local/etc/redis.conf'
alias start_pdf_server='be fuji_pdf_server start' # run inside the host_app folder
alias start_mysql='mysql.server start' # start mysql
alias start_rabbitmq='rabbitmq-server'

#Git
alias gitk='gitk 2>/dev/null' #to remove the error messages of gitk on osx
alias gst='clear; git status -sb'
alias gitclean='git clean -f -d -n' #DOn't delete, just show the problems
alias gitcleany='git clean -f -d' #Delete at will
alias gc='git commit'
alias gco='git checkout'
alias gpl='git pull'
alias gp='git push'
alias gpu='git push upstream'
alias gb='git branch'
alias gl="git log  --pretty=format:'%Cgreen %ci %Cred %h %Cgreen(%Cblue%an%Cgreen) %Creset %s'"
alias gls="git log  --oneline -10"

#Docker
alias d-c='docker-compose'

alias testjs='RAILS_ENV=test be rake spec:javascripts'


#Others
alias htk='echo "ps aux | grep ruby kill -9 xxxxx"'

## Mine
alias spec_1='clear && be rspec spec/ --order defined --fail-fast  -f p'
alias g2_today='cd ./$(date "+%Y%m%d")'
alias g2_google='cd /Volumes/Backups/GoogleDrive'
alias kata='cp -r ./starting_point ./$(date "+%Y%m%d") && echo created ./$(date "+%Y%m%d") && g2_today && git add . && git commit -m "start"'
alias kkata='kata && code . && be guard'
alias jskata='kata && npm install && code . && npx jest --watch'

#
## Project specific
alias g2_work='cd ~/Work'
alias g2_projects='cd ~/Projects'
alias g2_katas_ruby='g2_projects && cd ./katas/ruby_katas/'


## WORK
alias sanity_check='./cleanup.sh && ./setup.sh && ./test.sh'

alias docker_boot='./script/docker/boot.sh --pull --clean --bundle'

alias egs_proxy_master_sync='cd ~/work/UK/s1_event_gateway_proxy/ && git checkout master && git pull origin master'
alias egs_service_master_sync='cd ~/work/UK/s1_event_gateway_service/ && git checkout master && git pull origin master'
alias egs_worker_master_sync='cd ~/work/UK/s1_event_gateway_worker/ && git checkout master && git pull origin master'
alias egs_status_worker_master_sync='cd ~/work/UK/s1_event_gateway_status_worker/ && git checkout master && git pull origin master'
alias egs_master_sync='egs_service_master_sync && egs_proxy_master_sync && egs_worker_master_sync && egs_status_worker_master_sync'
alias egs_start_central_test='docker_clean && ./script/boot.sh --pull --clean central gac ms1uk cbc'
alias egs_start_central_test_us='docker_clean && ./script/boot.sh --pull --clean central gac ms1us cbc'
alias egs_start_central_test_events='docker_clean && ./script/boot.sh --pull --clean central gac ms1uk event cbc'

alias egs_logs_proxy='docker logs proxy-event-gateway -f'
alias egs_logs_service='docker logs service-event-gateway -f'
alias egs_logs_worker='docker logs worker-event-gateway -f'
alias egs_logs_status='docker logs worker-status-event_gateway -f'

alias g2_sage_docs='cd ~/Google\ Drive/_SAGE'
