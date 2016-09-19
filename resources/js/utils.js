function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		// XHR for Chrome/Firefox/Opera/Safari.
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest != "undefined") {
		// XDomainRequest for IE.
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		// CORS not supported.
		xhr = null;
	}
	return xhr;
}

function get_url_auth_token(client_id, client_secret, auth_code) {
	var url = 'https://github.com/login/oauth/access_token?client_id='
			+ client_id + '&client_secret=' + client_secret + '&code='
			+ auth_code;
	return url;
}

function fetch_git_auth_token(client_id, client_secret, auth_code) {
	var access_token = null;
	var xhr = createCORSRequest('POST', get_url_auth_token(client_id,
			client_secret, auth_code));
	xhr.setRequestHeader('Accept', 'application/json');
	if (!xhr) {
		throw new Error('CORS not supported');
	}

	xhr.send();

	xhr.onload = function() {
		if (xhr.status == 200) {
			var responseText = xhr.responseText;
			responseJson = JSON.parse(responseText);
			access_token = responseJson.access_token;
			console.log('Extracted auth token is '+access_token);
			if(access_token != null){
				console.log(access_token);
			var gh = new GitHub({
				   token: access_token
				});
			
			/*
			 * console.log("Fetching User Details"); const user =
			 * gh.getUser('AnuragMala'); user.listRepos() .then(function({data:
			 * reposJson}) { console.log(reposJson); });
			 * 
			 * console.log("Fetching User specific Repo Contents"); const repo =
			 * gh.getRepo('AnuragMala','TestReportRepo');
			 * repo.getContents(null,'latestfolder',true,repo_contents_callback);
			 */
			
			console.log("Fetching Organizations");
			const org = gh.getOrganization('Teletrax');
			org.getRepos(org_repos_callback).then(function({config: configObj}){
				console.log(configObj.params);
				configObj.params.access_token=access_token;
			});
			}
		}
	}


	return access_token;
}

function repo_contents_callback(error, result, request) {
	if (error == null && request.status == 200) {
		console.log(result);
		console.log(request);
	}
}

function org_repos_callback(error, result, request) {
	if (error == null && request.status == 200) {
		console.log(result);
		console.log(request);
	}
}
