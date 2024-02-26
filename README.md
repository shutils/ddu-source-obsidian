# ddu-source-obsidian

obsidian source for ddu.vim

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### ddu.vim

https://github.com/Shougo/ddu.vim

### ddu-kind-file

https://github.com/Shougo/ddu-kind-file

### ddu-kind-word

https://github.com/Shougo/ddu-kind-word

### ripgrep

https://github.com/BurntSushi/ripgrep

## Configuration

```vim
	call ddu#start(#{
		\ name: 'obsidian_note',
		\ ui: 'ff',
		\ sources: [#{
		\   name: 'obsidian_note',
		\   params: #{
		\       vault: expand('~/zettelkasten'),
		\   },
		\   options: #{
		\       matchers: [
		\         "converter_obsidian_title",
		\         "converter_display_word",
		\         "matcher_fzf",
		\       ],
		\       sorters: [
		\         "converter_obsidian_title",
		\         "converter_display_word",
		\         "sorter_fzf",
		\       ],
		\       converters: ["converter_obsidian_path"],
		\   },
		\ }] })
```

