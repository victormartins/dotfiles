set hlsearch              "Highlight searches
set incsearch             "Incremental search
set ls=2                  "Always show status line in all windows
set autoindent            "Auto indent on new line
set expandtab             "tabs to spaces
set tabstop=2             "Tabs are 2 spaces in width
set shiftwidth=2          "Autodindent to 2 spaces width
set scrolloff=10          "Start scrolling when 10 lines close to the bottom
set ruler                 "Shows current file position
set statusline=%<%f\ %h%m%y%r%=%-14.(%l,%c%V%)\ %P
set cursorcolumn          "Highlight current column
set cursorline            "Highlight current row
set novisualbell          "Don't shake the screen
set number                "show line numbers
set title                 "Change title of window based on file
set ttyfast               "Smoother display for fast terminals
set hidden                "Don't close buffers when changing files
set wildchar=<Tab>        "Tab expands wildcards
set fileencoding=utf8     "Unicode man
set nocompatible          "Get all of vim's awesomeness
set backspace=indent,eol,start "Allow backspacing over tabs end of lines and start of insert
set wildmenu              "as above
set wildmode=longest:full,full "Better tab completion of filenames (like bash)
set foldmethod=syntax    "Enable folding based on syntax
"Allows use of %/ for current directory
cmap %/ %:p:h/

"256 coloras
if $COLORTERM == 'gnome-terminal'
  set t_Co=256
endif
set background=dark       "Tell vim I'm using a dark background
"colorscheme desert
colorscheme Tomorrow-Night-Bright-Simon-Maximus
syntax on                 "syntax highlighting

"custom colors
hi CursorLine ctermbg=236 term=none cterm=none
hi clear CursorColumn
hi CursorColumn ctermbg=236
hi LineNr ctermfg=90 ctermbg=233 
"hi LineNr ctermfg=237 ctermbg=233
hi Visual cterm=bold cterm=italic
hi MatchParen cterm=bold ctermfg=cyan "color of matching  paterns () [] ...

"indent guides
let g:indent_guides_auto_colors = 0
let g:indent_guides_guide_size = 1
let g:indent_guides_start_level = 1
hi IndentGuidesEven ctermbg=black
hi IndentGuidesOdd ctermbg=grey

let mapleader = ","       "Leader from \ to , - means stuff like Command-T plugin becomes ,+t rather than \+t
set nobackup
set writebackup
set backupdir=~/.vim/tmp  "Store backups in same dir
set directory=~/.vim/tmp  "Store swps in same dir
set ignorecase
set smartcase
set sidescrolloff=5

filetype plugin indent on "Detect filetype indentations
"Custom filetypes
au BufNewFile,BufRead *.ctp set filetype=html
au BufNewFile,BufRead *.ui set filetype=ruby
au BufNewFile,BufRead Fudgefile set filetype=ruby

"Tabs and traling space highlighting and sorting out - :retab sorts out tabs
set list lcs=tab:·⁖,trail:¶
"autocmd BufWritePre * :%s/\s\+$//e

"Emacs indenting
map <Tab> ==

"NERDTree toggle
map <c-T> :NERDTreeToggle<CR>
map <leader>r :NERDTreeFind<cr>
let NERDTreeWinPos='right'

"Easy file switching
nnoremap <leader>. <C-^>

"Ctrl-P fuzzy matching
let g:ctrlp_map = '<leader><leader>'
let g:ctrlp_working_path_mode = 0

:command! -range=% Snip '<,'>w! /tmp/snippet
:command! Unsnip r /tmp/snippet

:command! Q qa!
:command! WQ wqa!

" Get yankring out of the way
let g:yankring_history_dir = '~/.vim/tmp'

" Set minium window size
set wmh=0

" " Mapeamos las teclas + y - para que nos maximice o minimice la ventana
" actual
if bufwinnr(1)
  map [ <C-W>=
  map ] <C-W>_
endif

"http://vim.wikia.com/wiki/VimTip906
nnoremap <F2> :set invpaste paste?<CR>
set pastetoggle=<F2>
set showmode

"Toggle Highlights  http://stackoverflow.com/questions/657447/vim-clear-last-search-highlighting
nnoremap <F3> :set hlsearch!<CR>

"Toggle text wrap
nnoremap <F4> :set wrap!<CR>

