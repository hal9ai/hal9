---
sidebar_position: 3
---

import Autoencoder from './llm-autoencoder.png';
import Transformer from './llm-transformer.png';
import GPT1 from './llm-gpt-1.png';

# Large Language Models

Learn foundational concepts like autoencoders, embeddings, transformers, and attention that lead to the development of GPTs and LLMs that exhibit advanced emergent abilities that generate content effectively.

## Embeddings

An Autoencoder is a type of [DNN](dnn.md) that does not require classification labels but rather, performs unsupervised learning by asking the DNN to classify the inputs of the network as the outputs. For example, when classifying the image of a cat, the pixels of that cat would be the input and the classification label would also be all the pixels of the cat.

<center><a href="https://towardsdatascience.com/applied-deep-learning-part-3-autoencoders-1c083af4d798"><img src={Autoencoder} style={{width: 500}} /></a></center>

This can seem pretty pointless, why would we spend so many compute resources training neural networks that produce the same output for the given input? Interestingly, it was discovered that the middle layer that contains an array (vector) of only a few numbers has very interesting properties, we will refer to this middle layer as the **embedding**.

It was found that such embeddings generalize and build intuitive understanding of the underlying data. For example, when using embeddings with text as input (as opposed to images), one can use them to ask a question like "What is the term for a king that is not a man?". Such question can be answered by simply adding and subtracting [King – Man + Woman](https://www.technologyreview.com/2015/09/17/166211/king-man-woman-queen-the-marvelous-mathematics-of-computational-linguistics/) and finding out the resulting embedding is actually the vector for Queen, which is surprising given that this was learned by the autoencoder itself. This is arguably an early example of emergent abilities, as in, an unexpected behavior the model was not designed to accomplish.

## Transformers

We can use a DNN to predict the next word from a given text; for example, we can train a DNN that given 3 embeddings tells us the next token, so we could ask the DNN to find the next work after `['King', 'wife', 'is']`. The initial text used is referred to as the text **prompt**. Using plain DNN, we would get descent completions from training over several books and we would be able to get reasonable guesses like 'Queen', for that example.

However, using standard (feedforward) DNN turns out to create predictions that are not that useful. For example, if we were to use the prompt "Rose is the Queen. Who is the King's wife?" We would likely get a response like "The Queen"; or even worse, an hallucination like "Queen Elizabeth" seen in the training text.

To solve that problem, variations to DNNs were explored like Recursive Neural Networks (RNNs), Long-Short Term Memory (LSTM) DNNs, and the like. Those showed improvements but it was not until the **transformer** was presented in the [Attention Is All You Need](https://arxiv.org/abs/1706.03762) paper.

<center><a href="https://arxiv.org/abd/1706.03762"><img src={Transformer} style={{width: 380}} /></a></center>

You can think of attention as using a DNN to figure out where in the text to put attention to, even if the reference to "Rose is the Queen" is way early in the prompt, the DNN will tell the DNN, to answer this question also look for references in these other parts of the text.

## Generative Pretrained Transformers

Transformers also surprised us with another level of emergent abilities, related to answering very basic questions in early 2018 with [GPT-1 by OpenAI](https://openai.com/index/language-unsupervised/). Over time, we found out that there are further [emergent abilities in larger transformer models](https://arxiv.org/abs/2206.07682) and started referring to pre-trained large transformer models as **Generative Pretrained Transformers** (**GPT**), models that use more data, more compute (GPUs), and more parameters to train complex DNN networks with backpropagation. To leave room for other kinds of models that go beyond transformers, we refer to large GPT models as **Large Language Models** (**LLM**).

<center><a href="https://openai.com/index/language-unsupervised/"><img src={GPT1} style={{width: 500}} /></a></center>

The *Generative* term in GPT comes from the ability to generate text (embeddings) and the focus on applications that generate content for question answering, summarization, and many of the emergent abilities a GPT shows.

Refer to [Advancements in Generative AI](https://arxiv.org/abs/2311.10242) for additional details or hop into the [Prompting](prompts.md) section to learn techniques to maximize the practical use of LLMs.
