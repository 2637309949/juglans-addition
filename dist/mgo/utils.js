"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const repo = module.exports;

repo.findStringSubmatch = function findStringSubmatch(matcher, content) {
  const re = new RegExp(matcher);
  const r = content.match(re);

  if (r) {
    return r.slice(1);
  }

  return null;
};