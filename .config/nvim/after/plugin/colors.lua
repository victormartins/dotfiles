-- CATPPUCCIN SETTINGS ------------------------------------------------

-- Help: https://github.com/catppuccin/nvim
require("catppuccin").setup({
  flavour = "macchiato", -- (latte, frappe, macchiato, mocha)
  transparent_background = true,
  term_colors = false,
  dim_inactive = {
    enabled = true,
    shade = "dark",
    percentage = 0.15,
  },
})

vim.cmd.colorscheme "catppuccin"
vim.cmd "highlight StatusLine   cterm=none guifg=#c6d0f5 guibg=#232634"  -- active window
vim.cmd "highlight StatusLineNC cterm=none guifg=#737994 guibg=#303446"  -- background window

-- END CATPPUCCIN SETTINGS ------------------------------------------------





-- GRUVEBOX SETTINGS ------------------------------------------------

-- local colorscheme = "gruvbox"

-- local status_ok, _ = pcall(vim.cmd, "colorscheme " .. colorscheme)
-- if not status_ok then
--   vim.notify("colorscheme " .. colorscheme .. " not found!")
--   return
-- end

-- vim.g.gruvbox_contrast_dark="hard"
-- vim.g.gruvbox_number_column="bg1"
-- vim.g.gruvbox_color_column="bg1"
-- vim.g.gruvbox_vert_split="aqua"
-- vim.g.gruvbox_improved_strings=0
-- vim.g.gruvbox_italic=1

-- vim.opt.background = "dark"

-- vim.cmd "highlight StatusLine   cterm=none guifg=#B8BB26 guibg=#282828"   -- active window
-- vim.cmd "highlight StatusLineNC cterm=none guifg=#689D6A guibg=#282828"   -- background window

--END GRUVEBOX SETTINGS ---------------------------------------------

