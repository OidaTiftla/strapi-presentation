---
theme: dracula
transition: fade
title: Strapi introduction – A Headless CMS
author: Christoph Stephan
class: text-center
hideInToc: true
# monacoTypesSource: ata
monacoTypesAdditionalPackages:
  - qs
monacoRunAdditionalDeps:
  - qs
---

# Strapi introduction

Version 5

A Headless CMS

---
hideInToc: true
---

# Agenda

<Toc minDepth="1" maxDepth="1" />

<!--
1. Introduce Strapi - a headless CMS.
2. Admin panel
3. Extending / customizing with code
-->

---

# What is Strapi?

An open-source, Node.js-based headless CMS.

- Auto-generated
  - DB-Migrations
  - RESTful and GraphQL APIs
  - Code
  - Types for frontend (workaround) <!-- ToDo: provide link -->
- Supported Databases:
  - SQLite
  - PostgreSQL
  - MySQL
- Admin panel

---

## Create Strapi Project

<br>
<br>
<br>
<br>
<br>
<br>

```bash
npx create-strapi-app@latest
```

---
layout: image-right
image: /strapi-admin-panel.png
---

# Admin Panel

- Collection types
- Single types
- Components

<br>
<br>

- Localizable content

---
layout: two-cols
---

# Field Types

- Simple fields
- JSON
- Markdown / Blocks
- Media
- Relations
- Components
- Dynamic zones (multiple components)

::right::

<div class="h-95% w-full">
  <img class="h-full w-auto object-contain" src="/strapi-field-types.png" />
</div>

---

## Text Field - advanced options

<img class="h-9/10" src="/strapi-text.png" />

---

## Relation Field

<img class="h-9/10" src="/strapi-relation.png" />

---

# RestAPI

<br>
<br>

- `qs` in the frontend: A querystring parsing and stringifying library with some added security.

<br>
<br>

```js {monaco-run} { lineNumbers: true }
import qs from 'qs';

console.log(qs.stringify({
  foo: {
    bar: 'baz'
  }
}, { encode: false }));
```

---

## Filters - Simple

```js {monaco-run} { lineNumbers: true }
import qs from 'qs';

console.log('/api/restaurants?' + qs.stringify({
  filters: {
    username: {
      $eq: 'John',
    },
  },
}, { encode: false }));
```

---

## Filters - And, Or

```js {monaco-run} { lineNumbers: true }
import qs from 'qs';

console.log('/api/restaurants?' + qs.stringify({
  filters: {
    $or: [
      { date: { $eq: '2020-01-01' } },
      { date: { $eq: '2020-01-02' } },
    ],
    author: { name: { $eq: 'Kai doe' } },
  },
}, { encode: false }));
```

---

## Filters - Deep

```js {monaco-run} { lineNumbers: true }
import qs from 'qs';

console.log('/api/restaurants?' + qs.stringify({
  filters: {
    chef: {
      restaurants: {
        stars: {
          $eq: 5,
        },
      },
    },
  },
}, { encode: false }));
```

---

## Select - Simple

```js {monaco-run} { lineNumbers: true }
import qs from 'qs';

console.log('/api/articles?' + qs.stringify({
  fields: ['name', 'description'],
}, { encode: false }));
```

---

## Populate - Simple

```js {monaco-run} { lineNumbers: true }
import qs from 'qs';

console.log('/api/articles?' + qs.stringify({
  populate: [ 'headerImage', 'author' ],
}, { encode: false }));
```

---

## Populate - All

```js {monaco-run} { lineNumbers: true }
import qs from 'qs';

console.log('/api/articles?' + qs.stringify({
  populate: '*',
}, { encode: false }));
```

---

## Populate & Select

```js {monaco-run} { lineNumbers: true }
import qs from 'qs';

console.log('/api/articles?' + qs.stringify({
  fields: ['title', 'slug'],
  populate: {
    headerImage: {
      fields: ['name', 'url'],
    },
  },
}, { encode: false }));
```

---

## Populate & Filter & Sort

```js {monaco-run} { lineNumbers: true }
import qs from 'qs';

console.log('/api/articles?' + qs.stringify({
  populate: {
    categories: {
      sort: ['name:asc'],
      filters: {
        name: {
          $eq: 'Cars',
        },
      },
    },
  },
}, { encode: false }));
```

---

## Locale

```js {monaco-run} { lineNumbers: true }
import qs from 'qs';

console.log('/api/articles?' + qs.stringify({
  locale: 'fr',
}, { encode: false }));
```

---
layout: image-right
image: /strapi-graphql.png
---

# GraphQL

<br>
<br>
<br>
<br>

```bash
npm install @strapi/plugin-graphql
```

<br>
<br>

```
http://localhost:1337/graphql
```

---

# Extensibility through plugins and **custom code**

- Controller
- Service
- Routing
- Middleware
- Document Service
- Query Engine

---

## Architecture

![diagram-controllers-services.png](/diagram-controllers-services.png)

---

## Controller

`src/api/article/controllers/article.ts`

````md magic-move {lines: true}
```ts {*|7}
/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article');
```

<!-- https://docs.strapi.io/cms/backend-customization/controllers -->

```ts {7-16}
/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async exampleAction(ctx) {
    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },
}));
```

```ts {7-21}
/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // Method 2: Wrapping a core action (leaves core logic in place)
  async find(ctx) {
    // some custom logic here
    ctx.query = { ...ctx.query, local: 'en' }

    // Calling the default core action
    const { data, meta } = await super.find(ctx);

    // some more custom logic
    meta.date = Date.now()

    return { data, meta };
  },
}));
```

```ts {7-24}
/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // Method 3: Replacing a core action with proper sanitization
  async find(ctx) {
    // validateQuery (optional)
    // to throw an error on query params that are invalid or the user does not have access to
    await this.validateQuery(ctx);

    // sanitizeQuery to remove any query params that are invalid or the user does not have access to
    // It is strongly recommended to use sanitizeQuery even if validateQuery is used
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const { results, pagination } = await strapi.service('api::restaurant.restaurant').find(sanitizedQueryParams);

    // sanitizeOutput to ensure the user does not receive any data they do not have access to
    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, { pagination });
  },
}));
```
````

---

## Sanitization when utilizing controller factories

| Function Name    | Parameters                 | Description                                                                          |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| `sanitizeQuery`  | `ctx`                      | Sanitizes the request query                                                          |
| `sanitizeOutput` | `entity`/`entities`, `ctx` | Sanitizes the output data where entity/entities should be an object or array of data |
| `sanitizeInput`  | `data`, `ctx`              | Sanitizes the input data                                                             |
| `validateQuery`  | `ctx`                      | Validates the request query (throws an error on invalid params)                      |
| `validateInput`  | `data`, `ctx`              | (EXPERIMENTAL) Validates the input data (throws an error on invalid data)            |

<!-- https://docs.strapi.io/cms/backend-customization/controllers#sanitization-when-utilizing-controller-factories -->

---

## Service

`src/api/article/services/article.ts`

````md magic-move {lines: true}
```ts {*|7}
/**
 * article service.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::article.article');
```

<!-- https://docs.strapi.io/cms/backend-customization/services -->

```ts {7-18}
/**
 * article service.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::article.article', ({ strapi }) => ({
  // Method 1: Creating an entirely custom service
  async exampleService(...args) {
    let response = { okay: true }

    if (response.okay === false) {
      return { response, error: true }
    }

    return response
  },
}));
```

```ts {7-20}
/**
 * article service.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::article.article', ({ strapi }) => ({
  // Method 2: Wrapping a core service (leaves core logic in place)
  async find(...args) {
    // Calling the default core controller
    const { results, pagination } = await super.find(...args);

    // some custom logic
    results.forEach(result => {
      result.counter = 1;
    });

    return { results, pagination };
  },
}));
```

```ts {7-12}
/**
 * article service.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::article.article', ({ strapi }) => ({
  // Method 3: Replacing a core service
  async findOne(documentId, params = {}) {
     return strapi.documents('api::restaurant.restaurant').findOne(documentId, this.getFetchParams(params));
  },
}));
```
````

---

## Router

`src/api/article/routes/article.ts`

````md magic-move {lines: true}
```ts {*|7}
/**
 * article router.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::article.article');
```

<!-- https://docs.strapi.io/cms/backend-customization/routes -->

```ts {7-16}
/**
 * article router.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::article.article', {
  only: ['find'],
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },
});
```

```ts {7-24}
/**
 * article router.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::article.article', {
  config: {
    find: {
      policies: [
        // point to a registered policy
        'policy-name',

        // point to a registered policy with some custom configuration
        { name: 'policy-name', config: {} },

        // pass a policy implementation directly
        (policyContext, config, { strapi }) => {
          return true;
        },
      ],
    },
  },
});
```

```ts {7-24}
/**
 * article router.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::article.article', {
  config: {
    find: {
      middlewares: [
        // point to a registered middleware
        'middleware-name',

        // point to a registered middleware with some custom configuration
        { name: 'middleware-name', config: {} },

        // pass a middleware implementation directly
        (ctx, next) => {
          return next();
        },
      ],
    },
  },
});
```
````

---

## Policy

`src/policies/is-authenticated.ts` or `src/api/[api-name]/policies/my-policy.ts`

<!-- https://docs.strapi.io/cms/backend-customization/policies -->

````md magic-move {lines: true}
```ts
export default (policyContext, config, { strapi }) => {
  if (policyContext.state.user) {
    // if a session is open
    // go to next policy or reach the controller's action
    return true;
  }

  // if you return nothing, Strapi considers you didn't want to block the request and will let it pass
  return false;
};
```

```ts
export default (policyContext, config, { strapi }) => {
  if (policyContext.state.user.role.code === config.role) {
    // if user's role is the same as the one described in configuration
    // go to next policy or reach the controller's action
    return true;
  }

  // if you return nothing, Strapi considers you didn't want to block the request and will let it pass
  return false;
};
```
````

---
zoom: 0.9
---

## Schema

`src/api/article/content-types/article/schema.json`

````md magic-move {lines: true}
```json
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles",
    "displayName": "Article",
    "description": "Create your blog content"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "text",
      "maxLength": 80
    },
    "slug": {
      "type": "uid",
      "targetField": "title"
    },
    "cover": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images", "files", "videos"]
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::author.author",
      "inversedBy": "articles"
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category",
      "inversedBy": "articles"
    },
    "blocks": {
      "type": "dynamiczone",
      "components": ["shared.media", "shared.quote", "shared.rich-text", "shared.slider"]
    }
  }
}
```
````

---
title: What's Missing?
---

# What's Missing? (in the Open Source version)

- Field-based permissions
- SSO for Admin panel
- Multiple roles per user
- Public users sync properties from providers (OpenID Connect ID-Token, ...)

---
layout: end
hideInToc: true
---

# Thank you for your attention
