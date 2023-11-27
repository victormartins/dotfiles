-- Help
-- :help lspconfig-keybindings
-- https://github.com/VonHeikemen/lsp-zero.nvim/blob/v1.x/doc/md/lsp.md

local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})


-- (Optional) Configure lua language server for neovim
lsp.nvim_workspace()

lsp.ensure_installed({
  "tsserver",   -- JavaScript
  "solargraph", -- Ruby
  "cssls",      -- CSS
  "html"
})

-------------------------------------------------------
--
-- local cmp = require('cmp')
-- local cmp_select = {behavior = cmp.SelectBehavior.Select}
-- local cmp_mappings = lsp.defaults.cmp_mappings({
--   ['<C-j>'] = cmp.mapping.select_prev_item(cmp_select),
--   ['<C-k>'] = cmp.mapping.select_next_item(cmp_select),
--   ['<C-y>'] = cmp.mapping.confirm({ select = true }),
--   ["<C-Space>"] = cmp.mapping.complete(),
-- })


-------------------------------------------------------
-- Configure Language Servers


-- lsp.configure('tsserver', {
--   on_attach = function(client, bufnr)
--     print('hello tsserver')
--   end,
--   settings = {
--     completions = {
--       completeFunctionCalls = true
--     }
--   }
-- })


-- lsp.set_preferences({
--     suggest_lsp_servers = false,
--     sign_icons = {
--         error = 'E',
--         warn = 'W',
--         hint = 'H',
--         info = 'I'
--     }
-- })


lsp.on_attach(function(client, bufnr)
  print('LSP Attached')

  local opts = { noremap=true, silent=true, buffer=bufnr }

  vim.keymap.set("n", "gd", function() vim.lsp.buf.definition() end, opts)
  vim.keymap.set("n", "K", function() vim.lsp.buf.hover() end, opts)
  vim.keymap.set("n", "<leader>vws", function() vim.lsp.buf.workspace_symbol() end, opts)
  vim.keymap.set("n", "<leader>vd", function() vim.diagnostic.open_float() end, opts)
  vim.keymap.set("n", "[d", function() vim.diagnostic.goto_next() end, opts)
  vim.keymap.set("n", "]d", function() vim.diagnostic.goto_prev() end, opts)
  vim.keymap.set("n", "<leader>vca", function() vim.lsp.buf.code_action() end, opts)
  vim.keymap.set("n", "<leader>vrr", function() vim.lsp.buf.references() end, opts)
  vim.keymap.set("n", "<leader>vrn", function() vim.lsp.buf.rename() end, opts)
  vim.keymap.set("i", "<C-h>", function() vim.lsp.buf.signature_help() end, opts)
end)


  local lsp_flags = {
    -- This is the default in Nvim 0.7+
    debounce_text_changes = 150,
  }

  local nvim_lsp = require("lspconfig")

  nvim_lsp['tsserver'].setup{
      flags = lsp_flags,
  }

  nvim_lsp['solargraph'].setup{
    flags = lsp_flags,
    cmd = { "solargraph", "stdio" },
    root_dir = nvim_lsp.util.root_pattern("Gemfile", ".git"),
  }


lsp.setup()



--------------------------------------------------------
---- Configure Diagnostics

vim.diagnostic.config({
  virtual_text = true,
  signs = true,
  update_in_insert = true
})

-- local signs = {
--   { name = "DiagnosticSignError", text = "" }, -- ﮊ      
--   { name = "DiagnosticSignWarn",  text = "" }, --  ﮏ    
--   { name = "DiagnosticSignHint",  text = "" }, --   ﮻    ﯦ ﯧ
--   { name = "DiagnosticSignInfo",  text = "" }, --        
-- }

-- for _, sign in ipairs(signs) do
--   vim.fn.sign_define(sign.name, { texthl = sign.name, text = sign.text, numhl = "" })
-- end

-- vim.diagnostic.config({
--   virtual_text = true,
--   signs = signs,
-- })

-- vim.diagnostic.config({
--   virtual_text = true,
--   signs = true,
--  -- update_in_insert = false,
--  -- underline = true,
--  -- severity_sort = false,
--  -- float = true,

--  -- disable virtual text
--  virtual_text = false,
--  -- show signs
--  signs = {
--    active = signs,
--  },
--  update_in_insert = true,
--  underline = true,
--  severity_sort = true,
--  float = {
--    focusable = false,
--    style = "minimal",
--    border = "rounded",
--    source = "always",
--    header = "",
--    prefix = "",
--  },
--})
