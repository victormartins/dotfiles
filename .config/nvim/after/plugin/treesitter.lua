-- Configuration help
-- https://github.com/nvim-treesitter/nvim-treesitter

require'nvim-treesitter.configs'.setup {
  ensure_installed = { 
    "ruby", "javascript", "typescript", "json", "yaml", "html", "scss",
    "lua", "vim", "help" 
  },

  -- Install parsers synchronously (only applied to `ensure_installed`)
  sync_install = false,

  -- Automatically install missing parsers when entering buffer
  auto_install = true,


  highlight = {
    enable = true, -- code highlighting

    -- Setting this to true will run `:h syntax` and tree-sitter at the same time.
    -- which will have a performance hit
    additional_vim_regex_highlighting = false,
  },
}

local parser_config = require "nvim-treesitter.parsers".get_parser_configs()
parser_config.ruby.filetype_to_parsername = { "ruby" }
