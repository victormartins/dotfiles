Vim�UnDo� <:ϒ���C�*���<�P�d[��7M���u      6local status_ok, gitsigns = pcall(require, "gitsigns")            &       &   &   &    bv�    _�                       )    ����                                                                                                                                                                                                                                                                                                                                                             bv��    �                5local status_ok, sneak = pcall(require, "nvim-sneak")5��        )                  )                      5�_�                       )    ����                                                                                                                                                                                                                                                                                                                                                             bv��     �             �             5��                          5               5       5�_�                            ����                                                                                                                                                                                                                                                                                                                                                             bv��     �                 4local status_ok, sneak = pcall(require, "vim-sneak")5��                4       7           4       7       5�_�                       )    ����                                                                                                                                                                                                                                                                                                                                                             bv��     �               4local status_ok, sneak = pcall(require, "vim-sneak")5��       )                  a                      5�_�                       )    ����                                                                                                                                                                                                                                                                                                                                                             bv��     �               3local status_ok, sneak = pcall(require, "im-sneak")5��       )                  a                      5�_�                       )    ����                                                                                                                                                                                                                                                                                                                                                             bv��     �               2local status_ok, sneak = pcall(require, "m-sneak")5��       )                  a                      5�_�      	                 )    ����                                                                                                                                                                                                                                                                                                                                                             bv��    �               1local status_ok, sneak = pcall(require, "-sneak")5��       )                  a                      5�_�      
           	      )    ����                                                                                                                                                                                                                                                                                                                                                             bv��    �                 7-- local status_ok, sneak = pcall(require, "vim-sneak")5��                                   8               5�_�   	              
      .    ����                                                                                                                                                                                                                                                                                                                                                             bv��     �              �             5��                                           7       5�_�   
                         ����                                                                                                                                                                                                                                                                                                                                                             bv��     �                0local status_ok, sneak = pcall(require, "sneak")5��               0       3   7       0       3       5�_�                            ����                                                                                                                                                                                                                                                                                                                                                             bv��     �                 6local status_ok, gitsigns = pcall(require, "gitsigns")5��                6       9           6       9       5�_�                           ����                                                                                                                                                                                                                                                                                                                                                             bv��    �                3-- local status_ok, sneak = pcall(require, "sneak")5��               3       0   :       3       0       5�_�                            ����                                                                                                                                                                                                                                                                                                                                                  V        bv��    �                end�                  return�                *  vim.notifiy("Failed to load vim-sneak!")�                if not status_ok then�                0local status_ok, sneak = pcall(require, "sneak")5��               0       3   :       0       3       �                         n                     �               *       -   �       *       -       �                         �                     �                         �                     5�_�                            ����                                                                                                                                                                                                                                                                                                                                                  V        bv�!     �              5��                                                  �                                                5�_�                           ����                                                                                                                                                                                                                                                                                                                                                  V        bv�!     �             �             5��                                         �       5�_�                            ����                                                                                                                                                                                                                                                                                                                                                  V        bv�#    �                 --5��                                                  5�_�                            ����                                                                                                                                                                                                                                                                                                                                                  V        bv�p   	 �                9-- local status_ok, gitsigns = pcall(require, "gitsigns")   3-- local status_ok, sneak = pcall(require, "sneak")   -- if not status_ok then   ---   vim.notifiy("Failed to load vim-sneak!")   --   return   -- end    5��                          �       �               5�_�                            ����                                                                                                                                                                                                                                                                                                                                                  V        bv��    �                   �               �                 6local status_ok, gitsigns = pcall(require, "gitsigns")   if not status_ok then   )  vim.notifiy("Failed to load gitsigns!")     return   end5��                                  �              �                    2                       �      5�_�                    3        ����                                                                                                                                                                                                                                                                                                                            3           3           V        bv��     �   2   3           5��    2                      �                     5�_�                    2        ����                                                                                                                                                                                                                                                                                                                            3           3           V        bv��    �   1   2           5��    1                      �                     5�_�                            ����                                                                                                                                                                                                                                                                                                                                       1           V        bv�|     �             +   gitsigns.setup {     signs = {   b    add = { hl = "GitSignsAdd", text = "▎", numhl = "GitSignsAddNr", linehl = "GitSignsAddLn" },   n    change = { hl = "GitSignsChange", text = "▎", numhl = "GitSignsChangeNr", linehl = "GitSignsChangeLn" },   n    delete = { hl = "GitSignsDelete", text = "契", numhl = "GitSignsDeleteNr", linehl = "GitSignsDeleteLn" },   q    topdelete = { hl = "GitSignsDelete", text = "契", numhl = "GitSignsDeleteNr", linehl = "GitSignsDeleteLn" },   t    changedelete = { hl = "GitSignsChange", text = "▎", numhl = "GitSignsChangeNr", linehl = "GitSignsChangeLn" },     },   <  signcolumn = true, -- Toggle with `:Gitsigns toggle_signs`   8  numhl = false, -- Toggle with `:Gitsigns toggle_numhl`   :  linehl = false, -- Toggle with `:Gitsigns toggle_linehl`   @  word_diff = false, -- Toggle with `:Gitsigns toggle_word_diff`     watch_gitdir = {       interval = 1000,       follow_files = true,     },     attach_to_untracked = true,   R  current_line_blame = false, -- Toggle with `:Gitsigns toggle_current_line_blame`     current_line_blame_opts = {       virt_text = true,   ?    virt_text_pos = "eol", -- 'eol' | 'overlay' | 'right_align'       delay = 1000,       ignore_whitespace = false,     },   '  current_line_blame_formatter_opts = {       relative_time = false,     },     sign_priority = 6,     update_debounce = 100,   (  status_formatter = nil, -- Use default     max_file_length = 40000,     preview_config = {   &    -- Options passed to nvim_open_win       border = "single",       style = "minimal",       relative = "cursor",       row = 0,       col = 1,     },   
  yadm = {       enable = false,     },   }5��           +               �                     5�_�                            ����                                                                                                                                                                                                                                                                                                                                                  V        bv�}    �                 5��                          �                      5�_�                       ,    ����                                                                                                                                                                                                                                                                                                                                                  V        bv��     �                6local status_ok, gitsigns = pcall(require, "gitsigns")5��        ,                 ,                     �        ,                 ,                     �        ,              	   ,              	       5�_�                           ����                                                                                                                                                                                                                                                                                                                                                  V        bv��     �                7local status_ok, gitsigns = pcall(require, "vim-sneak")5��                                              5�_�                       )    ����                                                                                                                                                                                                                                                                                                                                                  V        bv��     �                4local status_ok, sneak = pcall(require, "vim-sneak")5��        )                  )                      5�_�                       )    ����                                                                                                                                                                                                                                                                                                                                                  V        bv��     �                3local status_ok, sneak = pcall(require, "im-sneak")5��        )                  )                      5�_�                       )    ����                                                                                                                                                                                                                                                                                                                                                  V        bv��     �                2local status_ok, sneak = pcall(require, "m-sneak")5��        )                  )                      5�_�                       )    ����                                                                                                                                                                                                                                                                                                                                                  V        bv��    �                1local status_ok, sneak = pcall(require, "-sneak")5��        )                  )                      5�_�                            ����                                                                                                                                                                                                                                                                                                                                                  V        bv�.    �               )  vim.notifiy("Failed to load gitsigns!")5��                        e                     �                        e                     �                        e                     �                        e                     5�_�      !                       ����                                                                                                                                                                                                                                                                                                                                                V       bv�Q    �                end�                  return�                &  vim.notifiy("Failed to load sneak!")�                if not status_ok then�                 0local status_ok, sneak = pcall(require, "sneak")5��                0       3           0       3       �                         4                     �               &       )   M       &       )       �                         w                     �                         �                     5�_�       "           !           ����                                                                                                                                                                                                                                                                                                                                                V       bv�[    �              �             5��                                           �       5�_�   !   #           "           ����                                                                                                                                                                                                                                                                                                                                       
           V        bv�t    �                   �               �              
   6local status_ok, gitsigns = pcall(require, "gitsigns")   if not status_ok then   )  vim.notifiy("Failed to load gitsigns!")     return   end   3-- local status_ok, sneak = pcall(require, "sneak")   -- if not status_ok then   )--   vim.notifiy("Failed to load sneak!")   --   return   -- end5��            
                                   �                    2                       �      5�_�   "   $           #           ����                                                                                                                                                                                                                                                                                                                                       3           V        bv��     �             -   gitsigns.setup {     signs = {   b    add = { hl = "GitSignsAdd", text = "▎", numhl = "GitSignsAddNr", linehl = "GitSignsAddLn" },   n    change = { hl = "GitSignsChange", text = "▎", numhl = "GitSignsChangeNr", linehl = "GitSignsChangeLn" },   n    delete = { hl = "GitSignsDelete", text = "契", numhl = "GitSignsDeleteNr", linehl = "GitSignsDeleteLn" },   q    topdelete = { hl = "GitSignsDelete", text = "契", numhl = "GitSignsDeleteNr", linehl = "GitSignsDeleteLn" },   t    changedelete = { hl = "GitSignsChange", text = "▎", numhl = "GitSignsChangeNr", linehl = "GitSignsChangeLn" },     },   <  signcolumn = true, -- Toggle with `:Gitsigns toggle_signs`   8  numhl = false, -- Toggle with `:Gitsigns toggle_numhl`   :  linehl = false, -- Toggle with `:Gitsigns toggle_linehl`   @  word_diff = false, -- Toggle with `:Gitsigns toggle_word_diff`     watch_gitdir = {       interval = 1000,       follow_files = true,     },     attach_to_untracked = true,   R  current_line_blame = false, -- Toggle with `:Gitsigns toggle_current_line_blame`     current_line_blame_opts = {       virt_text = true,   ?    virt_text_pos = "eol", -- 'eol' | 'overlay' | 'right_align'       delay = 1000,       ignore_whitespace = false,     },   '  current_line_blame_formatter_opts = {       relative_time = false,     },     sign_priority = 6,     update_debounce = 100,   (  status_formatter = nil, -- Use default     max_file_length = 40000,     preview_config = {   &    -- Options passed to nvim_open_win       border = "single",       style = "minimal",       relative = "cursor",       row = 0,       col = 1,     },   
  yadm = {       enable = false,     },   }        5��           -               �       !              5�_�   #   %           $           ����                                                                                                                                                                                                                                                                                                                                                  V        bv��    �                 5��                          �                      5�_�   $   &           %          ����                                                                                                                                                                                                                                                                                                                                                  V        bv��     �                6local status_ok, gitsigns = pcall(require, "gitsigns")5��                                              �                                                �                                                �                                                �                                              5�_�   %               &      )    ����                                                                                                                                                                                                                                                                                                                                                  V        bv�    �                3local status_ok, sneak = pcall(require, "gitsigns")5��        )                 )                     5�_�                            ����                                                                                                                                                                                                                                                                                                                                                             bv��     �                5��               3           :       3               5�_�                            ����                                                                                                                                                                                                                                                                                                                                                             bv��     �             �                =local status_ok, sneak =gitsigns pcall(require, "nvim-sneak")5��                                                5��