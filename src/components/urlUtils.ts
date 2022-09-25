/**
 * Contains utils for working with URL strings.
 */


export function getAppType(): string {
  const pathParams = getPathName();
  const appType = pathParams.get('appType');
  return appType;
}

export function getUUID(): string{
	const pathParams = getPathName();
	const nuuid = pathParams.get('uuid');
	return nuuid;
}

export function getDataFile(): string{
	const pathParams = getPathName();
	const data = pathParams.get('data');
	return data;
}



function getPathName(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	return urlParams;
}
