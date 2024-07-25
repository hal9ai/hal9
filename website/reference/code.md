# Code

Convenience functions to process code.

## Extract
`extract(markdown, language)` <br/><br/>
Extracts code blocks from `markdown` text.

When no `language` is specified, a dictionary is retrieved with all code blocks grouped by lanuage. If the blocks contain `filename` header, a dictionary of file names is retrieve instead. The `default` can contain a dictionary of files to use as defaults.

| Param | Type | Description |
| --- | --- | --- |
| markdown | <code>String</code> | The markdown to extract blocks from. |
| language | <code>String</code> | The language of the code blocks to extract. |
| default | <code>Any</code> | The default value when code not found, defaults to `None`. |