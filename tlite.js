//      Version : 0.5
//     (c) 2011 Jérémy Barbe.
//     May be freely distributed under the MIT license.

!function(env){
    env.tlite = function(template, vars){
        var ifCache = {},
            ifType = {
                '<=' : 'lw',
                '>=' : 'gt',
                '==' : 'eq',
                '===': 'sq',
                '!=' : 'nt'
            };

        /**
         * Create a function to compare to args
         * @param content   content of the function
         */
        function buildCondition(content){
            return new Function("x", "y", content);
        }

        /**
         * Parse a for loop
         * @param forVar        the var used for the loop
         * @param filterString  the var in the loop filtered at render
         * @param content       content of the loop
         */
        function parseFor(forVar, filterString, content){
            var i, forReturn = '', result;

            filterString = (filterString || '')+'|value|key';

            for(i in forVar){
                if(forVar.hasOwnProperty(i) && filterString.search(i) == -1){
                    typeof forVar[i] == "object" ? result = forVar[i] : result = {};

                    result['value'] = forVar[i];
                    result['key'] = i;

                    forReturn += parse(content, result);
                }
            }

            return forReturn;
        }

        /**
         * Find the value asked in the template in the current context
         * @param elem      the elet to search
         * @param context   the current search context
         */
         function findValue(elem, context){
            var path = elem.split('.'),
                value;

            value = context[path.shift()];

            while(value != undefined && path.length){
                value = value[path.shift()];
            }

            if(value && value.call){
                value = value.call(this, context);
            }

            return value == undefined ? elem : value;
        }

        /**
         * replace template var to their value
         * @param tpl           the template to parse
         * @param context       the context to search on
         */
        function find(tpl, context){
            //get the current context or the global context
            context = context || vars;

            tpl = tpl.replace(/\{(.+?)\}/g, function(foundVar ,varContent){
                return findValue(varContent, context);
            });

            return tpl;
        }

        /**
         * Parse the current template to find var/condition/for
         * @param tpl
         * @param context
         */
        function parse(tpl, context){
            context = context || vars;

            return find(
                tpl
                .replace(/\{if (.*?)\}(.*?)(\{else\}(.*?))?\{\/if\}/, function(string, condition, result, elseString, elseResult){
                    var type;

                    // if we don't have space in the condition, it's a single var/function, just find and call it.
                    if(!condition.match(' ')){
                        return findValue(condition, context) ? parse(result, context) : (elseResult ? parse(elseResult, context) : '');
                    }

                    // else, it's a complex condition, need to parse first and last element
                    condition = condition.split(' ');
                    type = ifType[condition[1]];


                    if(!ifCache[type]){
                        ifCache[type] = buildCondition("return x "+condition[1]+" y");
                    }

                    condition[0] = findValue(condition[0], context);
                    condition[2] = findValue(condition[2], context);

                    return ifCache[type](condition[0], condition[2]) ? parse(result, context) : (elseResult ? parse(elseResult, context) : '');
                })
                // Parse for
                .replace(/\{for (.*?)(\|(.*?))?\}(.*)\{\/for\}/, function(string, forVar, filterString, filter, tpl){
                    forVar = findValue(forVar, context);
                    return parseFor(forVar, filter, tpl);
                }),
                context
            );
        }

        return parse(template, vars);
    }
}(this)