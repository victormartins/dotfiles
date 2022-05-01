local fn = vim.fn

-- Automatically install packer
local install_path = fn.stdpath "data" .. "/site/pack/packer/start/packer.nvim"
if fn.empty(fn.glob(install_path)) > 0 then
  PACKER_BOOTSTRAP = fn.system {
    "git",
    "clone",
    "--depth",
    "1",
    "https://github.com/wbthomason/packer.nvim",
    install_path,
  }
  print "Installing packer close and reopen Neovim..."
  vim.cmd [[packadd packer.nvim]]
end

-- Autocommand that reloads neovim whenever you save the plugins.lua file
vim.cmd [[
  augroup packer_user_config
    autocmd!
    autocmd BufWritePost plugins.lua source <afile> | PackerSync
  augroup end
]]

-- Use a protected call so we don't error out on first use
local status_ok, packer = pcall(require, "packer")
if not status_ok then
  vim.notifiy("Packer not found! Ignoring Plugins")
  return
end

-- Have packer use a popup window
packer.init {
  display = {
    open_fn = function()
      return require("packer.util").float { border = "rounded" }
    end,
  },
}

-- Install your plugins here
-- Do :Packer<tab> to see more Packer commands.
-- Press q to exit the packer window
return packer.startup(function(use)
  use "wbthomason/packer.nvim"                -- Have packer manage itself
  use "nvim-lua/popup.nvim"                   -- An implementation of the Popup API from vim in Neovim
  use "nvim-lua/plenary.nvim"                 -- Useful lua functions used ny lots of plugins

  use 'ellisonleao/gruvbox.nvim'              -- Color scheme
  use 'jeffkreeftmeijer/vim-numbertoggle'     -- toggle relative numbering in vim when buffer not in focus
  use 'mbbill/undotree'                       -- Non linear undos
  use 'tpope/vim-repeat'                      -- Repeat some plugins with . command (eg: vim-surround)
  use 'tpope/vim-commentary'                  -- Use gcc to comment out a line or gc to comment a selection in visual mode
  use 'tpope/vim-eunuch'                      -- Delete, Rename, Move files and much more
  use 'tpope/vim-obsession'                   -- Save vim sessions before exit
  use 'tpope/vim-surround'                    -- Custom Operator - Handle the surrounding things :)
  use 'kana/vim-textobj-user'                 -- Custom Text Object - How to create custom text objects. (Dependency for vim-textobj-ruby)
  -- use 'rhysd/vim-textobj-ruby'              -- Custom Text Object - Ruby (r)
  use 'michaeljsmith/vim-indent-object'          -- Custom Text Object - indentations (i)

  -- use 'sheerun/vim-polyglot'                     -- Language Support for the Win
  -- use 'tpope/vim-rails'                          -- Language Support for Rails
  -- use 'tpope/vim-endwise'                        -- Language Support for Ruby - close end blocks automagically

  use 'ap/vim-css-color'                         -- Language Support - show CSS Colors
  -- use 'mattn/emmet-vim'                          -- Language Support Emmet
  use 'tpope/vim-fugitive'                       -- git integration
  -- use 'neoclide/coc.nvim', {'branch': 'release'} -- The power of Completion
  use 'vimwiki/vimwiki'                          -- VimWiki FTW
  use 'schickling/vim-bufonly'                   -- Close all others buffers with :BOnly
  use 'brooth/far.vim'                           -- Find and replace project wide
  use 'justinmk/vim-sneak'                       -- Quickly goto text
  use 'honza/vim-snippets'                       -- Snippts FTW
  use 'tribela/vim-transparent'                  -- Allow background transparency( :TransparentToggle)

  use 'mzlogin/vim-markdown-toc'              -- Language Support for Markdown - Generate table of contents
  use({ "iamcco/markdown-preview.nvim", run = "cd app && npm install", setup = function() vim.g.mkdp_filetypes = { "markdown" } end, ft = { "markdown" }, }) -- Preview for Markdown TODO: Install nodejs and yarn


  -- Code Completion "cmp" plugins
  -- This is the core plugin: https://github.com/hrsh7th/nvim-cmp
  -- When we add cmd plugins, adjust the "sources" section in the cmd.lua script,
  -- When we add cmd plugins, adjust the "vim_item.menu" section in the cmd.lua script,
  -- since this is where we define the order of the completions we see in the menu.
  -- We can find new plugins here:
  -- https://github.com/hrsh7th/nvim-cmp/wiki/List-of-sources
  -- https://github.com/topics/nvim-cmp
  use "hrsh7th/nvim-cmp" -- The completion plugin
  use "hrsh7th/cmp-buffer" -- buffer completions
  use "hrsh7th/cmp-path" -- path completions
  use "hrsh7th/cmp-cmdline" -- cmdline completions
  use "saadparwaiz1/cmp_luasnip" -- snippet completions
  use "hrsh7th/cmp-nvim-lsp"
  use "hrsh7th/cmp-nvim-lua"

  -- snippets (the cmd plugin above is configured to use the LuaSnip plugin bellow)
  use "L3MON4D3/LuaSnip" --snippet engine
  use "rafamadriz/friendly-snippets" -- a collection of snippets for different languages

  -- LSP
  use "neovim/nvim-lspconfig" -- enable LSP
  use "williamboman/nvim-lsp-installer" -- simple to use language server installer

  -- Telescope
  use "nvim-telescope/telescope.nvim"
  use 'nvim-telescope/telescope-media-files.nvim'

  -- Automatically set up your configuration after cloning packer.nvim
  -- Put this at the end after all plugins
  if PACKER_BOOTSTRAP then
    require("packer").sync()
  end
end)
