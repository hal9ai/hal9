---
sidebar_position: 4
---

import GAN from './sd-gan.png';
import StyleGAN from './sd-style-gan.png';
import DalleCompare from './sd-dalle-compare.png';
import LatentDiffusion from './sd-latent-diffusion.png';
import DenoiseProcess from './sd-denoise-process.png';
import FluxHal9 from './sd-flux-hal9.png';

# Stable Diffusion

An introduction to image generation technologies, leading us to advanced systems like DALL·E, [Midjourney](https://www.midjourney.com/), and Flux.

## Generative Adversarial Networks

In 2014, researchers explored the use of Deep Neural Networks (DNNs) not just for classification, but for generating images. The approach, introduced as [Generative Adversarial Networks](https://arxiv.org/abs/1406.2661) (GANs), utilized two DNNs: one to generate images and the other to discriminate between real and generated images. The images produced were intriguing at the time but, in hindsight, represent an early step toward today’s image generation technologies.

<center><a href="https://arxiv.org/abs/1406.2661"><img src={GAN} style={{width: 500}} /></a></center>

One limitation of GANs is the lack of control over the generated content. GANs rely on a random vector that does not correspond to specific features of the generated image.

## StyleGAN

In 2018, research from [A Style-Based Generator Architecture for Generative Adversarial Networks](https://arxiv.org/abs/1812.04948) (StyleGAN) proposed a method for more granular control over generated images. Instead of using a random vector, StyleGAN uses a hidden (latent) vector to manage this control. The latent space can be thought of as an [embedding](llm.md#embeddings) that allows for manipulation of the style. Unlike GANs, the vector in StyleGAN is no longer randomly mapped; its dimensions have specific meanings, such as day or night, indoors or outdoors.

These improvements enabled the generation of far more compelling images. It is also important to note that the inputs to the networks are vectors within the latent space.

<center><a href="https://arxiv.org/abs/1406.2661"><img src={StyleGAN} style={{width: 500}} /></a></center>

While the latent space was useful, it remained challenging when it came to generating specific images. The dimensions in this space are not intuitive human categories like "day or night," but rather abstract DNN dimensions. Therefore, users had to explore these dimensions to tweak and achieve the desired outcome.

## DallE

With transformers demonstrating their utility in 2018, OpenAI researchers introduced [Zero-Shot Text-to-Image Generation](https://arxiv.org/abs/2102.12092) in 2021 to generate images from text descriptions. This model, named DALL·E, effectively replaced the latent space levers from the StyleGAN approach with text input.

<center><a href="https://arxiv.org/abs/2102.12092"><img src={DalleCompare} style={{width: 500}} /></a></center>

This was a significant leap forward in terms of controlling the output image; however, the generated images still lacked high-quality realism.

## Latent Diffusion

The breakthrough came in 2021 with the introduction of [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752), which reintroduced the latent space concept but focused on super-resolution.

<center><a href="https://arxiv.org/abs/2102.12092"><img src={LatentDiffusion} style={{width: 500}} /></a></center>

The key innovation was to avoid generating the image from scratch. Instead, the model learned to corrupt an image in reverse. For instance, if you start with an image of a car, the model is trained to deconstruct it, learning how to "destroy" the concept of a car. During image generation, this process is reversed: starting with a noisy image, the model incrementally refines it to resemble, say, a car. This method enables the model to create higher resolution images, improving the quality with each iteration. Essentially, the model becomes adept at transforming a rough image into a refined, detailed one.

<center><a href="https://en.wikipedia.org/wiki/Stable_Diffusion"><img src={DenoiseProcess} style={{width: 500}} /></a></center>

## Stable Diffusion

Stable diffusion, a term that will soon require further refinement, can be thought of as an umbrella concept encompassing a variety of techniques for state-of-the-art image generation. Such systems typically use transformers for tunable text-to-image controls and latent diffusion for generating hyper-realistic images. The following example was generated with Hal9 and Flux. Use the following link to create your own:

<center><a href="https://hal9.com"><img src={FluxHal9} style={{width: 500}} /></a></center>
