import { getconsole }  from './getconsole'
import { preflight }  from './preflight'
import { runpipeline }  from './runpipeline'
import { runstep }  from './runstep'

import { backendinit } from './backend/init'
import { backendheartbeat } from './backend/heartbeat'
import { backendeval } from './backend/eval'
import { backendupdate } from './backend/update'
import { backendgetpipeline } from './backend/getpipeline'
import { backendgetfile } from './backend/getfile'
import { backendputfile } from './backend/putfile'

import { terminit, termread, termwrite } from './terminal/terminal.js'

export const operations = {
	console: getconsole,
	pipeline: runpipeline,
	preflight: preflight,
	step: runstep,
	runstep: runstep, // for backwards compatibility, can remove after a few versions
	backendinit: backendinit,
	backendheartbeat: backendheartbeat,
	backendeval: backendeval,
	backendupdate: backendupdate,
	backendgetpipeline: backendgetpipeline,
	backendgetfile: backendgetfile,
	backendputfile: backendputfile,
	terminit: terminit,
	termread: termread,
	termwrite: termwrite,
}
