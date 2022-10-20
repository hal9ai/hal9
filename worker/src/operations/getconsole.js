import * as remoteconsole from '../remoteconsole';

export const getconsole = async (req, res) => {
  const params = req.body.params;
  const result = remoteconsole.read(params.sessionid);
  res.send(result ? result : []);
}
