---
slug: OpenAI-Agents-SDK
title: "Discovering the New OpenAI Agents SDK" 
authors: [luis]
tags: [OpenAI, Agents, Tools]
image: https://hal9.com/docs/screenshots/openai-agents-sdk.jpg
---

import ThemedImage from '../../src/components/themedimg.jsx'

## **Introduction**

In today’s rapidly evolving landscape of artificial intelligence, building agentic applications that are both powerful and accessible is more important than ever. The new OpenAI Agents SDK brings a production-ready upgrade to the experimental era of agents, offering a lightweight, Python-first package that streamlines the development process. With a focus on four core concepts—Agents, Handoffs, Guardrails, and Tracing—this SDK empowers developers to design and implement complex workflows without a steep learning curve. In this post, we explore these key concepts, outline the features that set this SDK apart, and discuss its potential to transform real-world applications.

---

## **The Four Core Concepts**

### **1. Agents**

At the heart of the SDK are Agents—large language models configured with specific instructions, integrated tools, and tailored safety checks. These agents are designed to operate autonomously, carrying out tasks as defined by their programming while maintaining the flexibility to interact with various tools.

**Basic Configuration:**  
- **Instructions:** Also known as a developer message or system prompt, these guide the agent’s behavior.  
- **Model:** Specifies which LLM to use, along with optional model_settings to fine-tune parameters such as temperature, top_p, etc.  
- **Tools:** Defines the set of tools the agent can leverage to achieve its tasks.

```python
from agents import Agent, ModelSettings, function_tool

@function_tool
def get_weather(city: str) -> str:
    return f"The weather in {city} is sunny"

agent = Agent(
    name="Haiku agent",
    instructions="Always respond in haiku form",
    model="o3-mini",
    tools=[get_weather],
)
```

### **2. Handoffs**


Handoffs introduce a powerful mechanism for collaboration among agents. This feature allows an agent to delegate a specific task or decision to another agent that is better suited to handle it. Imagine a scenario where one agent is focused on natural language understanding while another excels in translation or data processing—the handoff system enables seamless switching of responsibilities, ensuring that each part of the process is handled by the most capable component.

```python
spanish_agent = Agent(
    name="Spanish agent",
    instructions="You only speak Spanish.",
)

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
)

triage_agent = Agent(
    name="Triage agent",
    instructions="Handoff to the appropriate agent based on the language of the request.",
    handoffs=[spanish_agent, english_agent],
)


async def main():
    result = await Runner.run(triage_agent, input="Hola, ¿cómo estás?")
    print(result.final_output)
    # ¡Hola! Estoy bien, gracias por preguntar. ¿Y tú, cómo estás?
```

### **3. Guardrails**

Guardrails are built-in, configurable safety checks that run in parallel with your agents, ensuring that only valid and appropriate inputs are processed and acting as an essential first line of defense by filtering out requests that might lead to unintended or malicious use of high-cost resources. For example, imagine you have an agent that utilizes a sophisticated (and consequently slower and more expensive) model to assist with customer requests; you wouldn't want users to exploit this resource for unrelated tasks, such as solving math homework, which could drain resources unnecessarily. By deploying a guardrail that leverages a faster, cost-efficient model, you can quickly validate incoming queries, and if any suspicious or off-target input is detected, the guardrail immediately raises an error to prevent the expensive model from running, thereby saving both time and money while enhancing overall system performance and security.

```python
class MathHomeworkOutput(BaseModel):
    is_math_homework: bool
    reasoning: str

guardrail_agent = Agent( 
    name="Guardrail check",
    instructions="Check if the user is asking you to do their math homework.",
    output_type=MathHomeworkOutput,
)


@input_guardrail
async def math_guardrail( 
    ctx: RunContextWrapper[None], agent: Agent, input: str | list[TResponseInputItem]
) -> GuardrailFunctionOutput:
    result = await Runner.run(guardrail_agent, input, context=ctx.context)

    return GuardrailFunctionOutput(
        output_info=result.final_output, 
        tripwire_triggered=result.final_output.is_math_homework,
    )


agent = Agent(  
    name="Customer support agent",
    instructions="You are a customer support agent. You help customers with their questions.",
    input_guardrails=[math_guardrail],
)

async def main():
    # This should trip the guardrail
    try:
        await Runner.run(agent, "Hello, can you help me solve for x: 2x + 3 = 11?")
        print("Guardrail didn't trip - this is unexpected")

    except InputGuardrailTripwireTriggered:
        print("Math homework guardrail tripped")
```

### **4. Tracing**

Tracing is a built-in feature of the Agents SDK that collects a comprehensive record of every event during an agent run—including LLM generations, tool calls, handoffs, guardrails, and even custom events—to provide deep visibility into your workflows. With a dedicated Traces dashboard, you can easily debug, visualize, and monitor the entire execution process both during development and in production. Each complete workflow is recorded as a trace, which is composed of multiple spans that capture detailed information (such as start and end times, operation details, and metadata) about individual operations like agent execution, LLM responses, and function calls. Tracing is enabled by default, although you have the option to disable it globally via the `OPENAI_AGENTS_DISABLE_TRACING` environment variable or for a single run by setting `RunConfig.tracing_disabled` to True; note that it is unavailable for organizations with a Zero Data Retention (ZDR) policy. Additionally, you can group multiple runs under a single trace for higher-level analysis and configure custom trace processors to export data to alternative backends or process it further. This rich tracing infrastructure not only helps you understand and optimize your agent workflows but also ensures that sensitive data can be safeguarded by configuring what is captured, making it an invaluable tool for both troubleshooting and performance tuning.


```python
with trace("Joke workflow"): 
    first_result = await Runner.run(agent, "Tell me a joke")
    second_result = await Runner.run(agent, f"Rate this joke: {first_result.final_output}")
    print(f"Joke: {first_result.final_output}")
    print(f"Rating: {second_result.final_output}")
```

### **Implementation Example: The Problem Solver Agent**

In this example, we integrate all four core concepts—Agents, Handoffs, Guardrails, and Tracing—into one powerful "Problem Solver Agent". This agent is designed to intelligently decide whether to execute Python code for computational queries or to provide a direct text explanation for general questions. A smart guardrail assesses the query’s nature: if it’s computational, the task is delegated to a dedicated Python Executor Agent; if not, the agent responds directly. This approach combines the sophistication needed for high-level tasks with the simplicity that keeps your code easy to understand and maintain.

Curious to see our Problem Solver Agent in action? Try out our interactive demo and experience its capabilities firsthand at [Try the Problem Solver Agent](https://hal9.com/luis/openai-agents).

Interested in the details? Explore the complete implementation on GitHub and customize it to fit your needs at [Hal9 Problem Solver Repository](https://github.com/LuisGuillen03/Hal9-OpenaiAgents).

<center><a href="https://hal9.com/luis/openai-agents"><ThemedImage src="openai-agents"/></a></center>

---

### **Conclusion**

This library strikes the perfect balance between advanced functionality and ease of use. It enables you to build sophisticated, high-level applications—like our Problem Solver Agent—while keeping your code clean and accessible. By seamlessly integrating dynamic agent behavior, smart handoffs, robust guardrails, and detailed tracing, this framework offers a versatile foundation that scales from simple text explanations to complex computational tasks. Whether you're developing a dedicated problem solver, a custom chatbot, or another intelligent tool, this solution provides the power you need without sacrificing clarity or maintainability.

### **References**

- [New tools for building agents](https://openai.com/index/new-tools-for-building-agents/)  
- [Docs OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [Github OpenAIAgentsSDK](https://github.com/openai/openai-agents-python/tree/main)