#!/usr/bin/env python

import subprocess
subprocess.run(['pip-sync', 'requirements.txt', 'requirements-dev.txt'])
