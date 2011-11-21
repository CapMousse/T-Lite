//      Version : 0.8
//     (c) 2011 Jérémy Barbe.
//     May be freely distributed under the MIT license.

window['tlite'] = function(template, vars){
    var context = vars,
        elseString = "{else}",
        ifCache = {},
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
     */
     function findValue(elem){
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
     */
    function find(tpl){
        return tpl.replace(/\{(.+?)\}/g, function(foundVar ,varContent){
            return findValue(varContent);
        });
    }

    function parseIf(tpl){
        return tpl.replace(/\{if (.*?)\}(.*)\{\/if\}/, function(string, condition, result, elseResult, type){

            elseResult = result.split(elseString);

            elseResult[1] ?
               (elseResult = elseResult.pop(), result = result.split(elseString+elseResult)[0]) :
               elseResult = 0;

            // else, it's a complex condition, need to parse first and last element
            condition = condition.split(' ');
            type = ifType[condition[1]];


            if(type && !ifCache[type]){
                ifCache[type] = buildCondition("return x "+condition[1]+" y");
            }

            type = type ? ifCache[type](findValue(condition[0]), findValue(condition[2])):
                          findValue(condition[0]);

            return type ? parse(result) : (elseResult ? parse(elseResult) : '')
        });
    }

    /**
     * Create a function to compare to args
     * @param content   content of the function
     */
    function buildCondition(content){
        return new Function("x", "y", content);
    }


    function parseFor(tpl){
        return tpl.replace(/\{for (.*?)(\|(.*?))?\}(.+)\{\/for\}/, function(string, forVar, filterString, filter, tpl){
            return makeFor(findValue(forVar), filter, tpl);
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

                context = result;
                forReturn += parse(content);
            }
        }
        
        return forReturn;
    }

    /**
     * Parse the current template to find var/condition/for
     * @param tpl
     */
    function parse(tpl){
        //preserve current context
        var curContext = context;
        
        tpl.search('{if') < tpl.search('{for') ?
            tpl = parseFor(parseIf(tpl)):
            tpl = parseIf(parseFor(tpl));

        //reset current context
        context = curContext;
        return find(tpl);
    }

    return parse(template);
}