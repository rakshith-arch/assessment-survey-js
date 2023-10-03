// Interface that gets passed around the app components to gather all requried resources
// and that gets sent to the service worker for caching

interface ICacheModel {
    appName: string;
    contentFilePath: string;
    audioVisualResources: string[];
}
