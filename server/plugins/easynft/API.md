# API Document #
easynft api document

### GET METADATA LIST ###

`GET /easynft`

#### REUQEST HEADERS ####

| Name       | Required                     | Type   | Description                                                         |
|------------|------------------------------|--------|---------------------------------------------------------------------|
| AppId      | <font color="red">yes</font> | string | the AppId of [Matrix Storage](https://storage.anmaicloud.com)      |
| AppVersion | <font color="red">yes</font> | string | the AppVersion of [Matrix Storage](https://storage.anmaicloud.com) |
| Signature  | <font color="red">yes</font> | string | the Signature of [Matrix Storage](https://storage.anmaicloud.com)  |
|            |                              |        |                                                                     |

#### REQUEST QUERY ####

| Name       | Required | Type   | Description             |
|------------|----------|--------|-------------------------|
| page_index | no       | string | the page number of list |
| page_size  | no       | string | the size of list        |

#### RESPONSE ####

```
HTTP/1.1 200 OK
Content-Type: application/json
Connection: keep-alive
Date: Wed, 22 Feb 2012 08:32:21 GMT
{
    "code":0,
    "msg":"ok",
    "data":{
        "items":[{
            "cid":"maxasin69ets85wve0ipva5m5b2maqaz8lme08peag2mxcsuv",
            "metadata":{
                "name":"the nft name",
                "description":"the nft description",
                "image":"ipfs://maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
                "decimals":123123,
                "properties":{
                    "files":[
                        {
                            "cid":"maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
                            "filename":"image file name"
                        }
                    ]
                }
            },
            "status":"pending"
        }],
        "total_page": 1,
        "total_count": 3
    }
}
```

### GET METADATA ###

`GET /easynft/:cid`

#### REUQEST HEADERS ####

| Name       | Required                     | Type   | Description                                                         |
|------------|------------------------------|--------|---------------------------------------------------------------------|
| AppId      | <font color="red">yes</font> | string | the AppId of [Matrix Storage](https://storage.anmaicloud.com)      |
| AppVersion | <font color="red">yes</font> | string | the AppVersion of [Matrix Storage](https://storage.anmaicloud.com) |
| Signature  | <font color="red">yes</font> | string | the Signature of [Matrix Storage](https://storage.anmaicloud.com)  |
|            |                              |        |                                                                     |

#### REQUEST PATH PARAMS ####

| Name | Required                     | Type   | Description     |
|------|------------------------------|--------|-----------------|
| cid  | <font color="red">yes</font> | string | cid of metadata |


#### RESPONSE ####

** NOT FOUND **

cid not found

```
HTTP/1.1 404 OK
Connection: keep-alive
Date: Wed, 22 Feb 2012 08:32:21 GMT

```

** COMPLETE STATUS **

cid found and complete upload

```
HTTP/1.1 200 OK
Content-Type: application/json
Connection: keep-alive
Date: Wed, 22 Feb 2012 08:32:21 GMT

{
    "code":0,
    "msg":"ok",
    "data":{
        "cid":"maxasin69ets85wve0ipva5m5b2maqaz8lme08peag2mxcsuv",
        "metadata":{
            "name":"the nft name",
            "description":"the nft description",
            "image":"ipfs://maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
            "decimals":123123,
            "properties":{
                "files":[
                    {
                        "cid":"maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
                        "filename":"image file name"
                    }
                ]
            }
        },
        "status":"complete"
    }
}

```

** PENDING METADATA STATUS **

cid found but metadata is pending upload

```
HTTP/1.1 200 OK
Content-Type: application/json
Connection: keep-alive
Date: Wed, 22 Feb 2012 08:32:21 GMT

{
    "code":0,
    "msg":"ok",
    "data":{
        "cid":"maxasin69ets85wve0ipva5m5b2maqaz8lme08peag2mxcsuv",
        "status":"pending"
    }
}
```

** PENDING IMAGE UPLOAD STATUS **

cid found but image upload is pending

```
HTTP/1.1 200 OK
Content-Type: application/json
Connection: keep-alive
Date: Wed, 22 Feb 2012 08:32:21 GMT

{
    "code":0,
    "msg":"ok",
    "data":{
        "cid":"maxasin69ets85wve0ipva5m5b2maqaz8lme08peag2mxcsuv",
        "metadata":{
            "name":"the nft name",
            "description":"the nft description",
            "image":"ipfs://maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
            "decimals":123123,
            "properties":{
                "files":[
                    {
                        "cid":"maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
                        "filename":"image file name"
                    }
                ]
            }
        },
        "status":"pending"
    }
}

```

### CREATE METADATA ###

`POST /easynft`

> use multipart/form-data to upload image

#### REUQEST HEADERS ####

| Name       | Required                     | Type   | Description                                                        |
|------------|------------------------------|--------|--------------------------------------------------------------------|
| AppId      | <font color="red">yes</font> | string | the AppId of [Matrix Storage](https://storage.anmaicloud.com)      |
| AppVersion | <font color="red">yes</font> | string | the AppVersion of [Matrix Storage](https://storage.anmaicloud.com) |
| Signature  | <font color="red">yes</font> | string | the Signature of [Matrix Storage](https://storage.anmaicloud.com)  |
|            |                              |        |                                                                    |

#### REQUEST FIELDS & FILES ####

| Name        | Required                     | Type            | Description                        |
|-------------|------------------------------|-----------------|------------------------------------|
| name        | no                           | string          | name of nft                        |
| description | no                           | string          | description of nft                 |
| decimals    | no                           | number (bigint) | decimals of nft                    |
| properties  | no                           | object          | properties of nft                  |
| file        | <font color="red">yes</font> | file            | File Object of multipart/form-data |


#### RESPONSE ####

```
HTTP/1.1 200 OK
Content-Type: application/json
Connection: keep-alive
Date: Wed, 22 Feb 2012 08:32:21 GMT

{
    "code":0,
    "msg":"ok",
    "data":{
        "cid":"maxasin69ets85wve0ipva5m5b2maqaz8lme08peag2mxcsuv",
        "metadata":{
            "name":"the nft name",
            "description":"the nft description",
            "image":"ipfs://maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
            "decimals":123123,
            "properties":{
                "files":[
                    {
                        "cid":"maxasipb+86x486bxmmnj3vkj9sdtqkpcqmxwhuncm2h1jx8j",
                        "filename":"image file name"
                    }
                ]
            }
        }
    }
}

```
