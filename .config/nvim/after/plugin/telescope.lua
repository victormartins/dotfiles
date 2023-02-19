local builtin = require('telescope.builtin')
vim.keymap.set('n', '<leader>pf', builtin.find_files, {}) -- project files
vim.keymap.set('n', '<leader>pb', builtin.buffers, {})    -- buffers
vim.keymap.set('n', '<leader>ph', builtin.help_tags, {})  -- help tags

vim.keymap.set('n', '<leader>ps',                         -- project search (Grep Files)
  function() 
  builtin.grep_string({ search = vim.fn.input("Grep > ")});
end)

vim.keymap.set('n', '<C-p>', builtin.git_files, {})      -- Git file search
vim.keymap.set('n', '<C-g>', builtin.live_grep, {})      -- Live Grep
