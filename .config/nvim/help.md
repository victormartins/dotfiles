# NeoVim help entry points.

```
:checkhealth # Check global health status.

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
<C-p>          -- Git file search
<C-g>          -- Live Grep
```
