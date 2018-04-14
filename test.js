const assert        = require('assert');
const formatDecimal = require('format-decimal');
const jfLogger      = require('./index');
let assertions      = 0;
const levels        = {
    debug : msg => checkMessage(msg, 'debug'),
    error : msg => checkMessage(msg, 'error'),
    fatal : msg => checkMessage(msg, 'fatal'),
    info  : msg => checkMessage(msg, 'info'),
    log   : msg => checkMessage(msg, 'log'),
    trace : msg => checkMessage(msg, 'trace'),
    warn  : msg => checkMessage(msg, 'warn'),
};

function assertEqual(actual, expected)
{
    assert.strictEqual(actual, expected);
    ++assertions;
}

// No hay mucho que verificar ya que del resto se encarga el módulo log4js.
// Solamente verificamos que se llame al método apropiado de log4js y se formatee correctamente el texto.
function checkMessage(msg, name)
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
            const _loggerName = logger.constructor.name;
            const _llength    = _loggerName.length;
            if (_llength > length)
            {
                assertEqual(
                    _name.trim(),
                    '*' + _loggerName.substr(_llength - length + 1)
                );
            }
            else if (_llength === length)
            {
                assertEqual(_name, _loggerName);
            }
            else
            {
                assertEqual(_name, (_loggerName + ' '.repeat(length)).substr(0, length));
            }
        }
        msg = _parts[2];
        assertEqual(...(msg.split('=')));
    }
    else
    {
        assertEqual(msg, name);
    }
}

function testLevels()
{
    const logger   = new jfLogger();
    logger._logger = levels;
    Object.keys(levels).forEach(
        name => logger.log(name, false, name)
    );
}

function testMessage()
{
    const logger                = new jfLogger();
    // Realizamos las pruebas sin tomar en cuenta los colores.
    logger.addColorsToLogParams = p => p;
    const names                 = Object.keys(levels);
    for (const length of [5, 10, 20])
    {
        logger._loggerNameLength = length;
        for (const name of [false, '', ...names])
        {
            names.forEach(
                (level, index) => logger.log(level, name, `Test %d {name}=Test ${index} ${name}`, index, { name })
            );
        }
    }
}

function testNameLength()
{
    // Verificamos que al asignar la longitud por defecto, todas las
    // nuevas instancias usen ese valor.
    for (let length = 0; length < 50; ++length)
    {
        jfLogger.setDefaultNameLength(length);
        assertEqual(new jfLogger()._loggerNameLength, length);
    }
}

function testSingleton()
{
    // Verificamos el singleton
    assertEqual(jfLogger.i(), jfLogger.i());
}

testLevels();
testMessage();
testNameLength();
testSingleton();
console.log('\n\nTotal aserciones: %s', formatDecimal(assertions, { precision : 0 }));
