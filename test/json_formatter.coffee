formatter = require '../src/lib/json_formatter.coffee'

suite 'JSONFormatter', ->

  suite '#htmlEncode', ->
    test 'null', ->
      assert.equal(formatter.htmlEncode(null), '')
    test 'normal string', ->
      assert.equal(formatter.htmlEncode('abcd'), 'abcd')
    test 'html string', ->
      assert.equal(formatter.htmlEncode('<"&>'), '&lt;&quot;&amp;&gt;')

  test '#jsString', ->
    assert.equal(formatter.jsString('string'), 'string')

  test 'decorateWithSpan', ->
    assert.equal(
      formatter.decorateWithSpan('value', 'class-name'),
      '<span class="class-name">value</span>'
    )

  test '#nullToHTML', ->
    assert.equal(formatter.nullToHTML(null), '<span class="null">null</span>')

  test '#numberToHTML', ->
    assert.equal(formatter.numberToHTML(1), '<span class="num">1</span>')

  suite '#stringToHTML', ->
    test 'normal string', ->
      assert.equal(formatter.stringToHTML('string'), '<span class="string">"string"</span>')
    test 'http url', ->
      assert.equal(
        formatter.stringToHTML('http://yesmeck.com'),
        """
        <a href="http://yesmeck.com"><span class="q">"</span>http://yesmeck.com<span class="q">"</span></a>
        """
      )

  test '#booleanToHTML', ->
    assert.equal(formatter.booleanToHTML(true), '<span class="bool">true</span>')

  test '#arrayToHTML', ->
    assert.equal(
      formatter.valueToHTML([1]),
      '<span class="collapser"></span>[<ul class="array collapsible"><li><span class="num">1</span></li></ul>]'
    )

  test '#objectToHTML', ->
    assert.equal(
      formatter.objectToHTML({a: 1}),
      """
      <span class="collapser"></span>{<ul class="obj collapsible"><li><span class="prop"><span class="q">"</span>a<span class="q">"</span></span>: <span class="num">1</span></li></ul>}
      """
    )

