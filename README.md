# Zombie Cookie - The Demo

## Disclaimer

*Zombie cookies* aren't some fancy stuff you add to your site - they're an enemy you learn about. This article is for educational purposes only, it aims to entice more developers to focus on web security.

> As stated on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#other_ways_to_store_information_in_the_browser), These techniques violate the principles of user privacy and user control, may violate data privacy regulations, and could expose a website using them to legal liability.

***

## Learn

### What is E-Tag

E-Tag, which stands for **Entity Tag**, it's a response header whos value is an unique identifier associated with a resource.

In express, the server is configured in associating E-Tags to response via this line:

```js
app.enable('etag');
```

Go to the `/` route, follow Developer Tools -> Network and inspect the `html` resource. Among the headers you will find `ETag: W / xxx-xxxxxxxxxxx`.

When you press *f5* your browser asks the server to provide it with this resource again. But this time it adds to the **request** the `If-None_match` header whose value is the same one which arrived with the `ETag`.

The server uses this `uid` to determine if the resource already present on the client is still **fresh**. If the resource on the server has changed, then the one in the browser cache is to be considered **stale**, and it is therefore necessary to provide it with the updated one. Also, a new `ETag` is associated with the response.

But, in case it hasn't changed, the server responds with the status **304, Not Modified**.

> Quanto scritto sopra è soggetto alla configurazione dell'header `Cache-Control`.

### Use E-Tag to do Necromancy



### Kill'em all

***
## Read More

* [How Un-deletable Zombie Cookies work](https://youtu.be/lq6ZimHh-j4) by [Hussein Nasser](https://twitter.com/hnasr)

***