//      Version : 0.9
//     (c) 2011 Jérémy Barbe.
//     May be freely distributed under the MIT license.

window['Tlite'] = new function() {
    var _this = this,
        topContext,
        curContext,
        elseString = "{else}",
        ifCache = {};

    /**
     * Find the value asked in the template in the current context
     * @param {String} elem      the elemnt to search
     */
    function findValue(elem){
        var path = elem.split('.'),
            value = curContext[path.shift()];

        while (value != undefined && path.length) {
            value = value[path.shift()];
        }

        return undefined == value ? elem : value.call ? value.call(this, curContext) : value;
    }

    /**
     * Parse current string  to find If/Else
     * @param {String} tpl
     */
    function parseIf(tpl) {
        return tpl.replace(/\{if (.*?)\}(.*)\{\/if\}/, function(string, condition, result, elseResult, type) {

            elseResult = result.split(elseString);

            elseResult[1] ?
                (elseResult = elseResult.pop(),result = result.split(elseString + elseResult)[0]) :
                elseResult = 0;

            // else, it's a complex condition, need to parse first and last element
            condition = condition.split(' ');
            type = ""+condition[1];

            if (condition[1] && !ifCache[type]) {
                ifCache[type] = buildCondition("return x " + condition[1] + " y");
            }

            type = condition[1] ? ifCache[type](findValue(condition[0]), findValue(condition[2])) : findValue(condition[0]);

            return type ? parse(result) : (elseResult ? parse(elseResult) : '')
        });
    }

    /**
     * Create a function to compare to args
     * @param {String|null} content content of the function
     */
    function buildCondition(content) {
        return new Function("x", "y", content);
    }


    function parseFor(tpl) {
        return tpl.replace(/\{for (.*?)(\|(.*?))?\}(.+)\{\/for\}/, function(string, forVar, filterString, filter, tpl) {
            return makeFor(findValue(forVar), filter, tpl);
        });
    }

    /**
     * Do a for loop
     * @param {Array|Object} forVar        the var used for the loop
     * @param {String|null} filterString  the var in the loop filtered at render
     * @param {String} content       content of the loop
     */
    function makeFor(forVar, filterString, content) {
        var forReturn = '', i, result;

        filterString = (filterString || '') + '|value|key';

        for (i in forVar) {
            if (forVar.hasOwnProperty(i) && filterString.search(i) < 0) {
                result = typeof forVar[i] == "object" ? forVar[i] : {};

                result.value = forVar[i];
                result.key = i;
                result.top = topContext;

                curContext = result;
                forReturn += parse(content);
            }
        }

        return forReturn;
    }

    /**
     * Parse the current template to find var/condition/for
     * @param {String} tpl
     */
    function parse(tpl){
        var context = curContext;

        tpl.search('{if') < tpl.search('{for') ?
            tpl = parseFor(parseIf(tpl)) :
            tpl = parseIf(parseFor(tpl));

        //reset current context
        curContext = context;
        return _this.find(tpl);
    }

    /**
     * replace template var to their value
    * @param {String} tpl
    * @param {Object} context
     */
    _this.find = function(tpl, context) {
        context&&(curContext = context)
        
        return tpl.replace(/\{(.+?)\}/g, function(foundVar, varContent) {
            return findValue(varContent);
        });
    }

    /**
     * Exposed parse, run template parsing
     * @param {String} tpl
     * @param {Object} context
     */
    _this.parse = function(tpl, context) {
        curContext = topContext = context;
        
        return parse(tpl);
    }
};