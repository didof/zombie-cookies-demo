# Zombie Cookie - The Demo

## Disclaimer

_Zombie cookies_ aren't some fancy stuff you add to your site - they're an enemy you learn about. This article is for educational purposes only, it aims to entice more developers to focus on web security.

> As stated on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#other_ways_to_store_information_in_the_browser), These techniques violate the principles of user privacy and user control, may violate data privacy regulations, and could expose a website using them to legal liability.

---

## Demo

I put on a small demo with the aim of letting you feel the immortality of these zombie cookies.
You can play it here: [demo](https://zombie-cookie-demo.herokuapp.com/)

## Learn

### What is E-Tag

E-Tag, which stands for **Entity Tag**, it's a response header whos value is an unique identifier associated with a resource.

In express, the server is configured in associating E-Tags to response via this line:

```js
app.enable('etag')
```

Go to the `/` route, follow Developer Tools -> Network and inspect the `html` resource. Among the headers you will find `ETag: W / xxx-xxxxxxxxxxx`.

When you press _f5_ your browser asks the server to provide it with this resource again. But this time it adds to the **request** the `If-None_match` header whose value is the same one which arrived with the `ETag`.

The server uses this `uid` to determine if the resource already present on the client is still **fresh**. If the resource on the server has changed, then the one in the browser cache is to be considered **stale**, and it is therefore necessary to provide it with the updated one. Also, a new `ETag` is associated with the response.

But, in case it hasn't changed, the server responds with the status **304, Not Modified**.

> The above is subject to the header configuration `Cache-Control`.

### Use E-Tag to do Necromancy

**Zombie cookies** take advantage of **ETags**. They get their name from the fact that even if you delete them manually when the page is refreshed, they _come back to life_.

When you land on the `/zombie` route, the server has an `ETag` associated with the resource, on the _HTML_ page.

The necromancy ritual begins with the login:

```js
app.get('/zombielogin', (req, res) => {
  const user = req.query.user
  res.setHeader('set-cookie', [`${KEY}=${user}`])

  const etag = req.headers['if-none-match']
  zombies.set(etag, user)

  res.status(201).send(`user ${user} has been created.`)
})
```

In addition to performing the normal login functions (line 1, 2, 7), the `etag` is extrapolated from the **If-None-Match** header. It was the client who extracted it from the `ETag` (set by the server) and put it here.

It uses it as a key in a map in which he keeps track of the user (line 5, 6).

Like this, when the user asks `zombie.html` again:

```js
const zombies = new Map()

app.get('/zombie', (req, res) => {
  const etag = req.headers['if-none-match']

  if (req.headers.cookie) {
    // take for granted only `user` cookie exists
    const user = req.headers.cookie.split('=')[1]
    zombies.set(etag, user)
  } else {
    const user = zombies.get(etag)
    if (user) res.setHeader('set-cookie', `${KEY}=${user}`)
  }

  res.sendFile(path.join(__dirname, 'assets', 'zombie.html'))
})
```

If the request carries a cookie with it, it extracts its content and saves it in the map using the `etag` as a key.

If it does not find the cookie, perhaps because the user has manually deleted it, use the `etag` to access the value in the map. With this he _bears_ the cookie back.

```js
const user = zombies.get(etag)
if (user) res.setHeader('set-cookie', `${KEY}=${user}`)
```

---

## Read More

- [How Un-deletable Zombie Cookies work](https://youtu.be/lq6ZimHh-j4) by [Hussein Nasser](https://twitter.com/hnasr)

---
