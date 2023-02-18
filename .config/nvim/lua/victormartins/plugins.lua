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
end)
