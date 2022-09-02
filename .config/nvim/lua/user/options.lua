-- Variable
HOME = os.getenv("HOME")

-- When we do "vim ." to open vim in a directory, it will source any .vimrc inside that directory
vim.opt.exrc = true

-- :help options
vim.opt.termguicolors = true                    -- Enables 24-bit RGB color in the TUI

-- use blinking block cursor when editing
vim.opt.guicursor = {
  'n-v-c:block',
  'i-ci-ve:ver20-blinkwait175-blinkoff150-blinkon175',
  'r-cr-o:hor20',
}


-- tabs behaviour: https://tedlogan.com/techblog3.html
vim.opt.tabstop = 2                             -- insert 2 spaces for a tab
vim.opt.softtabstop = 2                         -- insert 2 spaces for a tab
vim.opt.shiftwidth = 2                          -- the number of spaces inserted for each indentation. use with << and >>
vim.opt.expandtab = true                        -- convert tabs to spaces
vim.opt.smartindent = true                      -- auto indentation

vim.opt.wrap = false
vim.opt.updatetime = 300                        -- faster completion (4000ms default)

vim.opt.number = true                           -- set numbered lines
vim.opt.numberwidth = 4                         -- set number column width to 2 {default 4}
vim.opt.relativenumber = true                   -- set relative numbered lines

vim.opt.hlsearch = false                        -- remove highlight after copy search
vim.opt.hidden = true                           -- keep unsaved buffers in the background
vim.opt.errorbells = false                      -- peace and quiet
vim.opt.incsearch = true

vim.opt.scrolloff = 8
vim.opt.sidescroll = 1                          -- enable horizontal scroll
vim.opt.sidescrolloff = 8                       -- always keep some chars ahead of the current cursor

vim.opt.cursorline = true                       -- highlight the current cursor line
vim.opt.colorcolumn = { 120 }
-- highlight ColorColumn ctermbg=235 guibg=#2c2d27


-- Allow background transparency
-- highlight Normal guibg=none

vim.opt.splitbelow = true                       -- force all horizontal splits to go below current window
vim.opt.splitright = true                       -- force all vertical splits to go to the right of current window

vim.opt.shortmess:append "c"                    -- Don't pass messages to |ins-completion-menu|
vim.opt.cmdheight = 2                           -- more space in the neovim command line for displaying messages
vim.opt.autoread = true                         -- Detect file changes and read them
vim.opt.confirm  = true                         -- Ask to confirm commands such "qa"

-- Backup Strategy
vim.opt.backup = false                          -- creates a backup file
vim.opt.swapfile = false                        -- creates a swapfile
vim.opt.writebackup = false                     -- if a file is being edited by another program (or was written to file while editing with another program), it is not allowed to be edited
vim.opt.undofile = true                         -- enable persistent undo
vim.opt.undodir = HOME .. '/.config/nvim/undodir'     -- undo files

vim.opt.fileencoding = "utf-8"                  -- the encoding written to a file
vim.opt.clipboard = "unnamedplus"               -- allows neovim to access the system clipboard
vim.opt.iskeyword:append "-"                    -- always words separated by - to be connected when we do selections etc. like-this

-- folding configurations
vim.opt.foldmethod='syntax'
vim.opt.foldlevel=3

-- Always show the signcolumn, otherwise it would shift the text each time
-- diagnostics appear/become resolved.
vim.opt.signcolumn='yes'


-- Highlight matching pairs of brackets. Use the '%' character to jump between them.
vim.opt.matchpairs:append "<:>"

-- Display different types of white spaces.
vim.opt.list = true
vim.opt.listchars= {
  tab = "\\›",
  trail = "•",
  extends = "#",
  nbsp = "."
}




vim.opt.completeopt = { "menuone", "noselect" } -- mostly just for cmp
vim.opt.conceallevel = 0                        -- so that `` is visible in markdown files
vim.opt.ignorecase = true                       -- ignore case in search patterns
vim.opt.mouse = "a"                             -- allow the mouse to be used in neovim
vim.opt.pumheight = 10                          -- pop up menu height
vim.opt.showmode = false                        -- we don't need to see things like -- INSERT -- anymore
vim.opt.showtabline = 2                         -- always show tabs
vim.opt.smartcase = true                        -- smart case
vim.opt.timeoutlen = 1000                       -- time to wait for a mapped sequence to complete (in milliseconds)


vim.opt.signcolumn = "yes"                      -- always show the sign column, otherwise it would shift the text each time


vim.opt.guifont = "monospace:h17"               -- the font used in graphical neovim applications
vim.cmd "set whichwrap+=<,>,[,],h,l"
vim.cmd [[set formatoptions-=cro]] -- TODO: this doesn't seem to work


-- syntax on
-- Enable file specific behaviour like syntax highlighting and indentation
-- filetype on
-- filetype plugin on
-- filetype indent on
