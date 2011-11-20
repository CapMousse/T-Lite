//      Version : 0.7
//     (c) 2011 Jérémy Barbe.
//     May be freely distributed under the MIT license.

window['tlite'] = function(template, vars){
    var ifCache = {},
        ifType = {
            '<=' : 'lw',
            '>=' : 'gt',
            '==' : 'eq',
            '===': 'sq',
            '!=' : 'nt'
        };

    /**
     * Find the value asked in the template in the current context
     * @param elem      the elet to search
     * @param context   the current search context
     */
     function findValue(elem, context){
        var path = elem.split('.'),
            value = context[path.shift()];

        while(value != undefined && path.length){
            value = value[path.shift()];
        }

        return value == undefined ? elem : value.call ? value.call(this, context) : value;
    }

    /**
     * replace template var to their value
     * @param tpl           the template to parse
     * @param context       the context to search on
     */
    function find(tpl, context){
        return tpl.replace(/\{(.+?)\}/g, function(foundVar ,varContent){
            return findValue(varContent, context || vars);
        });
    }

    function parseIf(tpl, context){
        return tpl.replace(/(\{if (.*?)\}(.*)\{else\}(.*)\{\/if\}|{if (.*?)\}(.*)\{\/if\})/, function(string, type, condition, ifResult, elseResult, smallIfCondition, smallIfResult, conditionStart, conditionEnd){
            condition = condition || smallIfCondition;
            ifResult = ifResult || smallIfResult;

            // if we don't have space in the condition, it's a single var/function, just find and call it.
            if(!condition.match(' ')){
                return findValue(condition, context) ? parse(ifResult, context) : (elseResult ? parse(elseResult, context) : '');
            }

            // else, it's a complex condition, need to parse first and last element
            condition = condition.split(' ');
            conditionStart = findValue(condition[0], context);
            conditionEnd = findValue(condition[2], context);
            type = ifType[condition[1]];


            if(!ifCache[type]){
                ifCache[type] = buildCondition("return x "+condition[1]+" y");
            }

            return ifCache[type](conditionStart, conditionEnd) ? parse(ifResult, context) : (elseResult ? parse(elseResult, context) : '');
        });
    }

    /**
     * Create a function to compare to args
     * @param content   content of the function
     */
    function buildCondition(content){
        return new Function("x", "y", content);
    }


    function parseFor(tpl, context){
        return tpl.replace(/\{for (.*?)(\|(.*?))?\}(.+)\{\/for\}/, function(string, forVar, filterString, filter, tpl){
            return makeFor(findValue(forVar, context), filter, tpl);
        });
    }

    /**
     * Do a for loop
     * @param forVar        the var used for the loop
     * @param filterString  the var in the loop filtered at render
     * @param content       content of the loop
     */
    function makeFor(forVar, filterString, content){
        var forReturn = '', i, result;

        filterString = (filterString || '')+'|value|key';

        for(i in forVar){
            if(forVar.hasOwnProperty(i) && filterString.search(i) < 0){
                result = typeof forVar[i] == "object" ?  forVar[i] : {};

                result.value = forVar[i];
                result.key = i;

                forReturn += parse(content, result);
            }
        }

        return forReturn;
    }

    /**
     * Parse the current template to find var/condition/for
     * @param tpl
     * @param context
     */
    function parse(tpl, context){
        context = context || vars;

        tpl.search('{if') < tpl.search('{for') ?
            tpl = parseFor(parseIf(tpl, context), context):
            tpl = parseIf(parseFor(tpl, context), context);

        return find(tpl, context);
    }

    return parse(template, vars);
}