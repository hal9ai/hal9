
export const remoteInput = async (options) => {
  const wait = new Promise((accept, reject) => {
    const receive = event => {
      if (!event.data || event.data.hal9 != 'input') return;

      window.removeEventListener('message', receive);

      if (event.data.input) accept(event.data.input);
    }

  	window.addEventListener('message', receive);

    window.parent.postMessage({ hal9: 'input', options: options }, '*');
  })

  return await wait;
}

export const remoteOutput = async (output) => {
  window.parent.postMessage({ hal9: 'output', output: output }, '*');
}
