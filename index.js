const chalk        = require('chalk');
const jfObject     = require('jf-object');
const log4js       = require('log4js');
const translations = require('jf-translations').i();
/**
 * Configuración por defecto a aplicar.
 * Se puede cambiar haciendo jfLogger.config = {...}
 *
 * @type {Object}
 */
let colors         = {
    'debug' : 'cyan',
    'error' : 'red',
    'fatal' : 'magenta',
    'info'  : 'green',
    'log'   : 'grey',
    'trace' : 'blue',
    'warn'  : 'yellow'
};
/**
 * Configuración por defecto a aplicar.
 * Se puede cambiar haciendo jfLogger.config = {...}
 *
 * @type {Object}
 */
let logConfig         = {
    appenders : [
        {
            type   : 'console',
            layout : {
                type    : 'pattern',
                pattern : '%[%r%] %m'
            }
        }
    ],
    levels    : {
        jf : 'ALL'
    }
};
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
module.exports = class jfLogger extends jfObject {
    /**
     * Construye una instancia de `jfLogger`.
     *
     * @param {Object} config Configuración a aplicar a la instancia.
     *
     * @constructor
     */
    constructor(config = {})
    {
        super(config);
        log4js.configure(logConfig);
        /**
         * Longitud máxima a imprimir del nombre.
         *
         * @property length
         * @type     {Number}
         */
        this.length = config.length || 15;
        /**
         * Referencia al módulo log4js.
         *
         * @property log4js
         * @type     {log4js}
         */
        this.log4js = log4js;
        /**
         * Longitud máxima a imprimir del nombre.
         *
         * @property length
         * @type     {Number}
         */
        this.logger = log4js.getLogger('jf');
    }

    /**
     * Agrega una línea al registro.
     * Cualquier placeholders que tenga el mensaje se lo resuelve el
     * método `tr` del módulo de traducciones.
     *
     * @method log
     *
     * @param {String}         level Nivel del mensaje (debug, error, warn, etc.).
     * @param {String|Boolean} name  Nombre del elemento que solicita imprimir la traza.
     *                               Permite detectar quién genera el mensaje.
     *                               También se puede usar para colocar el nivel del mensaje.
     *                               Usar `false` para no agregar este campo.
     * @param {String}         msg   Mensaje a agregar.
     */
    log(level, name, msg/*, arg1, arg2, ...*/)
    {
        if (!name && name !== false)
        {
            name = this.constructor.name;
        }
        if (name)
        {
            const _length = this.length;
            const _name   = (name + ' '.repeat(_length)).substr(0, _length);
            msg           = chalk[colors[level] || 'grey'](`[${_name}]`) + ' ' + msg;
        }
        this.logger[level](
            translations.tr(
                msg,
                ...Array.from(arguments).slice(3)
            )
        );
    }

    /**
     * Asigna la configuración de `log4js`.
     * Debe asignarse antes de crear la instancia `jfLogger`.
     *
     * @param {Object} config Configuración a asignar.
     */
    static set config(config)
    {
        Object.assign(logConfig, config);
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
