//      Version : 1.0.1
//     (c) 2011 Jérémy Barbe.
//     May be freely distributed under the MIT license.

window['Tlite'] = new function() {
    var _this = this,
        topContext,
        curContext,
        ifCache = {};

    /**
     * Find the value asked in the template in the current context
     * @param {String} elem      the element to search
     */
    function findValue(elem){

        var delimiter = '.',
            path = elem.split(delimiter),
            value = curContext[path.shift()],
            call;

        //don't loop if value is undefined or is a function
        while (value != undefined && !(call = value.call) && path.length) {
            value = value[path.shift()];
        }
        
        //if the current value is function, call it and pass the current context and the left path
        
        if(call){
            path = [curContext, findValue(path.join(delimiter))];
            return value.apply(this, path)
        }

        return value;
    }

    /**
     * Parse condition
     * @param {String} condition
     * @param {String} result
     */
    function parseIf(condition, result) {
        var type;

        condition = condition.split(' ');
        type = ""+condition[1];

        if (condition[1] && !ifCache[type]) {
            ifCache[type] = new Function("x", "y", "return x " + condition[1] + " y");
        }

        if(condition[1]){
            type = ifCache[type](findValue(condition[0]), findValue(condition[2]))
        }else{
            type = condition[0][0] != "!";
            condition[0] = type ? condition[0] : condition[0].substr(1);
            type = !!findValue(condition[0]) == type; //convert findValue to boolean
        }

        return type ? parse(result) : '';
    }
    
    /**
     * Do a for loop
     * @param {Array|Object} forVar        the var used for the loop
     * @param {String} content       content of the loop
     */
    function parseFor(forVar, content) {
        var filterString, forReturn = '', i, result;

        filterString = forVar.match(/(\w+)(?:(.*))/);
        forVar = findValue(filterString[1]);

        filterString = (filterString[2] || '') + '|value|key|top';

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

        tpl = tpl.replace(/<tpl id:(.*) (.*?):(.*?)>(.*?)<\/tpl id:\1>/g, function(string, id, type, value, content){
            return type == 'if' ? parseIf(value, content): parseFor(value, content);
        });

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
            return findValue(varContent) || foundVar;
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