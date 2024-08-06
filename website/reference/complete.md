# Complete

Convenience functions to handle LLM completions

## Complete
`complete(completion, messages, tools, show)` <br/><br/>
Finishes completing the completions by printing them, appending messages, or handling tools.

| Param | Type | Description |
| --- | --- | --- |
| completion | <code>String</code> | The completions form the LLM. |
| messages | <code>Array</code> | Messages to append replies to, defaults to `[]`. |
| tools | <code>Array</code> | An array of functions to use as tools, defaults `[]`. |
| show | <code>Bool</code> | Print the completions? Defaults to `True`. |

## Describe
`describe(funcs)` <br/><br/>
Describes an array of functions with descriptions, parameters and types. Useful when completing chats.

| Param | Type | Description |
| --- | --- | --- |
| functions | <code>Array</code> | An array of functions to describe. |
