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
         * @param forVar    the var used for the loop
         * @param content   content of the loop
         */
        function parseFor(forVar, content){
            var i, forReturn = '', result;

            for(i in forVar){
                if(!forVar.hasOwnProperty(i)){ continue; }

                result = {};

                if(typeof forVar[i] == "object"){ result = forVar[i] }
                else{ result['value'] = forVar[i]; }

                result['key'] = i;

                forReturn += parse(content, result);
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

            while(value != undefined && path.length > 0){
                value = value[path.shift()];
            }

            if(typeof value === "function"){
                return value.call(this, context);
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
            context = context || params;

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
            context = context || params;

            tpl = tpl.replace(/\{for (.*?)\}(.*)\{\/for\}/, function(string, forVar, tpl){
                    forVar = findValue(forVar, context);
                    return parseFor(forVar, tpl);
                })
                .replace(/\{if (.*?)\}(.*?)(\{else\}(.*?))?\{\/if\}/, function(string, condition, result, elseString, elseResult){
                    var fn, type;

                    if(!condition.match(' ')){
                        return findValue(condition, context) ? parse(result, context) : (elseResult ? parse(elseResult, context) : '');
                    }

                    condition = condition.split(' ');
                    type = ifType[condition[1]];

                    if(ifCache[type]){
                        fn = ifCache[type];
                    }else{
                        fn = buildCondition("return x "+condition[1]+" y");
                        ifCache[type] = fn;
                    }

                    condition[0] = findValue(condition[0], context);
                    condition[2] = findValue(condition[2], context);

                    return fn(condition[0], condition[2]) ? parse(result, context) : (elseResult ? parse(elseResult, context) : '');
                });

            tpl = find(tpl, context);

            return tpl;
        }

        return parse(template, vars);
    }
}(this)