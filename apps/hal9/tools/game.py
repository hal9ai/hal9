import openai
import os
import hal9 as h9
import json
import time

client = openai.AzureOpenAI(
   azure_endpoint = 'http://localhost:5000/proxy/server=https://openai-hal9.openai.azure.com/',
   api_key = 'h1',
   api_version = '2023-05-15'
)

def build_game(user_game_request):
   """Use this tool when a user explicitly requests to build a video game or provides a brief description resembling a video game concept.
Parameters:
     'user_game_request' = is the requested user game to build.
   """
   number_of_steps = 3

   print('OK, will get that started. ', end="")

   prompt_text = client.chat.completions.create(
      model="gpt-4",
      messages=[{"role": "user", "content": f"(Do not mention preloaded assets within the array) Make a string array of only text in JSON format that includes {number_of_steps} text elements where each text element describes an important instruction for generating the following user request as a pure single page HTML game: {user_game_request}, The JSON array must be flat and only contain strings"}],
      temperature=0,
   )

   response = prompt_text.choices[0].message.content
   prompts = h9.extract(markdown=response, language="json")
   prompts = json.loads(prompts)
   prompts[0] = prompts[0] + ". The background of the html page must be radial gradient with a color appropriate to the game and a short fun title for the game."

   messages = h9.load("messages-game", [{"role": "system", "content": "Always reply with a single page HTML markdown block (which can use JavaScript, CSS, etc) that fulfills the user request and only use geometric shapes and colors for the single page HTML markdown block"}])

   print('For each step I complete there will be a generated game to go along with it! So you can see the progress of the game I am creating!\n')

   def improve_code(messages, prompt):
      messages.append({"role": "user", "content": prompt})
       
      completion = client.chat.completions.create(
         model="gpt-4",
         messages=messages,
         temperature=0,
      )
       
      response = completion.choices[0].message.content
      messages.append({"role": "assistant", "content": response})

      code = h9.extract(markdown=response, language="html")
      return code

   for i, prompt in enumerate(prompts):

      formatted_prompt = prompt.format(user_game_request=user_game_request)
      
      if (i == 0):
         code = improve_code(messages, formatted_prompt + background)
      else:
         code = improve_code(messages, f"""Fix/improve the following code by following the instruction:

   ```html
   {code}
   ```

   Instruction: {formatted_prompt} (Avoid Placeholders: Ensure the code is complete and functional, avoiding the use of placeholders.)
   """)

      print(f'Game iteration {i + 1}. {prompt}. ', end="")
      h9.save(f"game-{int(time.time())}.html", code, hidden=False)

      print(f"Completed!")

   h9.save("messages-game", messages, hidden=True)

   explanation = client.chat.completions.create(
      model="gpt-4",
      messages=[{"role": "system", "content": "Your job is to explain the code in games in simple terms to explain users what to expect."}, {"role": "user", "content": f"{code}\n\nExplain what the game does in simple terms:"}],
      temperature=0,
   )

   return explanation.choices[0].message.content
