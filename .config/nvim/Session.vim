let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/dotfiles/.config/nvim
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +1 init.lua
badd +24 help.md
badd +1 lua/victormartins/init.lua
badd +1 lua/victormartins/remap.lua
badd +30 lua/victormartins/plugins.lua
badd +5 after/plugin/telescope.lua
badd +1 after/plugin/packer.lua
badd +7 after/plugin/colour.lua
badd +4 after/plugin/colors.lua
badd +3 after/plugin/treesitter.lua
argglobal
%argdel
$argadd init.lua
edit after/plugin/treesitter.lua
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 30 + 31) / 62)
exe 'vert 1resize ' . ((&columns * 136 + 102) / 204)
exe '2resize ' . ((&lines * 29 + 31) / 62)
exe 'vert 2resize ' . ((&columns * 67 + 102) / 204)
exe '3resize ' . ((&lines * 29 + 31) / 62)
exe 'vert 3resize ' . ((&columns * 68 + 102) / 204)
exe 'vert 4resize ' . ((&columns * 67 + 102) / 204)
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 24 - ((23 * winheight(0) + 15) / 30)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 24
normal! 0
lcd ~/dotfiles/.config/nvim
wincmd w
argglobal
if bufexists(fnamemodify("~/dotfiles/.config/nvim/lua/victormartins/plugins.lua", ":p")) | buffer ~/dotfiles/.config/nvim/lua/victormartins/plugins.lua | else | edit ~/dotfiles/.config/nvim/lua/victormartins/plugins.lua | endif
if &buftype ==# 'terminal'
  silent file ~/dotfiles/.config/nvim/lua/victormartins/plugins.lua
endif
balt ~/dotfiles/.config/nvim/lua/victormartins/init.lua
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 30 - ((16 * winheight(0) + 14) / 29)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 30
normal! 09|
lcd ~/dotfiles/.config/nvim
wincmd w
argglobal
if bufexists(fnamemodify("~/dotfiles/.config/nvim/lua/victormartins/remap.lua", ":p")) | buffer ~/dotfiles/.config/nvim/lua/victormartins/remap.lua | else | edit ~/dotfiles/.config/nvim/lua/victormartins/remap.lua | endif
if &buftype ==# 'terminal'
  silent file ~/dotfiles/.config/nvim/lua/victormartins/remap.lua
endif
balt ~/dotfiles/.config/nvim/lua/victormartins/init.lua
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 2 - ((1 * winheight(0) + 14) / 29)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 2
normal! 0
lcd ~/dotfiles/.config/nvim
wincmd w
argglobal
if bufexists(fnamemodify("~/dotfiles/.config/nvim/help.md", ":p")) | buffer ~/dotfiles/.config/nvim/help.md | else | edit ~/dotfiles/.config/nvim/help.md | endif
if &buftype ==# 'terminal'
  silent file ~/dotfiles/.config/nvim/help.md
endif
balt ~/dotfiles/.config/nvim/init.lua
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 19 - ((18 * winheight(0) + 30) / 60)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 19
normal! 03|
lcd ~/dotfiles/.config/nvim
wincmd w
2wincmd w
exe '1resize ' . ((&lines * 30 + 31) / 62)
exe 'vert 1resize ' . ((&columns * 136 + 102) / 204)
exe '2resize ' . ((&lines * 29 + 31) / 62)
exe 'vert 2resize ' . ((&columns * 67 + 102) / 204)
exe '3resize ' . ((&lines * 29 + 31) / 62)
exe 'vert 3resize ' . ((&columns * 68 + 102) / 204)
exe 'vert 4resize ' . ((&columns * 67 + 102) / 204)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
