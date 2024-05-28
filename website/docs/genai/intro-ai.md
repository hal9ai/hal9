---
sidebar_position: 1
---

import RosenblattNYT from './intro-ai-nyt-learning-device-1958.jpeg';
import PerceptronLayered from './intro-ai-perceptron-multilayered.png';
import NewtonMethod from './intro-ai-newton-method.png';
import Imagenet from './intro-ai-imagenet.jpg';

# Intro to AI

## The Perceptron

Back in 1958, Frank Rosenblatt believed computers should be able to recognize people and call out their names and instantly translate speech in one languange or writting in another langunage.

<center><img src={RosenblattNYT} alt="New York Times 1958 on Frank Rosenblatt" style={{width: 500}} /></center>

To accomplish this, Rosenblatt developed a theory for a hypothetical nervous system based on units of perceptrons, see [Cornell Chronicle's Rosenblatt](https://news.cornell.edu/stories/2019/09/professors-perceptron-paved-way-ai-60-years-too-soon) article.

The perceptron maps stimuli to numeric inputs that are weighted into a threshold function that activates only when enough stimuli is present, mathematically:

<center><img src="https://latex.codecogs.com/svg.latex?f(x) = \begin{cases} 1 & \sum_{i=1}^m w_i x_i + b > 0\\ 0 & \text{otherwise} \end{cases}" /></center>

For example, if you wanted to classify the number one in an image of 2x2 pixels, you could encode these pixels into an array of values `I = [[0,1], [0,1]]` and use the perceptron equation with coefficients `W = [[-1, 1], [-1, 1]]` such that multiplying the pixels times the array of coefficients `W*I` classifies the image as the number one when the value is larger than zero.

Minsky and Papert found out that a single perceptron can classify only datasets that are linearly separable; however, they also revealed in their book _Perceptrons_ that layering perceptrons would bring additional classification capabilities. The next Figure presents the original diagram showcasing a multilayered perceptron.

<center><img src={PerceptronLayered} alt="Multi-layered Perceptron" style={{width: 500}} /></center>

These layers of chained perceptrons are what we call today Deep Neural Networks. However, Minsky and Papert had no clue as to how to find all the correct weights `W` to classify more complex values. Intuitively, we could define an image with 128x128 pixels and connect several perceptrons together; if we could only find the right `W` values, we could potentially recognize people in an image -- for many decades, we found no solution as to how to find the correct weights for complex layers with many perceptrons.

## Backpropagation

Let's go back to our 2x2 pixels image classification example. We can redefine this problem as a function that given weights computes *f(W)=W\*I*. If we give random values to *W*, it will compute something that may or may not be bigger than zero, and may or may not classify the image correctly. But that's fine, we can then compare the value *f(W)* against what we want, say 1 to classify the image correctly, and redefine this with the equation *f(W)=1*. That is, we want to find the values of *W* that satisfy the quation *f(W)-1=0*.

You can think of *f(W)-1* as the error measurement that we are trying to minimize, we don't want any random *W* values, we want weights that help us classify the image correctly.

**Calculus to the rescue!** We can solve equations like *f(W)-1* using the [Newton–Raphson method](https://en.wikipedia.org/wiki/Newton%27s_method), which differentiates the equation, picks random numbers of W, and then moves towards the direction that gets closer to the solution (the local minima). Check [Khan Academy's Newton's method](https://www.khanacademy.org/math/ap-calculus-ab/ab-differentiation-1-new/ab-2-1/v/newton-leibniz-and-usain-bolt).

<center><a href="https://towardsdatascience.com/newton-raphson-explained-and-visualised-23f63da21bd5"><img src={NewtonMethod} alt="Multi-layered Perceptron" style={{width: 500}} /></a></center>

This approach, among many other improvements beyond the scope of this introduction, is what Geoff Hinton used to solve this. The strategy used in DNN is called *Backpropagation* and uses **gradient descent** as the method used to find local minima in n-dimensional spaces. To keep this simple, you can think of gradient descent as Newton-Raphson method for more complex equations.

Is forth mentioning that the original perceptron function is not differentiable, to solve this problem, we replace that function that is similar enough, like a sigmoid function or a ReLU function, that are close enough and we call it a day. We also use technices like dropout to escape local minima in our search for weights.

## Autodiff

You might be thinking, in order to classify images using DNN, do I need to differentiate complex equations by hand? That would be ceritanly a lot of fun, but certainly not. We have developed computer libraries that perform automatic differentiation (**autodiff**) to avoid having to compute them by hand. So these days we can simply define our DNN network by code, and a computer library (usually written in Python) will differentiate, apply gradient descent and gives us the final weights. With one important caveat!

Gradient descent is an incremental algorithm taht takes computing resources, and even worse, DNNs have hundreds of layers and sometimes millions of perceptrongs or more. Not only that but we usually need also millions of iamges to classify is something is a cat or not, so there is a lot of computing going on to put all this together.

<center><a href="https://paperswithcode.com/dataset/imagenet"><img src={Imagenet} style={{width: 400}} /></a></center>

To crunch all the numbers, is very comon not to use CPUs (Central Processing Unit) but rather GPUs (Graphic Processing Unit) which where originally designed to play videogames and are really good at rendering 3D in parallel, which happens to be very similar to iterate in parallel for DNN.

That's about it, you are somewhat caught up with AI just before the advent of [Generative AI](intro-genai).
