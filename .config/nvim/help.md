# NeoVim help entry points.

```
:checkhealth # Check global health status.
:helpgrep    # Grep in help

:help rtp # The runtime path where all nvim configuration files are stored.
:help nvim-features # Features of Neovim.
```

# Install Plugins
Edit the `plugins.lua` file and then run the following:
```
:so         -- to source the plugins.lua file
:PackerSync -- to execute the changes
```

# Key shortcuts
## File Navigation
```
<leader> + pv  -- project view (Explorer)
<leader> + pf  -- project file (Fuzzy Finder)
<leader> + ps  -- project search (Fuzzy Finder)
<leader> + pb  -- buffers
<leader> + ph  -- help tags
<C-p>          -- Git file search
<C-g>          -- Live Grep

-- using the harpoon plugin
<leader> + hh  -- open quick shortcuts window
<leader> + ha  -- add file to quick shortcut
<leader> + h1  -- go to shortcut 1
<leader> + h2  -- go to shortcut 2
<leader> + h3  -- go to shortcut 3
```

## Window split navigation
```
<leader> + h
<leader> + j
<leader> + k
<leader> + l
```

## Window split resizing
```
arrows   --  resize window
<C-w>    --  maximize window
<C-=>	 -- equalize windows
```

# Copilot
```
<leader>gj    -- next sugestion
<leader>gk    -- previous sugestion
<leader>gi    -- get a suggestion even if copilot is disabled
```

#  Git
```
<leader>gs	--Git status
```
