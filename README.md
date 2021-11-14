# Zombie Cookie - The Demo

## Disclaimer

_Zombie cookies_ aren't some fancy stuff you add to your site - they're an enemy you learn about. This article is for educational purposes only, it aims to entice more developers to focus on web security.

> As stated on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#other_ways_to_store_information_in_the_browser), These techniques violate the principles of user privacy and user control, may violate data privacy regulations, and could expose a website using them to legal liability.

---

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

Gli **zombie cookies** sfruttano gli ETag. Prendono questo nome dal fatto che anche cancellandoli manualmente al refresh della pagina _tornano in vita_.

Quando atterri sulla route `/zombie`, il server ha associato un `ETag` alla risorsa, alla pagina _HTML_.

Il rituale di necromanzia ha inizio con il login:

```js
app.get('/zombielogin', (req, res) => {
  const user = req.query.user
  res.setHeader('set-cookie', [`${KEY}=${user}`])

  const etag = req.headers['if-none-match']
  zombies.set(etag, user)

  res.status(201).send(`user ${user} has been created.`)
})
```

Oltre a svolgere le normali funzioni di login (line 1, 2, 7), l'`etag` è estrapolato dall'header **If-None-Match**. È stato il client ad averlo estrapolato dall'`ETag` (settato dal server) ed ad inserirlo qui.

Lo usa come chiave in una mappa nella quale tiene traccia dell'utente (line 5, 6).

In questo modo, quando l'utente chiede nuovamente `zombie.html`:

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

Se la richiesta porta con sé un cookie, ne estrapola il contenuto e lo salva nella mappa usando l'`etag` come chiave.

Se invece non trova il cookie, magari perché l'utente l'ha cancellato manualmente, utilizza l'`etag` per accedere al valore nella mappa. Con questo _riporta in vita_ il cookie.

```js
const user = zombies.get(etag)
if (user) res.setHeader('set-cookie', `${KEY}=${user}`)
```

---

## Read More

- [How Un-deletable Zombie Cookies work](https://youtu.be/lq6ZimHh-j4) by [Hussein Nasser](https://twitter.com/hnasr)

---
