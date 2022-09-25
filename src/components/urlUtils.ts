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
	const appType = pathParams.get('uuid');
	return appType;
}

function getPathName(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	return urlParams;
}
