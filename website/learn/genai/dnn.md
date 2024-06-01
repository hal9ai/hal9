---
sidebar_position: 1
---

import RosenblattNYT from './dnn-nyt-perceptron.jpeg';
import PerceptronLayered from './dnn-perceptron-multilayered.png';
import NewtonMethod from './dnn-newton-method.png';
import Imagenet from './dnn-imagenet.jpg';

# Deep Neural Networks

Learn the origins of AI from the perceptron to deep neural networks, covering key advancements like backpropagation, gradient descent, and the importance of GPUs and large datasets in training complex models.

## The Perceptron

Back in 1958, [Frank Rosenblatt](https://en.wikipedia.org/wiki/Frank_Rosenblatt) believed computers should be able to recognize people and call out their names and instantly translate speech in one language or writing in another language.

<center><img src={RosenblattNYT} alt="New York Times 1958 on Frank Rosenblatt" style={{width: 500}} /></center>

To accomplish this, Rosenblatt developed a theory for a hypothetical nervous system based on units of perceptrons, see [Cornell Chronicle's Rosenblatt](https://news.cornell.edu/stories/2019/09/professors-perceptron-paved-way-ai-60-years-too-soon) article.

The perceptron maps stimuli to numeric inputs that are weighted into a threshold function that activates only when enough stimuli is present, mathematically:

<center><img src="https://latex.codecogs.com/svg.latex?f(x) = \begin{cases} 1 & \sum_{i=1}^m w_i x_i + b > 0\\ 0 & \text{otherwise} \end{cases}" /></center>

For example, if you wanted to classify the number one in an image of 2x2 [pixels](https://en.wikipedia.org/wiki/Pixel), you could encode these pixels into an array of values `I = [[0,1], [0,1]]` and use the perceptron equation with coefficients `W = [[-1, 1], [-1, 1]]` such that multiplying the pixels times the array of coefficients `W*I` classify the image as the number one when the value is larger than zero.

Minsky and Papert found out that a single perceptron can classify only datasets that are [linearly separable](https://en.wikipedia.org/wiki/Linear_separability); however, they also revealed in their book [Perceptrons](https://direct.mit.edu/books/monograph/3132/PerceptronsAn-Introduction-to-Computational) that layering perceptrons would bring additional classification capabilities, we refer to layered perceptrons as **Neural Networks** (**NN**). The next Figure presents the original diagram showcasing the multilayer perceptron neural network.

<center><img src={PerceptronLayered} alt="Multi-layered Perceptron" style={{width: 500}} /></center>

These layers of chained perceptrons are what we call today **Deep Neural Networks** (**DNN**). However, Minsky and Papert had no clue as to how to find all the correct weights `W` to classify more complex values. Intuitively, we could define an image with 128x128 pixels and connect several perceptrons together; if we could only find the right `W` values, we could potentially recognize people in an image -- for many decades, we found no solution as to how to find the correct weights for complex layers with many perceptrons.

## Gradient Descent

Let's go back to our 2x2 pixels image classification example. We can redefine this problem as a function that given weights computes *f(W)=W\*I*. If we give random values to *W*, it will compute something that may or may not be bigger than zero, and may or may not classify the image correctly. But that's fine, we can then compare the value *f(W)* against what we want, say 1 to classify the image correctly, and redefine this with the equation *f(W)=1*. That is, we want to find the values of *W* that satisfy the equation *f(W)-1=0*.

You can think of *f(W)-1* as the error measurement that we are trying to minimize, we don't want any random *W* values, we want weights that help us classify the image correctly.

Calculus to the rescue. We can solve equations like *f(W)-1* using the [Newton–Raphson method](https://en.wikipedia.org/wiki/Newton%27s_method), which differentiates the equation, picks random numbers of W, and then moves towards the direction that gets closer to the solution (the local minima) using the derivative of the equation. Check [Khan Academy's Newton's method](https://www.khanacademy.org/math/ap-calculus-ab/ab-differentiation-1-new/ab-2-1/v/newton-leibniz-and-usain-bolt).

<center><a href="https://towardsdatascience.com/newton-raphson-explained-and-visualised-23f63da21bd5"><img src={NewtonMethod} alt="Multi-layered Perceptron" style={{width: 500}} /></a></center>

This approach, among many other improvements that are beyond the scope of this introduction, is what [Geoff Hinton](https://en.wikipedia.org/wiki/Geoffrey_Hinton) used to find weights for DNN.

The strategy used to find weights in DNNs is called **[backpropagation](https://en.wikipedia.org/wiki/Backpropagation)** and uses **[gradient descent](https://en.wikipedia.org/wiki/Gradient_descent)** as the method used to find local minima in n-dimensional spaces. The term backpropagation comes from the process of finding the local minima by propagating the adjustments for the weights (backwards from output to input) to minimize the error using the derivative function to guide the direction. You can think of backpropagation as Newton-Raphson method for more complex equations. The process of finding the right weights is referred to as **training** the model. Check [the spelled-out intro to neural networks and backpropagation](https://youtu.be/VMj-3S1tku0?si=V9qAvlc7UNf3Ydy0) by [Andrej Karpathy](https://karpathy.ai/) for a detailed video explanation.

Is worth mentioning that the original perceptron function is not differentiable, to solve this problem, we replace it with a a function that is similar enough, like a [sigmoid function](https://en.wikipedia.org/wiki/Sigmoid_function) or a [ReLU function](https://en.wikipedia.org/wiki/Rectifier_(neural_networks)), which are close enough to the non-differentiable [step function](https://en.wikipedia.org/wiki/Heaviside_step_function). We also use techniques like [dropout](https://en.wikipedia.org/wiki/Dilution_(neural_networks)) to prevent [overfitting](https://en.wikipedia.org/wiki/Overfitting) in our search for optimal weights.

## Automatic Differentiation

You might be thinking, in order to classify images using DNN, do I need to differentiate complex equations by hand? That would certainly be a lot of fun, but certainly not. We have developed computer libraries that perform **automatic differentiation** (**autodiff**) to avoid having to compute them by hand. So these days we can simply define our DNN network by code, and a computer library (usually written in Python) will differentiate, apply gradient descent and give us the final weights. With one important caveat!

DNNs can have hundreds of layers and millions of perceptrons making the process not that trivial since, gradient descent is an incremental algorithm that requires significant computing resources. To train a DNN, we usually also need millions of images to classify them, which requires significant computing resources to successfully train DNNs. The following figure shows a well-known image classification dataset called [ImageNet](https://www.image-net.org/) which has been used to train image classification DNNs and contains hundreds of thousands of images.

<center><a href="https://paperswithcode.com/dataset/imagenet"><img src={Imagenet} style={{width: 400}} /></a></center>

To crunch all the numbers, is very common not to use CPUs but rather **graphic processing units** (**GPU**) which were originally designed for rendering 3D in parallel for video games. The algorithms used in [3D rendering](https://en.wikipedia.org/wiki/3D_rendering) happens to be very similar to the algorithms (matrix multiplication) required to train DNNs. Therefore, most training of DNNs happens today in several GPUs that we can rent from cloud providers like Amazon, Google, and Microsoft.

That's about it, you are somewhat caught up with AI just before the advent of Generative AI with [LLMs](llm.md).
