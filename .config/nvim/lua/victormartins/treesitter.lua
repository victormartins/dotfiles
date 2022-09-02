local status_ok, configs = pcall(require, "nvim-treesitter.configs")
if not status_ok then
  vim.notifiy("Failed to load treesitter!")
  return
end

configs.setup {
  ensure_installed = {
    "ruby",
    "javascript",
    "json",
    "yaml",
    "html",
    "scss"
  },
  sync_install = false, -- install languages synchronously (only applied to `ensure_installed`)
  ignore_install = { "phpdoc" }, -- List of parsers to ignore installing
  autopairs = {
    enable = true,
  },
  highlight = {
    enable = true, -- false will disable the whole extension
    disable = { "" }, -- list of language that will be disabled
    additional_vim_regex_highlighting = true,
  },
  rainbow = { -- for the plugin: p00f/nvim-ts-rainbow that colorises parenthesis and other wrappers
    enable = true,
    -- disable = { "jsx", "cpp" }, list of languages you want to disable the plugin for
    extended_mode = true, -- Also highlight non-bracket delimiters like html tags, boolean or table: lang -> boolean
    max_file_lines = nil, -- Do not enable for files with more than n lines, int
    -- colors = {}, -- table of hex strings
    -- termcolors = {} -- table of colour name strings
  },
  indent = { enable = false, disable = { "yaml" } },
}