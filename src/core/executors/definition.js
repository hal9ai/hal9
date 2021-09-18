
export default class Executor {
  constructor(inputs, step, context, script, params, deps, state, language, callbacks, pipelinename) {
    this.inputs = inputs;
    this.step = step;
    this.context = context;
    this.script = script;
    this.params = params;
    this.deps = deps;
    this.state = state;
    this.language = language;
    this.callbacks = callbacks;
    this.pipelinename = pipelinename;
  }

  async runStep() {
    throw "Executor is an abstract class";
  }
}
