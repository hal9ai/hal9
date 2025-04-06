I want to know who works at a certain company. Concretely, I want to know:
 - the name
 - the team they're in
 - their job title
 - the url of their github repository (if available)
 - the url of their linkedin profile (if available)

I want you to gather that information directly from the company's website, for example, from a webpage called "teams".

I want you to report back that information as a list of JSON objects, where every object has the following keys:
 - full_name
 - team
 - job_title
 - github_link
 - linkedin_link

Insert an empty string as a value if a piece of information is not available.

Important: do NOT infer job_title from team, nor team from job_title. For both, only report a value if it is given on the website; otherwise, leave empty.

For links, only report the url, not the display text. I.e., no markdown!

This is the company I want to know the people of: 
