/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
(function() {
    'use strict';
    // This file will be replaced by the generated service worker when we work with
    // the sw-precache and sw-toolbox libraries.

    // TODO SW-3 - cache the application shell
    var filesToCache = [
        '/',
        'index.html',
        'scripts/main.min.js',
        'styles/main.css',
        'images/products/BarrelChair.jpg',
        'images/products/C10.jpg',
        'images/products/Cl2.jpg',
        'images/products/CP03_blue.jpg',
        'images/products/CPC_RECYCLED.jpg',
        'images/products/CPFS.jpg',
        'images/products/CPO2_red.jpg',
        'images/products/CPT.jpg',
        'images/products/CS1.jpg',
        'images/touch/apple-touch-icon.png',
        'images/touch/chrome-touch-icon-192x192.png',
        'images/touch/icon-128x128.png',
        'images/touch/ms-touch-icon-144x144-precomposed.png',
        'images/about-hero-image.jpg',
        'images/delete.svg',
        'images/footer-background.png',
        'images/hamburger.svg',
        'images/header-bg.jpg',
        'images/logo.png'
    ];

    var staticCacheName = 'e-commerce-v1';

    self.addEventListener('install', function(event) {
      console.log('Attempting to install service worker and cache static assets');
      event.waitUntil(
        caches.open(staticCacheName)
        .then(function(cache) {
          return cache.addAll(filesToCache);
        })
      );
    });

    // TODO SW-4 - use the cache-first strategy to fetch and cache resources in the
    // fetch event listener
    self.addEventListener('fetch', function(event) {
      console.log('Fetch event for ', event.request.url);
      event.respondWith(
        caches.match(event.request).then(function(response) {
          if (response) {
            console.log('Found ', event.request.url, ' in cache');
            return response;
          }
          console.log('Network request for ', event.request.url);
          return fetch(event.request).then(function(response) {
            return caches.open(staticCacheName).then(function(cache) {
                cache.put(event.request.url, response.clone());
                return response;
            });
          });
        }).catch(function(error) {
          console.log('Error, ', error);
        })
      );
    });

    // TODO SW-5 - delete outdated caches in the activate event listener
    self.addEventListener('activate', function(event) {
      console.log('Activating new service worker...');

      var cacheWhitelist = [staticCacheName];

      event.waitUntil(
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.map(function(cacheName) {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
});
