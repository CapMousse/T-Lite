# T-Lite
A lite but powerful javascript template engine

## How To

### Basics
Simply load **tlite** on your page

T-Lite work with two methods:

* Find : replace vars in string (more fast for small template without loops/conditions)
* Parse : find/replace var and do loops/conditions

Each method take two arguments :

* A template string
* A var object

In a template, a var is represented in that syntax : `{varName}`. If your var is an object, you can use the normal javascript notation to go down your object : `{varName.otherElement.deepInTheObject}`. The var object can contain any kind of elements: vars, object, array, function... Functions are automatically called when needed.

```javascript
Tlite.find('Your small template with a {something.in.big.object}', { something : {in: {big: {object: 'tlite'}}}});
```

### Condition
Condition can check if a var exists on the object, check the equality... Like vars, anything can be used in a condition statement :

#####Simple if

```javascript
Tlite.parse('{if name}Hello {name}{/if name}', { name: 'Mousse' });
```

#####Simple if/else

```javascript
// boolean var
Tlite.parse('{if name}Hello {name} !{else}Hello unknown !{/if name}', { name: false });
// function var
Tlite.parse('{if name}Hello {name} !{else}Hello unknown !{/if name}', { name: function(){ return 'James' });
```

##### Complex if/else

Complex if/else can use comparison char in this list : `===, ==, !=, <=, >=`.
**spaces are obligatory in your if tempalte ! Condition without space will not work !**

```javascript
// simple var
Tlite.parse('{if age != 60 }Hello {name} !{else}Hello old men !{/if age != 60}', { name: 'James', age : 21});
Tlite.parse('{if age != medium }Hello {name} !{else}Hello old men !{/if age != medium}', { name: 'James', age : 21, medium : 60});
```

```javascript
//function var
Tlite.parse('{if age != 60 }Hello {name} !{else}Hello old men !{/if age != 60}', { name: 'James', age : function(){ return this.person.age; }});
```

### For
For automatically made a loop thought a given array/object. For give a key and value var to simply use result :

```javascript
Tlite.parse('{for loop}{key}:{value}<br>{/for}', {loop:['First', 'Second', 'Third']});
Tlite.parse('{for loop}{key}:{value}<br>{/for}', {loop:{name: 'Paul', age: 24, city: 'Paris'}});
```

You can access to the top context with the `top` var :

```javascript
Tlite.parse('{for loop}{key}:{value}, {top.example}<br>{/for}', {loop:['First', 'Second', 'Third'], example: 'Try it!'});
```

###### Filters
Filters can remove one or multiple var from the current object. Each element you want to filter will be separated by a pipe:

```javascript
Tlite.parse('{for loop|not|that}{key}:{value}<br>{/for}', {loop:{name: 'Paul', age: 24, not: 'Paris', that: 'Test'}});
```

### Function

Vars containin a function will receive a context argument, representing the current level of parsed element. In a for, you can access to the *key* and *value* vars.

You can pass *arguments* to your function. It can be a string (for i18n services) or a other compiled var.

```javascript
Tlite.parse('{aFunction.aVar}', {aFunction: function(context, argument){ console.log(argument); return "Hey!" }, aVar: "A CAPITALIZED VAR" }));
``

## Versions

#### 1.0.1
* Change parsing method for if to prevent infinite loops. See doc
* Can pass arguments to function

#### 0.9.1
* Fix condition/loop attached to other condition/loop not working


#### 0.9
* Expose API
* Add top var to loops to access initial context
* Improve compression

#### 0.8
* Improve if/else performances
* Improve compression

#### 0.7
* Fix imbriqued if, better parsing

#### 0.6
* New interactive method, better parsing

#### 0.5
* Fix loops containing a condition containing a loop not working

#### 0.4
* Fix broken function call on minified version
* Clean the code

#### 0.3
* Add filter to loops
* Update compression method
* Update unit test

#### 0.2
* Fix nested loops not working properly when accessing to the value var
* Adding documentation

#### 0.1
* First release

About
-----
Created by [Jérémy Barbe](htt://www.shwaark.com) (c) 2011
tlite is distributed under the MIT license.