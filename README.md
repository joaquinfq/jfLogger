# jfLogger [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Class for manipulating logs and traces.

Can be used as base class for reporting class or node scripts.

Extend [jfObject](https://www.npmjs.com/package/jf-object) inheriting all its features and functionalities.

Use [jfTranslations](https://www.npmjs.com/package/jf-translations) so messages can be translated in other languages.

## Usage

[![npm install jfLogger](https://nodei.co/npm/jf-logger.png?compact=true)](https://npmjs.org/package/jf-logger/)

### Example

```js
const jfLogger = require('jf-logger');
jfLogger.translations.addLanguage('en');
// Using new
const logger = new jfLogger();
// As singleton
const logger = jfLogger.i();
logger.log( // 12:34:56 [jfLogger  ] You must set field `name`
    'warn', 
    '', // If empty, class name is used.
    'Debes asignar el campo `%s`',
    'name'
);
logger.log( // 12:34:56 Min length for `Description` is 10 chars.
    'warn', 
    false, // If false, name is hidden.
    'La longitud mínima para `{name}` es {minLength}',
    {
        name      : 'Description',
        minLength : 10
    }
);
```
