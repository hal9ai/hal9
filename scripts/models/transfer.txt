#
# input: [ pepsi, coke ]
# image: tensorflow/tensorflow:devel-1.12.0
# 
# docker pull tensorflow/tensorflow:devel-1.12.0
# docker run -it -p 6006:6006 your_tensorflow_docker_name
#

git clone https://github.com/googlecodelabs/tensorflow-for-poets-2

python tensorflow-for-poets-2/scripts/retrain.py \
  --model_dir=/tensor_flow/inception-v3 \
  --output_graph=/tensor_flow/cats_retrained.pb \
  --output_labels=/tensor_flow/cats_labels.txt \
  --image_dir=/tensor_flow/cat-images/ \
  --bottleneck_dir=/tensor_flow/cats_bottleneck

tensorboard --logdir /tmp/retrain_logs/

bazel-bin/tensorflow/examples/label_image/label_image \
  --graph=/tensor_flow/cats_retrained.pb \
  --image=/tmp/lab1.jpg \
  --input_layer=Mul \
  --output_layer=final_result \
  --labels=/tensor_flow/cats_labels.txt

echo '"done!"' > data.json

# See https://dzone.com/articles/transfer-learning-how-to-classify-images-using-ten
# See https://github.com/googlecodelabs/tensorflow-for-poets-2/blob/master/scripts/retrain.py
