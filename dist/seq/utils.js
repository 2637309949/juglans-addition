"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const repo = module.exports;

repo.associations = function (model) {
  const associations = Object.values(model.associations);
  return associations.map(arr => Object.values(arr)).map(arr => {
    const [, model, {
      as,
      foreignKey
    }] = arr;
    return {
      model,
      as,
      foreignKey
    };
  });
};