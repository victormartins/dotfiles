local opts = { noremap = true, silent = true }

local term_opts = { silent = true }

-- Shorten function name
local keymap = vim.api.nvim_set_keymap

--Remap space as leader key
keymap("", "<Space>", "<Nop>", opts)
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Modes
--   normal_mode = "n",
--   insert_mode = "i",
--   visual_mode = "v",
--   visual_block_mode = "x",
--   term_mode = "t",
--   command_mode = "c",

-- Normal --
-- Better window navigation
keymap("n", "<leader>h", "<C-w>h", opts)
keymap("n", "<leader>j", "<C-w>j", opts)
keymap("n", "<leader>k", "<C-w>k", opts)
keymap("n", "<leader>l", "<C-w>l", opts)

-- open explorer on the left
keymap("n", "<leader>e", ":Lex 30<cr>", opts)

-- change split. to vertical or to horizontal
keymap("n", "<leader>th", "<C-w>t<C-w>H", opts)
keymap("n", "<leader>tk", "<C-w>t<C-w>K", opts)

-- Resize split with arrows
keymap("n", "<Up>", ":resize +2<CR>", opts)
keymap("n", "<Down>", ":resize -2<CR>", opts)
keymap("n", "<Left>", ":vertical resize -2<CR>", opts)
keymap("n", "<Right>", ":vertical resize +2<CR>", opts)

-- when Yanking always keep the same value on the register instead of overiding when pasting over
keymap("v", "p", '"_dP', opts)

-- Visual --
-- Stay in visual mode when indenting
keymap("v", "<", "<gv", opts)
keymap("v", ">", ">gv", opts)

-- Visual Block --
-- Move text up and down
keymap("x", "J", ":move '>+1<CR>gv-gv", opts)
keymap("x", "K", ":move '<-2<CR>gv-gv", opts)


-- undotree plugin
keymap("n", "<leader>u", ":UndotreeShow<cr>", opts)

-- Vim Fugitive Keybindings
-- Vim Fugite keybindings
-- gl is get changes from the right
-- gh is get changes from the left
keymap("n", "<leader>gl", ":diffget //3<cr>", opts)
keymap("n", "<leader>gh", ":diffget //2<cr>", opts)
-- open Git Status
keymap("n", "<leader>gs", ":G<cr>", opts)


-- Telescope Keybindings
-- Find files with preview
keymap("n", "<leader>f", "<cmd>Telescope find_files<cr>", opts)
-- Find files without preview
keymap("n", "<C-p>", "<cmd>lua require'telescope.builtin'.find_files(require('telescope.themes').get_dropdown({ previewer = false }))<cr>", opts)
-- Grep files
keymap("n", "<C-g>", "<cmd>Telescope live_grep<cr>", opts)
