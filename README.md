# Scheduler Tester

> Tool to test queries-scheduler

[![Greenkeeper badge](https://badges.greenkeeper.io/AutoScheduleJS/scheduler-tester.svg)](https://greenkeeper.io/)
[![Maintainability](https://api.codeclimate.com/v1/badges/dfafdf7469e4f7cd26d6/maintainability)](https://codeclimate.com/github/AutoScheduleJS/scheduler-tester/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/dfafdf7469e4f7cd26d6/test_coverage)](https://codeclimate.com/github/AutoScheduleJS/scheduler-tester/test_coverage)
[![Build Status](https://travis-ci.org/AutoScheduleJS/scheduler-tester.svg?branch=master)](https://travis-ci.org/AutoScheduleJS/scheduler-tester)

goal:
test queries-scheduler with provided data (queries), without requesting agents.
Inspect payload sent to conflict-resovler or agent-relay.

flow dependency:
- queries-scheduler
  - schedule$
- userstate-manager
  - queryToStatePotentials

structure dependency:
- queries-scheduler
  - IMaterial

features:
- user choose to use real module or mock
- user configure modules
  - agent-relay & conflict-resolver
    - response (to send if empty) or real url or prompt user
- user create queries and initial state
- if module prompt user, display all context.
- display materials on timeline. Could also display potentials if potential stream is accessible.
- idempotent: use same core-logic whether using UI or CLI

UI:
- horizontally splitted screen with editing panel for userstate/queries (tabs) & material's visualization (simple mode)
- panels are not resizable (by hand), but there could be a 'focus' display for editing or visualization.
- new queries are generated from FAB -> scroll to top, unzoom visualization panel, create default query in selected suite.
- randomize color for each query, that match material in visualization

core-logic actions:
- based on FLUX
- default to loaded state & queries
- import suite (queries)
- use specific userstate
- save current suite/userstate
- add/edit/remove query from suite
- add/edit/remove data from collection (json editor)
- add/edit/remove collection
- proceed (send to scheduler)
- step: every ; last

state:
- suites: Queries[][]
- userstates: { collectionName: string, data: any[] }[][]
- stepOption: Enum { every, last }
- onTestbenchUserstate: { collectionName: string, data: any[] }[]
- onTestbenchQueries: Queries[]
