# easynft-server

[NFT](https://en.wikipedia.org/wiki/Non-fungible_token) server for generate metadata by upload file, and  store them (file and metadata)  in [ipfs](https://ipfs.io/)

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### EasyNFT Plugin ###

see [egg-easynft](plugins/easynft/README.md)  for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/easynft
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org
