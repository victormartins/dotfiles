-- https://www.youtube.com/watch?v=6F3ONwrCxMg&list=PLhoH5vyxr6Qq41NFL4GvhFp-WLd5xzIzZ
-- https://github.com/neovim/nvim-lspconfig
-- https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md

local status_ok, _ = pcall(require, "lspconfig")
if not status_ok then
  return
end

require("victormartins.lsp.lsp-installer")
require("victormartins.lsp.handlers").setup()
