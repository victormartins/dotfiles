--   /\_/\
--  ( o.o ) Copilot
--   > ^ <


-- Disable copilot by default. To enable execute :Copilot enabled
vim.g.copilot_enabled = 0

vim.keymap.set("i", "<leader>gj", "<Plug>(copilot-next)")
vim.keymap.set("i", "<leader>gk", "<Plug>(copilot-previous)")
vim.keymap.set("i", "<leader>gi", "<Plug>(copilot-suggest)")

-- Tell Git Copilot to assume key mappings are already defined to avoid clashing
vim.g.copilot_assume_mapped = true


