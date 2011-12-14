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
Tlite.parse('<tpl id:1 if:name>Hello {name}</tpl id:1>', { name: 'Mousse' });
// boolean var with 'pseudo' else
Tlite.parse('<tpl id:1 if:name>Hello {name} !</tpl id:1><tpl id:2 if:!name>Hello unknown !</tpl id:2>', { name: false });
// function var </tpl id:2>
Tlite.parse('<tpl id:1 if:name>Hello {name} !</tpl id:1><tpl id:2 if:!name>Hello unknown !</tpl id:2>', { name: function(){ return 'James' });
```

##### Complex if

Complex if can use comparison char in this list : `===, ==, !=, <=, >=`.
**spaces are obligatory in your if tempalte ! Condition without space will not work !**

```javascript
// simple var
Tlite.parse('<tpl id:1 if:age <= 60>Hello {name} !</tpl id:1><tpl id:2 if:age >= 60>Hello old men !</tpl id:2>', { name: 'James', age : 21});
Tlite.parse('<tpl id:1 if:age <= medium>Hello {name} !</tpl id:1><tpl id:2 if:age >= medium>Hello old men !</tpl id:2>', { name: 'James', age : 21, medium : 60});
```

```javascript
//function var
Tlite.parse('<tpl id:1 if:age <= 60>Hello {name} !</tpl id:1><tpl id:2 if:age >= 60>Hello old men !</tpl id:2>', { name: 'James', age : function(){ return this.person.age; }});
```

### For
For automatically made a loop thought a given array/object. For give a key and value var to simply use result :

```javascript
Tlite.parse('<tpl id:1 for:loop>{key}:{value}<br></tpl id:1>', {loop:['First', 'Second', 'Third']});
Tlite.parse('<tpl id:1 for:loop>{key}:{value}<br></tpl>', {loop:{name: 'Paul', age: 24, city: 'Paris'}});
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

#### 2.0.0
* Drop mustache syntax to a more redable sintax
* Lightup the code
* Drop else (because parsing LEVEL3 element with LEVEL2 match is not efficient and can make errors)


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