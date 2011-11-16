# T-Lite
A lite but powerful javascript template engine

## How To

### Basics
Simply load **tlite** on your page

T-Lite work with two arguments:

* your template
* the object containing vars and other elements needed by the template

In a template, a var is represented in that syntax : `{varName}`. If your var is an object, you can use the normal javascript notation to go down your object : `{varName.otherElement.deepInTheObject}`. The var object can contain any kind of elements: vars, object, array, function... Functions are automatically called when needed.

```javascript
tlite('Your small template with a {something.in.big.object}', { something : {in: {big: {object: 'tlite'}}}});
```

### Condition
Condition can check if a var exists on the object, check the equality... Like vars, anything can be used in a condition statement :

#####Simple if

```javascript
tlite('{if name}Hello {name}{/if}', { name: 'Mousse' });
```

#####Simple if/else

```javascript
// boolean var
tlite('{if name}Hello {name} !{else}Hello unknown !{/if}', { name: false });
// function var
tlite('{if name}Hello {name} !{else}Hello unknown !{/if}', { name: function(){ return 'James' });
```

##### Complex if/else

Complex if/else can use comparison char in this list : `===, ==, !=, <=, >=`.
**spaces are obligatory in your if tempalte ! Condition without space will not work !**

```javascript
// simple var
tlite('{if age != 60 }Hello {name} !{else}Hello old men !{/if}', { name: 'James', age : 21});
tlite('{if age != medium }Hello {name} !{else}Hello old men !{/if}', { name: 'James', age : 21, medium : 60});
```

```javascript
//function var
tlite('{if age != 60 }Hello {name} !{else}Hello old men !{/if}', { name: 'James', age : function(){ return this.person.age; }});
```

### For
For automatically made a loop thought a given array/object. For give a key and value var to simply use result :

```javascript
tlite('{for loop}{key}:{value}<br>{/for}', {loop:['First', 'Second', 'Third']});
tlite('{for loop}{key}:{value}<br>{/for}', {loop:{name: 'Paul', age: 24, city: 'Paris'}});
```

###### Filters
Filters can remove one or multiple var from the current object. Each element you want to filter will be separated by a pipe:

```javascript
tlite('{for loop|not|that}{key}:{value}<br>{/for}', {loop:{name: 'Paul', age: 24, not: 'Paris', that: 'Test'}});
```

### Function

Vars containin a function will receive a context argument, representing the current level of parsed element. In a for, you can access to the *key* and *value* vars.

## Versions

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