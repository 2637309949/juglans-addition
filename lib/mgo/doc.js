// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const _ = require('lodash')

const repo = module.exports

function fieldScope (schema) {
  const keys = _.keys(schema.obj)
  const fields = []
  keys.forEach(key => {
    let valueType = ''
    let value = schema.obj[key]
    if (Array.isArray(value)) {
      value = value[0]
      valueType = '[]'
    }
    fields.push({
      'group': 'Parameter',
      'type': valueType + value.type.name,
      'optional': !!value.required,
      'field': key,
      'description': value.displayName
    })
  })
  return fields
}

function titleCase (str) {
  str = str.toLowerCase().split(' ')
  let final = [ ]
  for (let word of str) {
    final.push(word.charAt(0).toUpperCase() + word.slice(1))
  }
  return final.join(' ')
}

repo.GenDoc = function ({ profile, opts, apis = [] }) {
  let docs = []
  const fields = fieldScope(profile.schema)
  apis.forEach(api => {
    if (api === 'one') {
      docs.push({
        'type': 'get',
        'url': opts.routePrefixs.one(profile.name, opts),
        'title': `${profile.name} one`,
        'name': `${profile.name} one`,
        'group': 'Nosql',
        'groupTitle': 'Nosql Default',
        'parameter': {
          'fields': {
            'Parameter': fields
          },
          'examples': [
            {
              'title': 'Request-Example:',
              'content': '{\n  "cond": { "age": { $gte: 1 } },\n  "range": "page",\n  "page": 1,\n  "size": 10,\n  "project": "_id,name",\n  "preload": "Creator",\n  "order": "-_created",\n}',
              'type': 'json'
            }
          ]
        },
        'version': '0.0.0'
      })
    } else if (api === 'list') {
      docs.push({
        'type': 'get',
        'url': opts.routePrefixs.list(profile.name, opts),
        'title': `${profile.name} list`,
        'name': `${profile.name} list`,
        'group': 'Nosql',
        'groupTitle': 'Nosql Default',
        'parameter': {
          'fields': {
            'Parameter': fields
          },
          'examples': [
            {
              'title': 'Request-Example:',
              'content': '{\n  "cond": { "age": { $gte: 1 } },\n  "range": "page",\n  "page": 1,\n  "size": 10,\n  "project": "_id,name",\n  "preload": "Creator",\n  "order": "-_created",\n}',
              'type': 'json'
            }
          ]
        },
        'version': '0.0.0'
      })
    } else if (api === 'create') {
      docs.push({
        'type': 'post',
        'url': opts.routePrefixs.create(profile.name, opts),
        'title': `${profile.name} create`,
        'name': `${profile.name} create`,
        'group': 'Nosql',
        'groupTitle': 'Nosql Default',
        'parameter': {
          'fields': {
            'Parameter': fields
          },
          'examples': [
            {
              'title': 'Request-Example:',
              'content': '{\n  "docs": [{ "xx": "" }],\n  "category": "instruction for use",\n}',
              'type': 'json'
            }
          ]
        },
        'version': '0.0.0'
      })
    } else if (api === 'update') {
      docs.push({
        'type': 'put',
        'url': opts.routePrefixs.update(profile.name, opts),
        'title': `${profile.name} update`,
        'name': `${profile.name} update`,
        'group': 'Nosql',
        'groupTitle': 'Nosql Default',
        'parameter': {
          'fields': {
            'Parameter': fields
          }
        },
        'version': '0.0.0'
      })
    } else if (api === 'delete') {
      docs.push({
        'type': 'delete',
        'url': opts.routePrefixs.delete(profile.name, opts),
        'title': `${profile.name} delete`,
        'name': `${profile.name} delete`,
        'group': 'Nosql',
        'groupTitle': 'Nosql Default',
        'parameter': {
          'fields': {
            'Parameter': fields
          },
          'examples': [
            {
              'title': 'Request-Example:',
              'content': '{\n  "docs": [{ "xx": "" }],\n  "category": "instruction for use",\n}',
              'type': 'json'
            }
          ]
        },
        'version': '0.0.0'
      })
    }
  })
  docs = docs.map(doc => {
    doc.name = titleCase(doc.type) + doc.url.replace(/:/g, '').split('/').map(x => titleCase(x)).join('')
    return doc
  })
  return docs
}
