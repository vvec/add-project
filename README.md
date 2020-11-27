# vvec-org/add-project
This action adds a project to the current repo with a defined set of columns

## inputs
This action requires the following user inputs:

input | description
---- | ----
repo-id | the (node) ID of the repository 
repo-name | name of the repository
repo-owner | owner of the repository
repo-token | authorization token to access the repository
project-name | a name for the project to add
project-body | descriptive text for the project

## outputs
none

## dependencies
This action uses:
- the GitHub GraphQL API
- the workflow run context.
- the @action/core package.
- the vvec-org/utils package to wrap the GraphQL API

*NOTE* This is action is in development and is subject to change

