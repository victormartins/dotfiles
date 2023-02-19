-- Plugins installed with packer
-- https://github.com/wbthomason/packer.nvim

vim.cmd [[packadd packer.nvim]]

-- Autocommand that reloads neovim whenever you save the plugins.lua file
vim.cmd [[
  augroup packer_user_config
    autocmd!
    autocmd BufWritePost plugins.lua source <afile> | PackerSync
  augroup end
]]


return require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'

  -- Fuzzy Finder
  use {
    'nvim-telescope/telescope.nvim', tag = '0.1.1',
    requires = { {'nvim-lua/plenary.nvim'} }
  }

  -- Color Schemes
  -- use 'ellisonleao/gruvbox.nvim'
  use { "catppuccin/nvim", as = "catppuccin" }

  -- Treesiter
   use("nvim-treesitter/nvim-treesitter", {run = ":TSUpdate"})
   use("nvim-treesitter/playground")

  -- Quick file navigation
  use("theprimeagen/harpoon")

  use 'jeffkreeftmeijer/vim-numbertoggle'     -- toggle relative numbering in vim when buffer not in focus
  use 'mbbill/undotree'                       -- Non linear undos
  use 'tpope/vim-repeat'                      -- Repeat some plugins with . command (eg: vim-surround)
  use 'tpope/vim-commentary'                  -- Use gcc to comment out a line or gc to comment a selection in visual mode
  use 'tpope/vim-eunuch'                      -- Delete, Rename, Move files and much more
  use 'tpope/vim-obsession'                   -- Save vim sessions before exit
  use 'tpope/vim-surround'                    -- Custom Operator - Handle the surrounding things :)
  use 'kana/vim-textobj-user'                 -- Custom Text Object - How to create custom text objects. (Dependency for vim-textobj-ruby)
  use 'michaeljsmith/vim-indent-object'          -- Custom Text Object - indentations (i)

  use 'sickill/vim-pasta'                     -- Automatically indent code when copy pasting
  use 'RRethy/nvim-treesitter-endwise'        -- Language Support for Ruby, Lua, Vimscript, Bash to close blocks automagically

  use 'ap/vim-css-color'                         -- Language Support - show CSS Colors
  use 'schickling/vim-bufonly'                   -- Close all others buffers with :BOnly
  use 'brooth/far.vim'                           -- Find and replace project wide
  use 'justinmk/vim-sneak'                       -- Quickly goto text
  use 'tribela/vim-transparent'                  -- Allow background transparency( :TransparentToggle)
  use 'mattn/emmet-vim'
  use 'szw/vim-maximizer'			-- Maximize the current window

  -- use 'vimwiki/vimwiki'                          -- VimWiki FTW
  -- use 'honza/vim-snippets'                       -- Snippts FTW

  -- Git
  use 'tpope/vim-fugitive'                    -- git integration
  use 'tpope/vim-rhubarb'                     -- enable :GBrowse to open git stuff in the browser
  use 'rhysd/git-messenger.vim'               -- See commit messages for line under the cursor
  use "lewis6991/gitsigns.nvim"               -- show git decorations on the left
  use "github/copilot.vim"                    -- magic bot says hi :)

  -- Markdown
  use 'mzlogin/vim-markdown-toc'              -- Language Support for Markdown - Generate table of contents
  use({ "iamcco/markdown-preview.nvim", run = "cd app && npm install", setup = function() vim.g.mkdp_filetypes = { "markdown" } end, ft = { "markdown" }, }) -- Preview for Markdown TODO: Install nodejs and yarn


end)
