# atlantis-api

### `POST /upload`

`Content-Type`: `multipart/form-data`

Receives 4 fields:
* `ext1.csv`
* `ext2.csv`
* `catch.csv`
* `product.csv`

Returns:

```jsonc
{
  "type": "success",
  "data": {
    "insertedId": "this is mongo db objectId",
    "writtenFiles": ["array", "of", "written", "files"]
  }
}
```

### `GET /requests`

List all requests ever made

Returns:

```jsonc
{
  "type": "success",
  "data": [
    {
      "_id": "id from mongo db",
      "resolved": [],
      "createdAt": "iso date string"
    },
    {
      "_id": "id from mongo db",
      "resolved": ["heatmap", "graph", "plots"], // array of things that are ready
      "errorCount": 9,
      "createdAt": "iso date string"
    }
  ]
}
```

### `GET /requests/ID`

Parameters:

`ID`: id from mongo db

You can also pass querystring as follows:

```
GET /requests/ID?select[]=heatmap&select[]=graph&select[]=plots
```

and you will be given back the requested fields.
Omit this, if you want to have all of them.

Returns:

```jsonc
{
  "type": "success",
  "data": {
    // fields
  }
}
```
