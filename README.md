# jquery.bayWindow.js

A jquery plugin that adds the floating window function.

## Installation

Include script _after_ the jQuery library (unless you are packaging scripts somehow else):

```html
<script src="/path/to/jquery.bayWindow.js"></script>
```

## Usage

If you want to use the default element:
```javascript
$.createBayWindowElement(createBayWindowElementOption)
 .bayWindow(bayWindowOption)
```

or use a custom element:

```javascript
$(element).bayWindow(bayWindowOption)

// if need destroy
$(closeBtn).on('click', function() {
  $(element).bayWindow('destroy')
})
```

## Options for $.createBayWindowElement
<table>
  <tr>
    <th>Option</th>
    <th>Data Attribute</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><i>href</i></td>
    <td><i>string</i></td>
    <td><i>''</i></td>
    <td>Href attribute of <i>a</i> tag</td>
  </tr>
  <tr>
    <td><i>src</i></td>
    <td><i>string</i></td>
    <td><i>''</i></td>
    <td>Href attribute of <i>img</i> tag</td>
  </tr>
    <tr>
    <td><i>width</i></td>
    <td><i>string</i></td>
    <td><i>230px</i></td>
    <td>Width of img</td>
  </tr>
  <tr>
    <td><i>height</i></td>
    <td><i>string</i></td>
    <td><i>130px</i></td>
    <td>Height of img</td>
  </tr>
  <tr>
    <td><i>id</i></td>
    <td><i>string</i></td>
    <td><i>jsBayWindow</i></td>
    <td>Id attribute</td>
  </tr>
</table>

## Options for $(element).bayWindow
