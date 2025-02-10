Yoyak changelog
===============

Version 0.3.0
-------------

Released on February 10, 2025.

 -  We now distribute the official executables for Linux, macOS, and Windows.
    You can download them from the [releases page].

 -  Added `-u`/`--user-agent` option to `yoyak scrape` and `yoyak summary`
    commands to specify a custom `User-Agent` string.

 -  Yoyak now can be identified through its unique `User-Agent` string.  The
    `User-Agent` string is `Yoyak/0.3.0` followed by the version of Deno, e.g.,
    `Yoyak/0.3.0 (Deno/2.1.9)`.  [[#1]]

[#1]: https://github.com/dahlia/yoyak/issues/1
[releases page]: https://github.com/dahlia/yoyak/releases


Version 0.2.0
-------------

Released on February 7, 2025.

 -  Now more text encodings other than UTF-8 are supported.  All available
    encodings are listed in the [iconv-lite project's documentation].

 -  Added more Gemini models:

     -  `gemini-2.0-flash-lite-preview-02-05`
     -  `gemini-2.0-flash-thinking-exp-01-21`
     -  `gemini-2.0-pro-exp-02-05`

[iconv-lite project's documentation]: https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings


Version 0.1.0
-------------

Initial release.  Released on February 5, 2025.
