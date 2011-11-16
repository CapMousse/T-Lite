# T-Lite
A lite but powerful javascript template engine

## Usage
Simply load *tlite* on your page

T-Lite work with two arguments:

* your template
* the object containing vars and other elements needed by the template

The var object can contain any kind of elements: vars, object, array, function... Functions are automatically called when needed

    tlite('Your small template with a {something.in.big.object}', { something : {in: {big: {object: 'tlite'}}}});

## Template syntaxe
A template can contain multiple var. It can contain condition (if/else) and for loops.

### Condition
Condition can check if a var exists on the object, check the equality... Functions can be used in *if* statement :

* simple if


    tlite('{if name}Hello {name}{/if}', { name: 'Mousse' });

* simple if/else


    // boolean var
    tlite('{if name}Hello {name} !{else}Hello unknown !{/if}', { name: false });
    // function var
    tlite('{if name}Hello {name} !{else}Hello unknown !{/if}', { name: function(){ return 'James' });

* complex if/else : a condition can use comparison in this list : `===, ==, !=, <=, >=`


    // simple var
    tlite('{if age != 60 }Hello {name} !{else}Hello old men !{/if}', { name: false, age : 21});
    tlite('{if age != medium }Hello {name} !{else}Hello old men !{/if}', { name: false, age : 21, medium : 60});

    //function var
    tlite('{if age != 60 }Hello {name} !{else}Hello old men !{/if}', { name: false, age : function(){ return 21; }});

### For
For automatically made a loop thought a given array/object. For give a key and value var to simply use result :

    tlite('{for loop}{key}:{value}<br>{/for}', {loop:['First', 'Second, 'Third']});
    tlite('{for loop}{key}:{value}<br>{/for}', {loop:{name: 'Paul', age: 24, city: 'Paris'}});

## Function
Function called by tlite will receive a context argument, representing the current parsed element.

- - -

## Versions

#### 0.1
* First release

About
-----
Created by [Jérémy Barbe](htt://www.shwaark.com) (c) 2011
tlite is distributed under the MIT license.