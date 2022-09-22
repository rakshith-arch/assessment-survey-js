/**
 * Contains utils for working with URL strings.
 */

export function getAppType(url: string): string {
    const pathname = getPathName(url);
    const pathParts = pathname.split('/');
    return pathParts[1];
}

function getPathName(url: string): string {
    const urlRef = new URL(url);
    return urlRef.pathname;
}