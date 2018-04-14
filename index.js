const chalk         = require('chalk');
const formatDecimal = require('format-decimal');
const jfObject      = require('jf-object').default;
const log4js        = require('log4js');
const translations  = require('jf-translations').i();
/**
 * Configuración por defecto a aplicar.
 * Se puede cambiar haciendo `require('log4js').configure({...})`.
 */
log4js.configure(
    {
        appenders  : {
            console : {
                type   : 'console',
                layout : {
                    type    : 'pattern',
                    pattern : '%[%r%] %m'
                }
            }
        },
        categories : {
            default : {
                appenders : ['console'],
                level     : 'ALL'
            }
        }
    }
);
/**
 * Configuración por defecto a aplicar.
 * Se puede cambiar haciendo jfLogger.config = {...}
 *
 * @type {Object}
 */
let colors            = {
    'debug' : 'cyan',
    'error' : 'red',
    'fatal' : 'magenta',
    'info'  : 'green',
    'log'   : 'grey',
    'trace' : 'blue',
    'warn'  : 'yellow'
};
/**
 * Longitud por defecto del nombre a mostrar.
 *
 * @type {Number}
 */
let defaultNameLength = 15;
/**
 * Clase para manejar registro de trazas.
 * Al extender de `jfObject` se pueden aprovechar todas sus funcionalidades
 * con el añadido de poder manejar un registro de información.
 *
 * Es un envoltorio al módulo `log4js` que permite
 * usarlo orientado a objetos.
 *
 * Permite traducir los mensajes mediante el módulo `jf-translations`.
 *
 * @namespace jf
 * @class     jf.Logger
 * @extends   jf.Object
 * @see       https://www.npmjs.com/package/jf-object
 * @see       https://www.npmjs.com/package/jf-translations
 * @see       https://www.npmjs.com/package/log4js
 */
module.exports = class jfLogger extends jfObject
{
    /**
     * Construye una instancia de `jfLogger`.
     *
     * @param {Object}  config                  Configuración a aplicar a la instancia.
     * @param {Number}  config.loggerNameLength Longitud del nombre a imprimir en las trazas.
     * @param {Boolean} config.useConsole       Si es `true` se usa la consola en vez de `log4js`.
     *
     * @constructor
     */
    constructor(config = {})
    {
        super(config);
        /**
         * Instancia del logger a usar.
         *
         * @property logger
         * @type     {Number}
         * @protected
         */
        this._logger = config.useConsole
            ? console
            : log4js.getLogger('jf');
        /**
         * Longitud máxima a imprimir del nombre.
         *
         * @property loggerNameLength
         * @type     {Number}
         * @protected
         */
        this._loggerNameLength = config.loggerNameLength || defaultNameLength;
    }

    /**
     * Agrega colores a los parámetros a usar en las etiquetas.
     *
     * @param {Array} params Parámetros a colorear.
     */
    addColorsToLogParams(params)
    {
        params.forEach(
            (param, index) =>
            {
                switch (typeof param)
                {
                    case 'boolean':
                    case 'undefined':
                        params[index] = chalk.gray(param);
                        break;
                    case 'number':
                        params[index] = chalk.red(
                            formatDecimal(
                                param,
                                {
                                    precision : param === parseInt(param, 10)
                                        ? 0
                                        : 2
                                }
                            )
                        );
                        break;
                    case 'string':
                        // Si no ha sido coloreado ya
                        if (param.indexOf('\x1B') === -1)
                        {
                            if (param.indexOf('://') !== -1)
                            {
                                // URLs
                                params[index] = chalk.white.bold(param);
                            }
                            else if (param.indexOf('/') !== -1)
                            {
                                // Rutas de archivos o URLs
                                params[index] = chalk.cyan(param);
                            }
                            else
                            {
                                params[index] = chalk.yellow(param);
                            }
                        }
                        break;
                }
            }
        );
    }

    /**
     * Agrega la funcionalidad del logger al objeto con el método especificado.
     *
     * @method attach
     *
     * @param {Object} obj    Objeto que recibirá el logger.
     * @param {String} method Nombre del método a agregar (`log` por defecto).
     */
    attach(obj, method = 'log')
    {
        if (obj)
        {
            obj[method] = (...args) => this.log(...args);
        }
    }

    /**
     * Agrega una línea al registro.
     * Cualquier placeholders que tenga el mensaje se lo resuelve el
     * método `tr` del módulo de traducciones.
     *
     * @method log
     *
     * @param {String}         level  Nivel del mensaje (debug, error, warn, etc.).
     * @param {String|Boolean} name   Nombre del elemento que solicita imprimir la traza.
     *                                Permite detectar quién genera el mensaje.
     *                                También se puede usar para colocar el nivel del mensaje.
     *                                Usar `false` para no agregar este campo.
     * @param {String}         msg    Mensaje a agregar.
     * @param {Array}          params Parámetros para los placeholders del mensaje.
     */
    log(level, name, msg, ...params)
    {
        const _logger = this._logger;
        if (typeof _logger[level] === 'function')
        {
            const _maxlen = this._loggerNameLength;
            if (_maxlen === false)
            {
                name = false;
            }
            else if (!name && name !== false)
            {
                name = this.constructor.name;
            }
            if (name)
            {
                const _length = name.length;
                let _name;
                if (_length > _maxlen)
                {
                    _name = '*' + name.substr(_length - _maxlen + 1);
                }
                else if (_length === _maxlen)
                {
                    _name = name;
                }
                else
                {
                    _name = (name + ' '.repeat(_maxlen)).substr(0, _maxlen);
                }
                msg = chalk[colors[level] || 'grey'](`[${_name}]`) + ' ' + msg;
            }
            this.addColorsToLogParams(params);
            _logger[level](
                translations.tr(msg, ...params)
            );
        }
    }

    /**
     * Asigna la longitud por defecto del nombre a mostrar.
     *
     * @param length
     */
    static setDefaultNameLength(length)
    {
        defaultNameLength = length;
    }

    /**
     * Devuelve la instancia usada para traducir los mensajes.
     *
     * @return {jf.Translations} Traductor de los mensajes.
     */
    static get translations()
    {
        return translations;
    }
};
