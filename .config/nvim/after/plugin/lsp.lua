require("mason").setup(
  {
    ui = {
      -- Whether to automatically check for new versions when opening the :Mason window.
      check_outdated_packages_on_open = true,

      -- The border to use for the UI window. Accepts same border values as |nvim_open_win()|.
      border = "none",

      icons = {
        package_installed = "✓",
        package_pending = "➜",
        package_uninstalled = "✗"
      },

      keymaps = {
        -- Keymap to expand a package
        toggle_package_expand = "<CR>",
        -- Keymap to install the package under the current cursor position
        install_package = "i",
        -- Keymap to reinstall/update the package under the current cursor position
        update_package = "u",
        -- Keymap to check for new version for the package under the current cursor position
        check_package_version = "c",
        -- Keymap to update all installed packages
        update_all_packages = "U",
        -- Keymap to check which installed packages are outdated
        check_outdated_packages = "C",
        -- Keymap to uninstall a package
        uninstall_package = "X",
        -- Keymap to cancel a package installation
        cancel_installation = "<C-c>",
        -- Keymap to apply language filter
        apply_language_filter = "<C-f>",
      },
    },
  }
)

require("mason-lspconfig").setup({
  ensure_installed = {
    "solargraph", -- Ruby
    "cssls",      -- CSS
    "html",
    "tsserver" -- JavaScript
  },
   automatic_installation = false
})

-- nvim-lspconfig -----------------------------------------------------------------------

-- HELP:
-- https://github.com/neovim/nvim-lspconfig#keybindings-and-completion

-- To debug LSP
-- vim.lsp.set_log_level("debug")

local signs = {
  { name = "DiagnosticSignError", text = "" }, -- ﮊ      
  { name = "DiagnosticSignWarn",  text = "" }, --  ﮏ    
  { name = "DiagnosticSignHint",  text = "" }, --   ﮻    ﯦ ﯧ
  { name = "DiagnosticSignInfo",  text = "" }, --        
}

for _, sign in ipairs(signs) do
  vim.fn.sign_define(sign.name, { texthl = sign.name, text = sign.text, numhl = "" })
end

local config = {
  -- disable virtual text
  virtual_text = false,
  -- show signs
  signs = {
    active = signs,
  },
  update_in_insert = true,
  underline = true,
  severity_sort = true,
  float = {
    focusable = false,
    style = "minimal",
    border = "rounded",
    source = "always",
    header = "",
    prefix = "",
  },
}

vim.diagnostic.config(config)

-- vim.lsp.handlers["textDocument/hover"] = vim.lsp.with(vim.lsp.handlers.hover, {
--   border = "rounded",
-- })

-- vim.lsp.handlers["textDocument/signatureHelp"] = vim.lsp.with(vim.lsp.handlers.signature_help, {
--   border = "rounded",
-- })


-- Mappings.
-- See `:help vim.diagnostic.*` for documentation on any of the below functions
local opts = { noremap=true, silent=true }
vim.keymap.set('n', 'gl', vim.diagnostic.open_float, opts)        -- Open the window with LSP message
vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, opts)         -- Cycle through LSP diagnostics
vim.keymap.set('n', ']d', vim.diagnostic.goto_next, opts)         -- Cycle through LSP diagnostics
vim.keymap.set('n', '<space>q', vim.diagnostic.setloclist, opts)  -- Show list of diagnostics

-- Use an on_attach function to configure LSP settings only
-- after the language server attaches to the current buffer
local on_attach = function(client, bufnr)
  if client.name == "tsserver" then
    client.resolved_capabilities.document_formatting = false
  end

  -- Enable completion triggered by <c-x><c-o>
  vim.api.nvim_buf_set_option(bufnr, 'omnifunc', 'v:lua.vim.lsp.omnifunc')

  -- Mappings.
  -- See `:help vim.lsp.*` for documentation on any of the below functions
  local buffer_options = { noremap=true, silent=true, buffer=bufnr }
  vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, buffer_options) -- NOT supported by Ruby
  vim.keymap.set('n', 'gd', vim.lsp.buf.definition, buffer_options)
  vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, buffer_options)
  vim.keymap.set('n', 'gr', vim.lsp.buf.references, buffer_options)
  vim.keymap.set('n', 'K', vim.lsp.buf.hover, buffer_options)
  vim.keymap.set('n', '<C-k>', vim.lsp.buf.signature_help, buffer_options)
  vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, buffer_options)         -- Rename methods and stuff
  vim.keymap.set('n', '<leader>D', vim.lsp.buf.type_definition, buffer_options) -- NOT supported by Ruby
  vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, buffer_options)    -- NOT supported by Ruby
  -- vim.keymap.set('n', '<leader>wa', vim.lsp.buf.add_workspace_folder, buffer_options)
  -- vim.keymap.set('n', '<leader>wr', vim.lsp.buf.remove_workspace_folder, buffer_options)
  -- vim.keymap.set('n', '<leader>wl', function()
  --   print(vim.inspect(vim.lsp.buf.list_workspace_folders()))
  -- end, buffer_options)

  -- Execute :Format to code format formatting
  vim.cmd [[ command! Format execute 'lua vim.lsp.buf.formatting()' ]]

  -- Set commands given which capabilities a given LSP supports
  if client.resolved_capabilities.document_highlight then
    -- When the cursor holds on a word, highlight all instances of the word in the buffer
    vim.cmd [[
      augroup lsp_document_highlight
        autocmd! * <buffer>
        autocmd CursorHold <buffer> lua vim.lsp.buf.document_highlight()
        autocmd CursorMoved <buffer> lua vim.lsp.buf.clear_references()
      augroup END
    ]]
  end
end

local lsp_flags = {
  -- This is the default in Nvim 0.7+
  debounce_text_changes = 150,
}

local nvim_lsp = require("lspconfig")

nvim_lsp['tsserver'].setup({
  on_attach = on_attach,
  flags = lsp_flags,
})

nvim_lsp['solargraph'].setup({
  on_attach = on_attach,
  flags = lsp_flags,
  cmd = { "solargraph", "stdio" },
  root_dir = nvim_lsp.util.root_pattern("Gemfile", ".git"),
  -- filetypes = { "ruby" },
  -- init_options = {
  --   formatting = true
  -- },
  -- settings = {
  --   solargraph = {
  --     diagnostics = true,
  -- }
})

nvim_lsp['cssls'].setup({
  on_attach = on_attach,
  flags = lsp_flags,
})

nvim_lsp['html'].setup({
  on_attach = on_attach,
  flags = lsp_flags,
})
-- end nvim-lspconfig --------------------------------------------------------------------
