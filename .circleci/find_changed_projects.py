#!/usr/bin/env python3
# -*- coding: utf-8 -*-

projects = ['client', 'server', 'docs']

import requests
import subprocess
import os
from pprint import pprint

def get_workflows(branch):
    r = requests.get('https://circleci.com/api/v1.1/project/github/yunity/karrot-united-demo/tree/{}?limit=100'.format(branch))
    j = r.json()

    workflows = {}
    workflows_sorted = []
    for job in j:
        w_id = job['workflows']['workflow_id']
        if not workflows.get(w_id):
            workflows[w_id] = {'jobs': [], 'id': w_id}
        workflows[w_id]['jobs'].append(job)
        if w_id not in workflows_sorted:
            workflows_sorted.append(w_id)

    return [workflows[w_id] for w_id in workflows_sorted]


def get_first_finished_workflow(workflows):
    workflow = None
    for workflow in workflows:
        print('analyzing workflow', workflow['id'])
        workflow['finished'] = all(e['lifecycle']=='finished' for e in workflow['jobs'])
        workflow['commit'] = workflow['jobs'][0]['vcs_revision']
        for project in projects:
            project_jobs = [j for j in workflow['jobs'] if j['workflows']['job_name'].startswith(project)]
            workflow[project] = {
                'success': all(e['outcome']=='success' for e in project_jobs)
            }
        if workflow['finished']:
            break

    return workflow


def touch(filename):
    with open(filename, 'a') as f:
        f.write('')


branch = os.environ.get('CIRCLE_BRANCH')
workflow = None
if branch:
    workflow = get_first_finished_workflow(get_workflows(branch))
if workflow is None:
    workflow = get_first_finished_workflow(get_workflows('master'))

print('got status from workflow', workflow['id'])
pprint(workflow)

changed_files = subprocess.check_output(['git', 'diff', workflow['commit'], 'HEAD', '--name-only']).decode().split()

for project in projects:
    changed = any(f.startswith(project + '/') for f in changed_files)
    success = workflow[project]['success']

    os.mkdir('{}/ci_meta'.format(project))

    if not changed:
        touch('{}/ci_meta/not_changed'.format(project))
        print(project, 'not changed')

    if success:
        touch('{}/ci_meta/success'.format(project))
        print(project, 'successful')
