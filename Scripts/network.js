class Model{
    constructor(neuronsCount){
        this.layers=[];
        for(let i=0; i<neuronsCount.length-1; i++){
            this.layers.push(
                new Layer(neuronsCount[i],neuronsCount[i+1])
            );
        }
    }
    static forwardPass(givenInputs,model){
        let outputs = Layer.forwardPass(givenInputs,model.layers[0]);
        for(let i=1;i<model.layers.length; i++){
            outputs = Layer.forwardPass(outputs,model.layers[i]);
        }
        return outputs;
    }
}
class Layer{
    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);
        this.weights = [];
        this.#sigmoid();
        for(let i = 0; i<inputCount; i++){
            this.weights.push(new Array(outputCount));
        }
        Layer.#randomize(this);
    }
    static #randomize(layer){
        for(let i = 0;i <layer.inputs.length; i++){
            for(let j=0; j<layer.outputs.length; j++){
                layer.weights[i][j] = Math.random()*2-1;
            }
        }

        for(let i=0; i<layer.biases.length; i++){
            layer.biases[i] = Math.random()*2-1;
        }
    }

    static forwardPass(givenInputs,layer){
        for(let i=0; i<layer.inputs.length; i++){
            layer.inputs[i] = givenInputs[i];
        }

        for(let i=0;i<layer.outputs.length;i++){
            let sum = 0;
            for(let j=0; j<layer.inputs.length; j++){
                sum += layer.inputs[j]*layer.weights[j][i];
            }
            // layer.outputs[i] = layer.#sigmoid(sum+layer.biases[i]);
            if(sum>layer.biases[i]){
                layer.outputs[i] = 1;
            }else{
                layer.outputs[i] = 0;
            }
        }
        return layer.outputs;
    }

    #sigmoid(x){
        return 1/(1+Math.exp(-x));
    }
}