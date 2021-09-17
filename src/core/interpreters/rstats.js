
export default function(python) {
  const script =  `
    const { stdout, stderr } = await exec('R -e "print(1+1)"', { timeout: 5000 } );

    data = stdout;
  `;

  return script;
}
