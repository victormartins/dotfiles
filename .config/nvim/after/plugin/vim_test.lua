local opts = { noremap = true, silent = true }
local keymap = vim.api.nvim_set_keymap

keymap("n", "<leader>tf", ":TestFile<CR>", opts)
keymap("n", "<leader>tn", ":TestNearest<CR>", opts)
keymap("n", "<leader>tl", ":TestLast<CR>", opts)
