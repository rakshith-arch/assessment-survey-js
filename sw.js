importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.precaching.precacheAndRoute([{"revision":"a9aaad295326251da249e1eec36e33a9","url":"css/style.css"},{"revision":"d06361a28aaf97ac6887dc6ccffd3e69","url":"dist/bundle.js"},{"revision":"2364a2746dbef47fa2601198fe4ed894","url":"img/bg_crayon-1.png"},{"revision":"0eb874baac10d2a76c7cc657c756acdf","url":"img/bg_v01.jpg"},{"revision":"56484ec92a16940b09c0d9fea2e4b11b","url":"img/chest.png"},{"revision":"0ab4538bcfd8f9ed476513dedfc4758a","url":"img/hill_v01.png"},{"revision":"38e43cd7b492b624fc3da67dea7b0433","url":"img/loadingImg.gif"},{"revision":"dc33b481685304c43d152362955b01f9","url":"img/monster.png"},{"revision":"7c15bf2645beb71a0876f99f84ea514b","url":"img/peekingMonster.js"},{"revision":"715c1be769f3bd2dddae2c9ef90123d1","url":"img/star.png"},{"revision":"4a368123fc4593ce83a4f774b2642b5f","url":"img/survey/laptop_and_phone.jpg"},{"revision":"ebe067e6890bf49c9924a5e5c43ca1d3","url":"img/survey/none.jpg"},{"revision":"b64fd83d7d2f6c0180504daef5778b4e","url":"index.html"},{"revision":"101953208181818975e033743510cd06","url":"manifest.json"}], {
  ignoreURLParametersMatching: [/^data/, /^cr_user_id/],
  exclude: [/^lang\//],
});

const channel = new BroadcastChannel("as-message-channel");

let version = 1.1;
let cachingProgress = 0;
let cachableAssetsCount = 0;

self.addEventListener("message", async (event) => {
  console.log("Registration message received in the service worker ");
  if (event.data.type === "Registration") {
    if (!!!caches.keys().length) {
      cachingProgress = 0;
      let cacheName = await getCacheName(event.data.value);
    }
  }
});

self.addEventListener("install", async function (e) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("Service worker activated");
  event.waitUntil(self.clients.claim());
  channel.postMessage({ command: "Activated", data: {} });
});

self.registration.addEventListener("updatefound", function (e) {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      if (cacheName == workbox.core.cacheNames.precache) {
        // caches.delete(cacheName);
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) =>
            client.postMessage({ msg: "UpdateFound" })
          );
        });
      }
    });
  });
});

channel.addEventListener("message", async function (event) {
  if (event.data.command === "Cache") {
    console.log("Caching request received in the service worker with data: ");
    console.log(event.data);
    cachingProgress = 0;
    await cacheTheBookJSONAndImages(event.data.data);
  }
});

function updateCachingProgress(bookName) {
  cachingProgress++;
  let progress = Math.round((cachingProgress / cachableAssetsCount) * 100);
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) =>
      client.postMessage({
        msg: "Loading",
        data: {progress, bookName},
      })
    );
  });
}

function cacheTheBookJSONAndImages(data) {
  console.log("Caching the book JSON and images", data);
  let appData = data["appData"];
  let cachableAssets = [];

  cachableAssets.push(appData["contentFilePath"]);
  cachableAssets.push(...appData["audioVisualResources"])

  // let audioVisualResources = appData["audioVisualResources"];
  
  // for (let i = 0; i < audioVisualResources.length; i++) {
  //   cachableAssets.push(audioVisualResources[i]);
  // }

  cachableAssetsCount = cachableAssets.length;

  console.log("Cachable app assets: ", cachableAssets);

  caches.open(appData["appName"]).then((cache) => {
    for (let i = 0; i < cachableAssets.length; i++) {
      cache.add(cachableAssets[i]).finally(() => {
        updateCachingProgress(appData["appName"]);
      }).catch((error) => {
        // console.log("Error while caching an asset: ", cachableAssets[i], error);
        // Identify missing audio files
        cachableAssets[i] = cachableAssets[i] + " ERROR WHILE CACHING!";
      });
    }
    // console.log("After caching: ", cachableAssets);
  });
}

self.addEventListener("fetch", function (event) {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.protocol === 'chrome-extension:') {
    return;
  }
  event.respondWith(
      caches.match(event.request).then(function (response) {
          if (response) {
            return response;
          }
          return fetch(event.request);
      })
  );
});