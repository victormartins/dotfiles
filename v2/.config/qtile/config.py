# Copyright (c) 2010 Aldo Cortesi
# Copyright (c) 2010, 2014 dequis
# Copyright (c) 2012 Randall Ma
# Copyright (c) 2012-2014 Tycho Andersen
# Copyright (c) 2012 Craig Barnes
# Copyright (c) 2013 horsik
# Copyright (c) 2013 Tao Sauvage
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


import os
import re
import socket
import subprocess
from libqtile.config import Drag, Key, Screen, Group, Drag, Click, Rule
from libqtile.command import lazy
from libqtile import layout, bar, widget, hook
from libqtile.widget import Spacer
#import arcobattery

#mod4 or mod = super key
mod = "mod4"
mod1 = "alt"
mod2 = "control"
home = os.path.expanduser('~')
term = "alacritty"


@lazy.function
def window_to_prev_group(qtile):
    if qtile.currentWindow is not None:
        i = qtile.groups.index(qtile.currentGroup)
        qtile.currentWindow.togroup(qtile.groups[i - 1].name)

@lazy.function
def window_to_next_group(qtile):
    if qtile.currentWindow is not None:
        i = qtile.groups.index(qtile.currentGroup)
        qtile.currentWindow.togroup(qtile.groups[i + 1].name)

keys = [




# APP LAUCHERS

    # Key([mod, "shift"], "r", lazy.spawn('gmrun')),
    # Key([mod, 'shift'], "r", lazy.spawn('rofi -show run')),
    Key([mod, "shift"], "r", lazy.spawn('xfce4-appfinder')),
    Key([mod], "r", lazy.spawn("dmenu_run -i -nb '#191919' -nf '#ba000d' -sb '#ff7961' -sf '#191919' -fn 'NotoMonoRegular:pixelsize=32'")),


    Key(['mod1', 'shift'], "i", lazy.layout.flip()),                         # Invert main Pannel

    Key(['mod1', 'shift'], "f", lazy.window.toggle_floating()),              # Toggle Floating

    Key(['mod1', 'shift'], "space", lazy.next_layout()),                     # Cycle to next layout (acting as toggle fullscreen for now)
    Key(['mod1', 'control', 'shift'], "space", lazy.prev_layout()),          # Cycle to next layout backwards
    Key(['mod1', 'control', 'shift'], "s", lazy.to_layout_index(0)),         # Switch to Tall Layout
    Key(['mod1', 'control', 'shift'], "d", lazy.to_layout_index(1)),         # Switch to Full Screen

    Key(['mod1', 'shift'], "k", lazy.layout.down()),                         # Move Focus Clock Wise
    Key(['mod1', 'shift'], "j", lazy.layout.up()),                           # Move Focus Anti Clock Wise
    Key(['mod1', 'control', 'shift'], "k", lazy.layout.shuffle_down()),      # Swap Focus Window Clock Wise
    Key(['mod1', 'control', 'shift'], "j", lazy.layout.shuffle_up()),        # Swap Focus Window Anti Clock Wise

    Key(['mod1', 'shift'], "l", lazy.layout.grow()),                         # grow selected pannel
    Key(['mod1', 'shift'], "h", lazy.layout.shrink()),                       # shrink selected pannel

    Key(['mod4', "control"], "r", lazy.restart()),                           # Restart qTile
    Key(['mod4'], "Return", lazy.spawn(term)),                               # Start Terminal
    Key(['mod4'], "w", lazy.window.kill()),                                  # Close Window
    Key([mod, "shift"], "Return", lazy.spawn('thunar')),                     # Thunar is a modern file manager for the Xfce Desktop Environment
    Key([mod], "x", lazy.spawn('arcolinux-logout')),                         # Shutdown Screen
    # Key([mod, "shift"], "x", lazy.shutdown()),






# FUNCTION KEYS

    # Key([], "F12", lazy.spawn('xfce4-terminal --drop-down')),

# SUPER + FUNCTION KEYS

    # Key([mod], "e", lazy.spawn('atom')),
    # Key([mod], "c", lazy.spawn('conky-toggle')),
    # Key([mod], "f", lazy.window.toggle_fullscreen()),
    # Key([mod], "m", lazy.spawn('pragha')),
    # Key([mod], "t", lazy.spawn('urxvt')),
    # Key([mod], "v", lazy.spawn('pavucontrol')),
    # Key([mod], "w", lazy.spawn('vivaldi-stable')),
    # Key([mod], "Escape", lazy.spawn('xkill')),
    # Key([mod], "KP_Enter", lazy.spawn('termite')),
    # Key([mod], "F1", lazy.spawn('vivaldi-stable')),
    # Key([mod], "F2", lazy.spawn('atom')),
    # Key([mod], "F3", lazy.spawn('inkscape')),
    # Key([mod], "F4", lazy.spawn('gimp')),
    # Key([mod], "F5", lazy.spawn('meld')),
    # Key([mod], "F6", lazy.spawn('vlc --video-on-top')),
    # Key([mod], "F7", lazy.spawn('virtualbox')),
    # Key([mod], "F8", lazy.spawn('thunar')),
    # Key([mod], "F9", lazy.spawn('evolution')),
    # Key([mod], "F10", lazy.spawn("spotify")),
    # Key([mod], "F11", lazy.spawn('rofi -show run -fullscreen')),
    # Key([mod], "F12", lazy.spawn('rofi-theme-selector')),

# SUPER + SHIFT KEYS
    # Key([mod, "shift"], "q", lazy.window.kill()),
    # Key([mod, "shift", "control"], "r", lazy.restart()),
    # Key([mod, "control"], "r", lazy.restart()),

# CONTROL + ALT KEYS

    # Key(["mod1", "control"], "Next", lazy.spawn('conky-rotate -n')),
    # Key(["mod1", "control"], "Prior", lazy.spawn('conky-rotate -p')),
    # Key(["mod1", "control"], "a", lazy.spawn('xfce4-appfinder')),
    # Key(["mod1", "control"], "b", lazy.spawn('thunar')),
    # Key(["mod1", "control"], "c", lazy.spawn('catfish')),
    # Key(["mod1", "control"], "e", lazy.spawn('arcolinux-tweak-tool')),
    # Key(["mod1", "control"], "f", lazy.spawn('firefox')),
    # Key(["mod1", "control"], "g", lazy.spawn('chromium -no-default-browser-check')),
    # Key(["mod1", "control"], "i", lazy.spawn('nitrogen')),
    # Key(["mod1", "control"], "k", lazy.spawn('arcolinux-logout')),
    # Key(["mod1", "control"], "l", lazy.spawn('arcolinux-logout')),
    # Key(["mod1", "control"], "m", lazy.spawn('xfce4-settings-manager')),
    # Key(["mod1", "control"], "o", lazy.spawn(home + '/.config/qtile/scripts/picom-toggle.sh')),
    # Key(["mod1", "control"], "p", lazy.spawn('pamac-manager')),
    # Key(["mod1", "control"], "r", lazy.spawn('rofi-theme-selector')),
    # Key(["mod1", "control"], "s", lazy.spawn('spotify')),
    # Key(["mod1", "control"], "t", lazy.spawn('termite')),
    # Key(["mod1", "control"], "u", lazy.spawn('pavucontrol')),
    # Key(["mod1", "control"], "v", lazy.spawn('vivaldi-stable')),
    # Key(["mod1", "control"], "w", lazy.spawn('arcolinux-welcome-app')),
    # Key(["mod1", "control"], "Return", lazy.spawn('termite')),

# ALT + ... KEYS

    # Key(["mod1"], "f", lazy.spawn('variety -f')),
    # Key(["mod1"], "h", lazy.spawn('urxvt -e htop')),
    # Key(["mod1"], "n", lazy.spawn('variety -n')),
    # Key(["mod1"], "p", lazy.spawn('variety -p')),
    # Key(["mod1"], "t", lazy.spawn('variety -t')),
    # Key(["mod1"], "Up", lazy.spawn('variety --pause')),
    # Key(["mod1"], "Down", lazy.spawn('variety --resume')),
    # Key(["mod1"], "Left", lazy.spawn('variety -p')),
    # Key(["mod1"], "Right", lazy.spawn('variety -n')),

# VARIETY KEYS WITH PYWAL

    # Key(["mod1", "shift"], "f", lazy.spawn(home + '/.config/qtile/scripts/set-pywal.sh -f')),
    # Key(["mod1", "shift"], "p", lazy.spawn(home + '/.config/qtile/scripts/set-pywal.sh -p')),
    # Key(["mod1", "shift"], "n", lazy.spawn(home + '/.config/qtile/scripts/set-pywal.sh -n')),
    # Key(["mod1", "shift"], "u", lazy.spawn(home + '/.config/qtile/scripts/set-pywal.sh -u')),

# CONTROL + SHIFT KEYS

    # Key([mod2, "shift"], "Escape", lazy.spawn('xfce4-taskmanager')),

# SCREENSHOTS

    Key([], "Print", lazy.spawn("scrot 'ArcoLinux-%Y-%m-%d-%s_screenshot_$wx$h.jpg' -e 'mv $f $$(xdg-user-dir PICTURES)'")),
    Key([mod2], "Print", lazy.spawn('xfce4-screenshooter')),
    Key([mod2, "shift"], "Print", lazy.spawn('gnome-screenshot -i')),

# MULTIMEDIA KEYS

# INCREASE/DECREASE BRIGHTNESS
    Key([], "XF86MonBrightnessUp", lazy.spawn("xbacklight -inc 5")),
    Key([], "XF86MonBrightnessDown", lazy.spawn("xbacklight -dec 5")),

# INCREASE/DECREASE/MUTE VOLUME
    Key([], "XF86AudioMute", lazy.spawn("amixer -q set Master toggle")),
    Key([], "XF86AudioLowerVolume", lazy.spawn("amixer -q set Master 5%-")),
    Key([], "XF86AudioRaiseVolume", lazy.spawn("amixer -q set Master 5%+")),

    Key([], "XF86AudioPlay", lazy.spawn("playerctl play-pause")),
    Key([], "XF86AudioNext", lazy.spawn("playerctl next")),
    Key([], "XF86AudioPrev", lazy.spawn("playerctl previous")),
    Key([], "XF86AudioStop", lazy.spawn("playerctl stop")),

#    Key([], "XF86AudioPlay", lazy.spawn("mpc toggle")),
#    Key([], "XF86AudioNext", lazy.spawn("mpc next")),
#    Key([], "XF86AudioPrev", lazy.spawn("mpc prev")),
#    Key([], "XF86AudioStop", lazy.spawn("mpc stop")),







]

groups = []

group_names = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",]
group_labels = ["1 ", "2 ", "3 ", "4 ", "5 ", "6 ", "7 ", "8 ", "9 ", "0",]
# group_labels = ["", "", "", "", "", "", "", "", "", "",]
group_layouts = ["monadtall", "monadtall", "monadtall", "monadtall", "monadtall", "monadtall", "monadtall", "monadtall", "monadtall", "monadtall",]

for i in range(len(group_names)):
    groups.append(
        Group(
            name=group_names[i],
            layout=group_layouts[i].lower(),
            label=group_labels[i],
        ))

for i in groups:
    keys.extend([

#CHANGE WORKSPACES
        Key([mod], i.name, lazy.group[i.name].toscreen()),
        Key([mod], "Tab", lazy.screen.next_group()),
        Key(["mod1"], "Tab", lazy.screen.next_group()),
        Key(["mod1", "shift"], "Tab", lazy.screen.prev_group()),

# MOVE WINDOW TO SELECTED WORKSPACE 1-10 AND STAY ON WORKSPACE
        #Key([mod, "shift"], i.name, lazy.window.togroup(i.name)),
# MOVE WINDOW TO SELECTED WORKSPACE 1-10 AND FOLLOW MOVED WINDOW TO WORKSPACE
        Key([mod, "shift"], i.name, lazy.window.togroup(i.name) , lazy.group[i.name].toscreen()),
    ])


# def init_layout_theme():
#     return {"margin":5,
#             "border_width":2,
#             "border_focus": "#5e81ac",
#             "border_normal": "#4c566a"
#             }

# layout_theme = init_layout_theme()

layout_theme = {
  "border_width": 3,
  "margin": 8,
  # "border_focus": "d79921", # gold
  "border_focus": "#fb4934", # red
  # "border_focus": "#18FFFF", # blue
  # "border_focus": "C6FF00", # green
  # "border_normal":"9d0006", # red
  # "border_normal":"#607D8B"    # gray
  "border_normal":"#bdae93"    # light brown
}

layouts = [
    layout.MonadTall(**layout_theme),
    layout.Max(**layout_theme),
    # layout.MonadWide(margin=8, border_width=2, border_focus="#5e81ac", border_normal="#4c566a"),
    # layout.Matrix(**layout_theme),
    # layout.Bsp(**layout_theme),
    # layout.Floating(**layout_theme),
    # layout.RatioTile(**layout_theme),
]

# COLORS FOR THE BAR

def init_colors():
    return [["#2F343F", "#2F343F"], # color 0
            ["#2F343F", "#2F343F"], # color 1
            ["#c0c5ce", "#c0c5ce"], # color 2
            ["#fabd2f", "#fabd2f"], # color 3
            ["#3384d0", "#3384d0"], # color 4
            ["#f3f4f5", "#f3f4f5"], # color 5
            ["#fb4934", "#fb4934"], # color 6
            ["#62FF00", "#62FF00"], # color 7
            ["#6790eb", "#6790eb"], # color 8
            ["#a9a9a9", "#a9a9a9"]] # color 9


colors = init_colors()


# WIDGETS FOR THE BAR

def init_widgets_defaults():
    return dict(font="Noto Sans",
                fontsize = 12,
                padding = 2,
                background=colors[1])

widget_defaults = init_widgets_defaults()

def init_widgets_list():
    prompt = "{0}@{1}: ".format(os.environ["USER"], socket.gethostname())
    widgets_list = [
               widget.GroupBox(font="FontAwesome",
                        fontsize = 16,
                        margin_y = -1,
                        margin_x = 0,
                        padding_y = 6,
                        padding_x = 5,
                        borderwidth = 0,
                        disable_drag = True,
                        active = colors[9],
                        inactive = colors[5],
                        rounded = False,
                        highlight_method = "text",
                        this_current_screen_border = colors[8],
                        foreground = colors[2],
                        background = colors[1]
                        ),
               widget.Sep(
                        linewidth = 1,
                        padding = 10,
                        foreground = colors[2],
                        background = colors[1]
                        ),
               widget.CurrentLayout(
                        font = "Noto Sans Bold",
                        foreground = colors[5],
                        background = colors[1]
                        ),
               widget.Sep(
                        linewidth = 1,
                        padding = 10,
                        foreground = colors[2],
                        background = colors[1]
                        ),
               widget.WindowName(font="Noto Sans",
                        fontsize = 12,
                        foreground = colors[5],
                        background = colors[1],
                        ),
               # widget.Sep(
               #          linewidth = 1,
               #          padding = 10,
               #          foreground = colors[2],
               #          background = colors[1]
               #          ),
               # widget.Net(
               #          font="Noto Sans",
               #          fontsize=12,
               #          interface="enp0s31f6",
               #          foreground=colors[2],
               #          background=colors[1],
               #          padding = 0,
               #          ),
               widget.CapsNumLockIndicator(
                   padding = 5
               ),
               widget.TextBox(
                        font="FontAwesome",
                        text="  ",
                        foreground=colors[4],
                        background=colors[1],
                        padding = 0,
                        fontsize=16
                        ),
               widget.NetGraph(
                        font="Noto Sans",
                        fontsize=12,
                        bandwidth="down",
                        interface="auto",
                        fill_color = colors[8],
                        foreground=colors[2],
                        background=colors[1],
                        graph_color = colors[8],
                        border_color = colors[2],
                        padding = 0,
                        border_width = 1,
                        line_width = 1,
                        ),
               # widget.Sep(
               #          linewidth = 1,
               #          padding = 10,
               #          foreground = colors[2],
               #          background = colors[1]
               #          ),
               # # do not activate in Virtualbox - will break qtile
               # widget.ThermalSensor(
               #          foreground = colors[5],
               #          foreground_alert = colors[6],
               #          background = colors[1],
               #          metric = True,
               #          padding = 3,
               #          threshold = 80
               #          ),
               # # battery option 1  ArcoLinux Horizontal icons do not forget to import arcobattery at the top
               # widget.Sep(
               #          linewidth = 1,
               #          padding = 10,
               #          foreground = colors[2],
               #          background = colors[1]
               #          ),
               # arcobattery.BatteryIcon(
               #          padding=0,
               #          scale=0.7,
               #          y_poss=2,
               #          theme_path=home + "/.config/qtile/icons/battery_icons_horiz",
               #          update_interval = 5,
               #          background = colors[1]
               #          ),
               # # battery option 2  from Qtile
               # widget.Sep(
               #          linewidth = 1,
               #          padding = 10,
               #          foreground = colors[2],
               #          background = colors[1]
               #          ),
               # widget.Battery(
               #          font="Noto Sans",
               #          update_interval = 10,
               #          fontsize = 12,
               #          foreground = colors[5],
               #          background = colors[1],
	           #          ),
               widget.TextBox(
                        font="FontAwesome",
                        text="  ",
                        foreground=colors[6],
                        background=colors[1],
                        padding = 0,
                        fontsize=16
                        ),
               widget.CPU(
                        update_interval= 1.0,
                        padding = 5,
                        ),
               widget.CPUGraph(
                        border_color = colors[2],
                        fill_color = colors[8],
                        graph_color = colors[8],
                        background=colors[1],
                        border_width = 1,
                        line_width = 1,
                        core = "all",
                        type = "box"
                        ),
               widget.Sep(
                        linewidth = 1,
                        padding = 10,
                        foreground = colors[2],
                        background = colors[1]
                        ),
               widget.TextBox(
                        font="FontAwesome",
                        text="  ",
                        foreground=colors[4],
                        background=colors[1],
                        padding = 0,
                        fontsize=16
                        ),
               widget.Memory(
                        font="Noto Sans",
                        format = '{MemUsed}M/{MemTotal}M',
                        update_interval = 1,
                        fontsize = 12,
                        foreground = colors[5],
                        background = colors[1],
                       ),
               widget.Sep(
                        linewidth = 1,
                        padding = 10,
                        foreground = colors[2],
                        background = colors[1]
                        ),
               widget.TextBox(
                        font="FontAwesome",
                        text="  ",
                        foreground=colors[3],
                        background=colors[1],
                        padding = 0,
                        fontsize=16
                        ),
               widget.Clock(
                        foreground = colors[5],
                        background = colors[1],
                        fontsize = 12,
                        format="%Y-%m-%d %H:%M"
                        ),
               widget.Sep(
                        linewidth = 1,
                        padding = 10,
                        foreground = colors[2],
                        background = colors[1]
                        ),
               widget.Systray(
                        background=colors[1],
                        icon_size=20,
                        padding = 4
                        ),
               widget.TextBox(
                        font="FontAwesome",
                        text=" ",
                        foreground=colors[4],
                        background=colors[1],
                        padding = 5,
                        fontsize=16
                        ),
              ]
    return widgets_list

widgets_list = init_widgets_list()


def init_widgets_screen1():
    widgets_screen1 = init_widgets_list()
    return widgets_screen1

def init_widgets_screen2():
    widgets_screen2 = init_widgets_list()
    return widgets_screen2

widgets_screen1 = init_widgets_screen1()
widgets_screen2 = init_widgets_screen2()


def init_screens():
    return [Screen(top=bar.Bar(widgets=init_widgets_screen1(), size=26)),
            Screen(top=bar.Bar(widgets=init_widgets_screen2(), size=26))]
screens = init_screens()


# MOUSE CONFIGURATION
mouse = [
    Drag([mod], "Button1", lazy.window.set_position_floating(),
         start=lazy.window.get_position()),
    Drag([mod], "Button3", lazy.window.set_size_floating(),
         start=lazy.window.get_size()),
    Click([mod], "Button2", lazy.window.bring_to_front())
]

dgroups_key_binder = None
dgroups_app_rules = []

# ASSIGN APPLICATIONS TO A SPECIFIC GROUPNAME
# BEGIN

# @hook.subscribe.client_new
# def assign_app_group(client):
#     d = {}
#     #########################################################
#     ################ assgin apps to groups ##################
#     #########################################################
#     d["1"] = ["Navigator", "Firefox", "Vivaldi-stable", "Vivaldi-snapshot", "Chromium", "Google-chrome", "Brave", "Brave-browser",
#               "navigator", "firefox", "vivaldi-stable", "vivaldi-snapshot", "chromium", "google-chrome", "brave", "brave-browser", ]
#     d["2"] = [ "Atom", "Subl3", "Geany", "Brackets", "Code-oss", "Code", "TelegramDesktop", "Discord",
#                "atom", "subl3", "geany", "brackets", "code-oss", "code", "telegramDesktop", "discord", ]
#     d["3"] = ["Inkscape", "Nomacs", "Ristretto", "Nitrogen", "Feh",
#               "inkscape", "nomacs", "ristretto", "nitrogen", "feh", ]
#     d["4"] = ["Gimp", "gimp" ]
#     d["5"] = ["Meld", "meld", "org.gnome.meld" "org.gnome.Meld" ]
#     d["6"] = ["Vlc","vlc", "Mpv", "mpv" ]
#     d["7"] = ["VirtualBox Manager", "VirtualBox Machine", "Vmplayer",
#               "virtualbox manager", "virtualbox machine", "vmplayer", ]
#     d["8"] = ["Thunar", "Nemo", "Caja", "Nautilus", "org.gnome.Nautilus", "Pcmanfm", "Pcmanfm-qt",
#               "thunar", "nemo", "caja", "nautilus", "org.gnome.nautilus", "pcmanfm", "pcmanfm-qt", ]
#     d["9"] = ["Evolution", "Geary", "Mail", "Thunderbird",
#               "evolution", "geary", "mail", "thunderbird" ]
#     d["0"] = ["Spotify", "Pragha", "Clementine", "Deadbeef", "Audacious",
#               "spotify", "pragha", "clementine", "deadbeef", "audacious" ]
#     ##########################################################
#     wm_class = client.window.get_wm_class()[0]
#
#     for i in range(len(d)):
#         if wm_class in list(d.values())[i]:
#             group = list(d.keys())[i]
#             client.togroup(group)
#             client.group.cmd_toscreen()

# END
# ASSIGN APPLICATIONS TO A SPECIFIC GROUPNAME



main = None

@hook.subscribe.startup_once
def start_once():
    home = os.path.expanduser('~')
    subprocess.call([home + '/.config/qtile/scripts/autostart.sh'])

@hook.subscribe.startup
def start_always():
    # Set the cursor to something sane in X
    subprocess.Popen(['xsetroot', '-cursor_name', 'left_ptr'])

@hook.subscribe.client_new
def set_floating(window):
    if (window.window.get_wm_transient_for()
            or window.window.get_wm_type() in floating_types):
        window.floating = True

floating_types = ["notification", "toolbar", "splash", "dialog"]


follow_mouse_focus = False
bring_front_click = False
cursor_warp = False
floating_layout = layout.Floating(float_rules=[
    {'wmclass': 'Arcolinux-welcome-app.py'},
    {'wmclass': 'Arcolinux-tweak-tool.py'},
    {'wmclass': 'confirm'},
    {'wmclass': 'dialog'},
    {'wmclass': 'download'},
    {'wmclass': 'error'},
    {'wmclass': 'file_progress'},
    {'wmclass': 'notification'},
    {'wmclass': 'splash'},
    {'wmclass': 'toolbar'},
    {'wmclass': 'confirmreset'},
    {'wmclass': 'makebranch'},
    {'wmclass': 'maketag'},
    {'wmclass': 'Arandr'},
    {'wmclass': 'feh'},
    {'wmclass': 'Galculator'},
    {'wmclass': 'arcolinux-logout'},
    {'wmclass': 'xfce4-terminal'},
    {'wname': 'branchdialog'},
    {'wname': 'Open File'},
    {'wname': 'pinentry'},
    {'wmclass': 'ssh-askpass'},

],  fullscreen_border_width = 0, border_width = 0)
auto_fullscreen = True

focus_on_window_activation = "focus" # or smart

wmname = "LG3D"
