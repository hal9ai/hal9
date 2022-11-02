
export function Dependencies(hal9api) {
  function getForwardInt(sid, steps, deps) {
    const forward = {};
    for (let dep of Object.keys(deps)) {
      let backwards = deps[dep];
      for (let backward of backwards) {
        if (!forward[backward]) forward[backward] = [];
        if (!forward[backward].includes(dep)) forward[backward].push(dep);
      }
    }

    let toadd = forward[sid] ?? [];
    let added = {};
    let result = [];

    let maxdeps = 10000;
    while (toadd.length > 0) {
      if (maxdeps-- <= 0) throw('Recursive dependency or too many dependencies');

      const el = toadd.shift();

      if (!added[el]) result.push(parseInt(el));
      added[el] = true;

      if (forward[el]) {
        toadd = toadd.concat(forward[el]);
      }
    }

    return result;
  }

  this.getForward = async function(pid, sid) {
    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);
    const deps = await hal9api.pipelines.getDependencies(pid);

    return getForwardInt(sid, steps, deps);
  }

  this.getInitial = async function(pid) {
    debugger;

    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);
    let deps = await hal9api.pipelines.getDependencies(pid);

    steps.map(step => step.id).forEach(id => {
      if (!deps[id]) deps[id] = [];
    });

    let alldeps = []
    
    let added = {};
    Object.keys(deps).forEach(dep => {
      if (Object.keys(deps[dep]).length == 0) {
        alldeps.push(parseInt(dep));
        added[dep] = true;
      }
      else {
        added[dep] = false;
      }
    });

    const hasMissing = () => Object.keys(added).some(x => !added[x]);
    const getMissing = () => Object.keys(added).find(x => !added[x])

    let initidx = 0;
    while (hasMissing() && initidx < Object.keys(alldeps).length) {
      const searchfrom = alldeps[initidx++];
      const forward = getForwardInt(searchfrom, steps, deps);

      forward.forEach((dep) => {
        if (!added[dep]) {
          alldeps.push(dep);
          added[dep] = true;
        }
      });
    }

    return alldeps;
  }
}