const core = require('@actions/core');
const {graphql} = require('@octokit/graphql');

const createProject = `mutation createProject($repo_id: [ID!], $owner_id: ID!, $project_name: String!, $project_body: String) {
  createProject( input:{repositoryIds: $repo_id, ownerId: $owner_id, name: $project_name,  body: $project_body, }) {
      project{
        id
        body
        name
        owner{
          id
        }
        columns(first: 100){
          totalCount
          nodes{
            id
            name
          }
        }
      }
    }
  }
`

async function addRepoProject(repo, projectName, projectBody ) {
  // @todo: add null parameter rejection for required parameters
  projectBody = projectBody || null;
  
  const queryVariables = Object.assign({},{
      repo_owner: repo.owner, 
      repo_name: repo.name,
      headers: {
          authorization: `Bearer ` + repo.token,
          accept: `application/vnd.github.bane-preview+json`,
          },   
      },
      { repo_id: [repo.id], owner_id: repo.id, project_name: projectName, project_body: projectBody }
  );

  try {
      console.log("vars: ", JSON.stringify(queryVariables));

      const response = await graphql(
        createProject,
         queryVariables 
      );
      return response.createProject.project;
  } catch (err) {
      console.log("failed", err.request)
      console.log(err.message)
      return null;
  }
}


const stages = [
  // {
  //   "color": "5f5f5f",
  //   "description": "This issue is new and waiting for triage",
  //   "name": "0: NEW",
  // },      
  {
    "color": "1f7f5f",
    "description": "This issue is being investigated",
    "name": "3: INVESTIGATION",
  },
  {
    "color": "5f5f9f",
    "description": "This issue is being implmemented",
    "name": "3: IMPLEMENTATION",
  },           
  {
    "color": "1f7f9f",
    "description": "This issue is being tested",
    "name": "3: TESTING",
  },
  {
    "color": "3f5fbf",
    "description": "This issue is can be released",
    "name": "3: RELEASE",
  },       
];

const createColumn = `mutation addProjectColumn($project_id: ID!, $column_name: String!) {
  addProjectColumn(input:{projectId: $project_id, name: $column_name }) {
    project{
      id
      name
      columns(first:100) {
        nodes{
          id
          name
        }
      }
    }  
  }
}
`

async function addProjectColumn(repo, projectId, columnName ) {
  // @todo: add null parameter rejection for required parameters
  
  const queryVariables = Object.assign({},{
      repo_owner: repo.owner, 
      repo_name: repo.name,
      headers: {
          authorization: `Bearer ` + repo.token,
          accept: `application/vnd.github.bane-preview+json`,
          },   
      },
      { project_id: projectId, column_name: columnName }
  );

  try {
      console.log("vars: ", JSON.stringify(queryVariables));

      const response = await graphql(
        createColumn,
         queryVariables 
      );
      return response.addProjectColumn.project;
  } catch (err) {
      console.log("failed", err.request)
      console.log(err.message)
      return null;
  }
}


async function action (){
  var repoConfig = {
    id: null,
    name: 'empty',
    owner: 'you',
    token: null
  };

  // console.log(JSON.stringify(stages));

  try {
    repoConfig.id = core.getInput('repo-id', {required: true});
    repoConfig.name = core.getInput('repo-name', {required: true});
    repoConfig.owner = core.getInput('repo-owner', {required: true});
    repoConfig.token = core.getInput('repo-token', {required: true});
    console.log("repo:\n" + JSON.stringify(repoConfig));
    
    var projectName = core.getInput('project-name', {required: true});
    var projectBody = core.getInput('project-body', {required: true});
    // console.log(projectName + "  " + projectBody);
    
    const resultProject = await addRepoProject(repoConfig, projectName, projectBody);
    // console.log("project result: ", JSON.stringify(resultProject));
    
    var projID = resultProject.id;
    // console.log(projID);
    for(const stage of stages) {
        const resultColumn = await addProjectColumn(repoConfig, resultProject.id, stage.name)
        // console.log("project result: ", JSON.stringify(resultColumn));               
    }
    console.log("final result:\n", JSON.stringify(resultColumn));               
  } catch (err) {
      console.log("failed", err.request)
      console.log(err.message)
  }
}

action();