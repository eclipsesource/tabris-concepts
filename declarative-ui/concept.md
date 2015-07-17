# Declarative UI Concept

We've looked into many other frameworks and discussed various implications of declarative UI.
Here's a short summary.

## Language

Declarative UI is commonly defined in **XML**: Angular, React, NativeScript, Android, Vaadin, Gnome, Qt, XUL, XAML, etc.

- intuitive nesting
- simple mapping
  - elements -> widgets
  - attributes -> widget properties

```xml
<Composite background="white">
  <TextView font="bold 12pt Helvetica" />
</Composite>
```

## Mapping attributes to properties

XML attributes are strings, must be mapped to property types.

- fonts, colors, are already defined as strings
- mapping of strings to numbers and boolean is obvious, conflicts (`"true"` vs. `true`) are probably neglectable, especially when the target property type is known.
- arrays are commonly represented as whitespace separated strings
- objects are problematic. images, transformations, and layoutData are defined as objects

Image examples:

```js
"images/catseye.jpg"
{src: "images/catseye.jpg", width: 300, height: 200}
{src: "http://example.com/catseye.jpg", scale: 2}
```

Transformation example:

```js
{scaleX: 2, scaleY: 2, rotation: Math.PI * 0.75}
```

### Possible Solutions

We've considered [different approaches](examples/layout-data.xml) to define object-valued properties as attributes in XML, including

- Using separate elements
- Using JSON in attributes
- Using CSS style syntax in attributes
- Using separate attributes for object members

We eventually agreed to provide **string encodings** for object-valued properties, as we already do for fonts and colors.
If possible, use CSS syntax, e.g. for transformations.

## Dealing with CollectionView cells

CollectionView cells are framework created. Only cell templates should be defined in declarative UI.

Example:

```xml
<CollectionView>
  <Cell repeat="book in items">
    <ImageView scaleMode="fit" image="{{book.image}}" />
    <TextView markupEnabled="true" textColor="#4a4a4a" text="{{book.title}}" />
    <TextView textColor="#7b7b7b" text="{{book.author}}" />
  </Cell>
</CollectionView>
```

The "repeat" attribute may be misleading here. It could suggest that items from arbitrary collections can be appended.
We should move this attribute to CollectionView (or use the items property).

### Different cell types

In case of different cell types, multiple templates need to be specified, either with a match expression, or with a type attribute.

```xml
<CollectionView itemHeight="72" items="{{book in data.books}}">
  <Cell when="{{book.section}}">
    …
  </Cell>
  <Cell><!-- other cell types -->
    …
  </Cell>
</CollectionView>
```

## Layout

Where should layouts be defined:

- directly in the markup
- in JSON and applied using `apply()`

Both should be possible. We can leave this decision to the application developer.

### Responsive layouts

There are different approaches:

- Different UI definitions (XML files) per form factor
  - seems to be the common approach on Android and iOS
  - multiplies the number of XML files by a factor of 3 or more
- One shared UI definition in an XML file, multiple JSON files or sections for different form factors
  - JSON could not exclude elements, only make them invisible

Again, both should be possible, we can leave this decision to the application developer.

## Data Binding

Data bindings are often defined declaratively.
If they are not, code must be written to bind/update widgets.

I've created drafts for a declarative bookstore demo in [examples](examples).

Is declarative UI without databinding an improvement at all?

### Two way binding?

Trend seems to be towards **one-way** databinding (React, Angular 2)
- two-way may be dangerous, may be slow

> ... flow-based programming, where data flows through the application in a single direction — there are no two-way bindings ...

> We found that two-way data bindings led to cascading updates, where changing one object led to another object changing, which could also trigger more updates. As applications grew, these cascading updates made it very difficult to predict what would change as the result of one user interaction. When updates can only change data within a single round, the system as a whole becomes more predictable.

> -- https://facebook.github.io/flux/docs/overview.html

## Templating Engines

Mustache-based template engines (`{{}}` style) are state of the art.
Angular, Polymer, HandleBars / HtmlBars in Ember, Rivets, JsViews, etc.

ES6 backticks allow for basic templates, however, they
- don't support control structures (conditionals, loops, etc.)
- nested expression like `book.author.name` would throw if `book.author` is undefined

Template engines usually have flow control statements, such as `{{#each items}}`.
Angular, Aurelia use XML attributes for conditionals and loops, superior because
- reduces code as no additional lines are required for begin and end statements

Example (Angular):

```xml
<ul>
  <li ng-repeat="item in items" title="{{item.name}}">
    {{item.description}}
  </li>
</ul>
```

Example (Ember):

```xml
<ul>
  {{#each items}}
    <li {{bind-attr title=item.name}}>
      {{item.description}}
    </li>
  {{/each}}
</ul>{{}} in
```

## Reusable Components

Allow for custom UI components (composed widgets, page fragments) that can be re-used.

UI documents should not be limited to pages.

If possible, re-use concepts from web components.

## Integration

- When to parse XML
  - at runtime (required if declarative UI)
  - at build time (may improve performance)
- When to evaluate templates
  - before XML parsing (handlebars does XML encoding)
  - after XML parsing (on demand)
- How to instantiate UIs, how many instances
