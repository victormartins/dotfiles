-- Modes
--   normal_mode = "n",
--   insert_mode = "i",
--   visual_mode = "v",
--   visual_block_mode = "x",
--   term_mode = "t",
--   command_mode = "c",

vim.g.mapleader = " "
vim.keymap.set("n", "<leader>pv", vim.cmd.Explore) -- project view (open explorer)

-- Better window navigation
vim.keymap.set("n", "<leader>h", "<C-w>h")
vim.keymap.set("n", "<leader>j", "<C-w>j")
vim.keymap.set("n", "<leader>k", "<C-w>k")
vim.keymap.set("n", "<leader>l", "<C-w>l")

-- Window resizing
vim.keymap.set("n", "<C-=>", "<C-w>=") -- equalize window sizes. Remaped since I'm using <C-w> to maximize

-- open explorer on the left
vim.keymap.set("n", "<leader>e", ":Lex 30<cr>")

-- change split. to vertical or to horizontal
vim.keymap.set("n", "<leader>th", "<C-w>t<C-w>H")
vim.keymap.set("n", "<leader>tk", "<C-w>t<C-w>K")

-- Resize split with arrows
vim.keymap.set("n", "<Up>", ":resize +2<CR>")
vim.keymap.set("n", "<Down>", ":resize -2<CR>")
vim.keymap.set("n", "<Left>", ":vertical resize -2<CR>")
vim.keymap.set("n", "<Right>", ":vertical resize +2<CR>")

-- Navigate through tabs
vim.keymap.set("n", "<C-l>", ":tabnext<cr>")
vim.keymap.set("n", "<C-h>", ":tabprevious<cr>")

-- Visual --
-- Stay in visual mode when indenting
vim.keymap.set("v", "<", "<gv", opts)
vim.keymap.set("v", ">", ">gv", opts)

-- Visual Block --
-- Move text up and down
vim.keymap.set("x", "J", ":move '>+1<CR>gv-gv", opts)
vim.keymap.set("x", "K", ":move '<-2<CR>gv-gv", opts)

