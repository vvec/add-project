const core = require('@actions/core');
// const github = require('@actions/github');
const githubUtils = require('../../utils');


async function action (){
  var repoConfig = {
    id: null,
    name: 'empty',
    owner: 'you',
    token: null
  };
  const stages = githubUtils.motusDefault.stages;
  console.log(JSON.stringify(stages));

  try {
    console.log("config: " + JSON.stringify(repoConfig));
    repoConfig.id = core.getInput('repo-id', {required: true});
    repoConfig.name = core.getInput('repo-name', {required: true});
    repoConfig.owner = core.getInput('repo-owner', {required: true});
    repoConfig.token = core.getInput('repo-token', {required: true});
    console.log("config: " + JSON.stringify(repoConfig));
    var projectName = core.getInput('project-name', {required: true});
    // projectName = JSON.parse(projectName);
    var projectBody = core.getInput('project-body', {required: true});
    // projectName = JSON.parse(projectBody);
    console.log(projectName + "  " + projectBody);
    const resultProject = await githubUtils.addRepoProject(repoConfig, projectName, projectBody);
    console.log("project result: ", JSON.stringify(resultProject));
    var projID = resultProject.id;
    console.log(projID);
    for(const stage of stages) {
        const resultColumn = await githubUtils.addProjectColumn(repoConfig, resultProject.id, stage.name)
        console.log("project result: ", JSON.stringify(resultColumn));               
    }
  } catch (err) {
      console.log("failed", err.request)
      console.log(err.message)
  }
}

// setup();
action();