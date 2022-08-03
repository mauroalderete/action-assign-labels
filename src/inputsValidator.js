const pullRequestNumber = function( pullRequestNumber ){
    if (!pullRequestNumber){
        throw new Error(`pull-request-number is not defined`)
    }

    const value = parseInt(pullRequestNumber, 10)
    if (isNaN(value)){
        throw new Error(`pull-request-number '${pullRequestNumber}' is not a number type`)
    }
}
    
const githubToken = function( githubToken ){
    if (!githubToken){
        throw new Error(`github-token is not defined`)
    }

    if (githubToken.trim() == ''){
        throw new Error(`github-token cann't be empty`)
    }
}

module.exports = { pullRequestNumber, githubToken };
