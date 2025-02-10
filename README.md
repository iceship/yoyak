Yoyak: An LLM-powered CLI tool for summarizing web pages
========================================================

[![Demo session][Demo session thumbnail]][Demo session]

This is a small CLI tool that uses LLM to summarize and translate web pages.

[Demo session thumbnail]: https://asciinema.org/a/701699.svg
[Demo session]: https://asciinema.org/a/701699
[issue tracker]: https://github.com/dahlia/yoyak/issues


Installation
------------

We distribute the official executables for Linux, macOS, and Windows.  You can
download them from the [releases page].

Or if you have [Deno] installed on your system, you can install this program by
running the following command:

~~~~ bash
deno install --global --allow-net --allow-env jsr:@hongminhee/yoyak/cli
~~~~

[Deno]: https://deno.com/


Usage
-----

At very first, you need to set the model you want to use. You can do this by
running the following command (see also [supported models](#supported-models)
below):

~~~~ bash
yoyak set-model gemini-2.0-flash-exp
~~~~

It asks for the API key via the standard input, and stores it in configuration
file.

Then you can use the `yoyak summary` command to summarize a web page:

~~~~ bash
yoyak summary https://github.com/dahlia/yoyak
~~~~

It prints the summary of the web page to the standard output.

If you want to translate the summary to another language, you can use
the `-l`/`--language` option (which takes [ISO 639-1] language code):

~~~~ bash
yoyak summary -l ko https://github.com/dahlia/yoyak
~~~~

It translates the summary to Korean.

[ISO 639-1]: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes


Shell completion
---------------

Yoyak provides shell completion scripts for bash, fish, and zsh.

### Bash

To enable bash completion, add the following line to your *~/.bashrc* or
*~/.bash_profile*:

~~~~ bash
source <(yoyak completions bash)
~~~~

### Fish

To enable fish completion, add the following line to your
*~/.config/fish/config.fish*:

~~~~ fish
source (yoyak completions fish | psub)
~~~~

### Zsh

To enable zsh completion, add the following line to your *~/.zshrc*:

~~~~ zsh
source <(yoyak completions zsh)
~~~~

Or run the following command to use zsh fpath completions:[^1]

~~~~ zsh
yoyak completions zsh > /usr/local/share/zsh/site-functions/_yoyak
~~~~

[^1]: The *site-functions* path may vary depending on your system.


Supported models
----------------

 -  `chatgpt-4o-latest`
 -  `claude-3-5-haiku-latest`
 -  `claude-3-5-sonnet-latest`
 -  `claude-3-opus-latest`
 -  `deepseek-chat`
 -  `deepseek-reasoner`
 -  `gemini-1.5-flash`
 -  `gemini-1.5-flash-8b`
 -  `gemini-1.5-pro`
 -  `gemini-2.0-flash-exp`
 -  `gemini-2.0-flash-lite-preview-02-05`
 -  `gemini-2.0-flash-thinking-exp-01-21`
 -  `gemini-2.0-pro-exp-02-05`
 -  `gpt-4o`
 -  `gpt-4o-mini`
 -  `o1`
 -  `o1-mini`
 -  `o1-preview`
 -  `o3-mini`


Etymology
---------

Yoyak ([要約]) is a Sino-Korean word that means *summary*.

[要約]: https://en.wiktionary.org/wiki/%EC%9A%94%EC%95%BD#Etymology_1

<!-- cSpell: ignore psub fpath Sino-Korean -->
