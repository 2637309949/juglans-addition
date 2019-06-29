## juglans-addition

  Provide global convenience tools, such as cross-module references
### mongoose addition

#### new Connect

```javascript
repo.mgoExt = mgo.Ext.Connect(config.mongo.uri, config.mongo.opts)
repo.mgoExt.setApiOpts({
  prefix: '/template/mgo'
})
```
#### use as plugin

```javascript
app.PostUse(repo.mgoExt)
```

#### custom default api

```javascript

const User = mgoExt.Register({
  name: 'User',
  displayName: '参数配置',
  schema: defineSchema,
  autoHook: false
})

module.exports = function ({ router }) {
  // routes: api/v1/mgo/user
  mgoExt.api.List(router, 'User').Pre(async function (ctx) {
    console.log('before')
  }).Post(async function (ctx) {
    console.log('after')
  })
  // routes: api/v1/mgo/feature1/user
  mgoExt.api.Feature('feature1').List(router, 'User')
  // routes: api/v1/mgo/feature1/subFeature1/user
  mgoExt.api.Feature('feature1').Feature('subFeature1').List(router, 'User')
  // routes: api/v1/mgo/custom/user
  mgoExt.api.Feature('feature1').Feature('subFeature1').Name('custom').List(router, 'User')

  mgoExt.api.One(router, 'User')
  mgoExt.api.Delete(router, 'User')
  mgoExt.api.Update(router, 'User')
  mgoExt.api.Create(router, 'User')
}

```
## redis addition

## MIT License

Copyright (c) 2018-2020 Double

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
