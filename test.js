const assert        = require('assert');
const formatDecimal = require('format-decimal');
const jfLogger      = require('./index');
let assertions      = 0;
function assertEqual(actual, expected)
{
    assert.strictEqual(actual, expected);
    ++assertions;
}
// No hay mucho que verificar ya que del resto se encarga el módulo log4js.
// Solamente verificamos que se llame al método apropiado de log4js y se formatee correctamente el texto.
function testLevel(msg)
{
    // Eliminamos los colores.
    msg          = msg.replace(/\x1B\[\d{2}m/g, '');
    const _parts = msg.match(/\[([^\]]+)\]\s(.+)/);
    if (_parts)
    {
        const _name = _parts[1];
        assertEqual(_name.length, length);
        if (name)
        {
            assertEqual(_name.indexOf(name), 0);
        }
        else
        {
            assertEqual(_name.trim(), logger.constructor.name.substr(0, length));
        }
        msg = _parts[2];
    }
    else
    {
        assertEqual(name, false);
    }
    assertEqual(...(msg.split('=')));
}
const levels = {
    debug : (msg) => testLevel(msg),
    error : (msg) => testLevel(msg),
    fatal : (msg) => testLevel(msg),
    info  : (msg) => testLevel(msg),
    log   : (msg) => testLevel(msg),
    trace : (msg) => testLevel(msg),
    warn  : (msg) => testLevel(msg),
};
const logger = new jfLogger();
Object.assign(
    logger,
    {
        // Realizamos las pruebas sin tomar en cuenta los colores.
        addColorsToLogParams : () =>
        {
        },
        logger               : levels
    }
);
const names = Object.keys(levels);
for (var length of [5, 10, 20])
{
    logger.length = length;
    for (var name of [false, '', ...names])
    {
        names.forEach(
            (level, index) => logger.log(level, name, `Test %d {name}=Test ${index} ${name}`, index, {name})
        );
    }
}
// Verificamos el singleton
assertEqual(jfLogger.i(), jfLogger.i());
console.log('Total aserciones: %s', formatDecimal(assertions, { precision : 0 }));

jfLogger.i().log('info', '', 'Test %s number', 1.005);
