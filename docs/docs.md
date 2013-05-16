# TOC
   - [mockrequire](#mockrequire)
<a name=""></a>
 
<a name="mockrequire"></a>
# mockrequire
should load provided object instead of module's originally required dependency.

```js
handler.childDependency.should.equal(module);

handler.method({ email: 'fake@email.com' });

user.should.have.property('saved', true);
```

should load non-mocked dependency normally.

```js
handler.childDependency2.should.equal(require('./support/handler2'));
```

