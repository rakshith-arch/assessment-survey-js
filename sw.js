importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.precaching.precacheAndRoute([{"revision":"20111cd30a823cbbf31a08df82098c89","url":"bundle.js"},{"revision":"39e263aae58f0369123d07768e4fbd5e","url":"css/style.css"},{"revision":"f0c4b0b4744ad5b5b3af96f5e2849cf6","url":"dist/bundle.js"},{"revision":"2364a2746dbef47fa2601198fe4ed894","url":"img/bg_crayon-1.png"},{"revision":"0eb874baac10d2a76c7cc657c756acdf","url":"img/bg_v01.jpg"},{"revision":"56484ec92a16940b09c0d9fea2e4b11b","url":"img/chest.png"},{"revision":"0ab4538bcfd8f9ed476513dedfc4758a","url":"img/hill_v01.png"},{"revision":"dc33b481685304c43d152362955b01f9","url":"img/monster.png"},{"revision":"7c15bf2645beb71a0876f99f84ea514b","url":"img/peekingMonster.js"},{"revision":"715c1be769f3bd2dddae2c9ef90123d1","url":"img/star.png"},{"revision":"4a368123fc4593ce83a4f774b2642b5f","url":"img/survey/laptop_and_phone.jpg"},{"revision":"ebe067e6890bf49c9924a5e5c43ca1d3","url":"img/survey/none.jpg"},{"revision":"1c556e7b72ccc1b5e2dcefd0b21aa3a9","url":"index.html"},{"revision":"101953208181818975e033743510cd06","url":"manifest.json"}], {});

const channel = new BroadcastChannel("cr-message-channel");

let version = 0.9;
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
  console.log("Caching the book JSON and images");
  let bookData = data["bookData"];
  let bookAudioAndImageFiles = [];
  
  for (let i = 0; i < bookData["pages"].length; i++) {
    let page = bookData["pages"][i];
    for (let j = 0; j < page["visualElements"].length; j++) {
      let visualElement = page["visualElements"][j];
      if (visualElement["type"] === "audio") {
        bookAudioAndImageFiles.push(`/BookContent/${data["bookData"]["bookName"]}/content/` + visualElement["audioSrc"]);
        for (let k = 0; k < visualElement["audioTimestamps"]["timestamps"].length; k++) {
          bookAudioAndImageFiles.push("/BookContent/LetsFlyLevel2En/content/" + visualElement["audioTimestamps"]["timestamps"][k]["audioSrc"]);
        }
      } else if (visualElement["type"] === "image" && visualElement["imageSource"] !== "empty_glow_image") {
        bookAudioAndImageFiles.push(`/BookContent/${data["bookData"]["bookName"]}/content/` + visualElement["imageSource"]);
      }
    }
  }

  cachableAssetsCount = bookAudioAndImageFiles.length;
  

  bookAudioAndImageFiles.push(data["contentFile"]);

  console.log("Book audio files: ", bookAudioAndImageFiles);

  caches.open(bookData["bookName"]).then((cache) => {
    for (let i = 0; i < bookAudioAndImageFiles.length; i++) {
      cache.add(bookAudioAndImageFiles[i]).finally(() => {
        updateCachingProgress(bookData["bookName"]);
      }).catch((error) => {
        console.log("Error while caching the book JSON", error);
      });
    }
    cache.addAll(bookAudioAndImageFiles).catch((error) => {
      console.log("Error while caching the book JSON", error);
    });
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