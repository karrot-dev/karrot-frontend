#!/usr/bin/env python

import subprocess
subprocess.run(['pip-compile', 'requirements.in'])
subprocess.run(['pip-compile', 'requirements-dev.in'])
