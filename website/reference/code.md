# Code

Convenience functions to process code.

## Extract
`extract(markdown, language)` <br/><br/>
Extracts all `language` code blocks from `markdown` text

| Param | Type | Description |
| --- | --- | --- |
| markdown | <code>String</code> | The markdown to extract blocks from. |
| language | <code>String</code> | The language of the code blocks. |
| default | <code>Any</code> | The default value when code not found, defaults to `None`. |