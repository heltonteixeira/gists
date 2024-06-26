## Concise Perchance Code Snippets Guide

This guide provides concise explanations and examples of common Perchance syntax. 

**Note:** These snippets are common practices, but more efficient methods may exist. Feel free to think in others solutions!

**Lists**

* **Simple List:**
    ```perchance
    fruit
      apple
      banana
      orange
    
    output
      [fruit] 
    ```
    * Use square brackets `[]` to call a list.
    * Indent list items with one tab or two spaces.

* **Multiple Lists:**
    ```perchance
    fruit
      apple
      banana
      orange
    
    name
      Annie
      Jake
      John
    
    output
      [name] likes eating [fruit]
      The [fruit] is [name]'s favorite fruit
    ```
    * Combine lists within outputs.

* **Spaces in List Items:**
    ```perchance
    list
      \s One Space Before
      One Space After \s
      \s One Space Before and After \s
    
    output
      a[list]b
    ```
    * Use `\s` to add a space before or after an item.
    * Use `&nbsp;` for multiple spaces.

**Probability**

* **Changing Probability:**
    ```perchance
    fruit
      apple       // Default probability is 1
      banana ^2   // Twice the probability 
      orange ^0.5 // Half the probability
      cherry ^1/2 // Same as 0.5
    ```
    * Append `^` followed by a number to adjust probability.
    * Use `^1` for an empty selection.

**Shorthand Lists**

* **Simple Shorthand Lists:**
    ```perchance
    output
      {Annie|Jake|John} likes eating {apple|banana|orange}
    ```
    * Use curly brackets `{}` for inline lists.
    * Spaces within curly brackets matter.
    * Use `{|}` to return nothing.

* **Nested Shorthand Lists:**
    ```perchance
    output
      {{Annie|Mary}|{Jake|John}} likes eating {apple|banana|orange}
    ```
    * Nest shorthand lists within each other.

* **Normal Lists in Shorthand Lists:**
    ```perchance
    femaleName
      Annie
      Mary
      Julie
    
    maleName
      Jake
      John
      Xander
    
    output
      {[femaleName]|[maleName]} likes eating {apple|banana|orange}
    ```
    * Use normal lists within shorthand lists.

**Ranges**

* **Selecting from a Range:**
    ```perchance
    output
      {1-10} is in the range 1 to 10
      {a-z} is in the range 'a' to 'z'
    ```
    * Use `{-}` for negative ranges.
    * Combine ranges with `|`.

**Special Shorthands**

* **The A/An Shorthand:**
    ```perchance
    fruit
      apple
      orange
      banana
      cherry
    
    output
      {a} [fruit]
    ```
    * Use `{a}` to automatically choose between "a" and "an".

* **The Plural Shorthand:**
    ```perchance
    output
      {1-3} apple{s}
    ```
    * Use `{s}` to automatically pluralize words.

**Variables**

* **Initial Variables:**
    ```perchance
    fruit = {apple|banana|orange|cherry}
    
    output
      [fruit] [fruit] [fruit]
    ```
    * Define variables in the Perchance Panel.
    * Variables are un-evaluated until called.

* **Dynamic Variables:**
    ```perchance
    names
      Annie
      Jake
      John
    
    output
      [x = names] [x] [x]
    ```
    * Create variables during evaluation.
    * Dynamic variables act as aliases.

**Properties**

* **Tenses/Grammar:**
    ```perchance
    verb
      fly
      cook
      read
    
    plural
      discoveries
      experiments
    
    output
      A lot of [fruit.pluralForm] here. 
      He [verb.pastTense]. 
    ```
    * Use properties like `.pluralForm`, `.pastTense`, etc. to modify grammar.

* **Text Formatting:**
    ```perchance
    fruit
      Apple
      Orange
      Banana
      Cherry
    
    sentence
      a lot of [fruit.pluralForm] here.
    
    output
      [sentence.upperCase]
      [sentence.lowerCase]
    ```
    * Use properties like `.upperCase`, `.lowerCase`, etc. to format text.

**Storing Text**

* **Using `.selectOne`:**
    ```perchance
    output
      The [x = fruit.selectOne]. The [x] is a delicious fruit.
    ```
    * Use `.selectOne` to store a single item.

* **Using `.evaluateItem`:**
    ```perchance
    output
      The [x = fruit.evaluateItem]. The [x] is a delicious fruit.
    ```
    * Use `.evaluateItem` to store a string or evaluated text.

**Repeating and Selecting Multiple Items**

* **Using `.selectMany`:**
    ```perchance
    output
      The three fruits are [fruit.selectMany(3)]
    ```
    * Use `.selectMany(n)` to select `n` items.

* **Adding Delimiters to `.selectMany`:**
    ```perchance
    output
      The three fruits are [fruit.selectMany(3).joinItems(', ')]
    ```
    * Use `.joinItems()` to add delimiters between items.

* **Repeating a Selection:**
    ```perchance
    output
      The fruit selected is [x = fruit.selectOne]. I said, the fruit selected is [x.selectMany(3).joinItems(', ')]
    ```
    * Repeat a selection using `.selectMany()` on a stored variable.

* **Selecting Unique Items:**
    ```perchance
    output
      The fruits are [fruit.selectUnique(3).joinItems(', ')]
    ```
    * Use `.selectUnique(n)` to select `n` unique items.

* **Selecting from a Random Range of Numbers:**
    ```perchance
    output
      The fruits are [fruit.selectMany(1,3).joinItems(', ')]
    ```
    * Use `.selectMany(min, max)` to select a random number of items within a range.

* **Selecting All Items:**
    ```perchance
    output
      The fruits are [fruit.selectAll.joinItems(', ')]
    ```
    * Use `.selectAll` to select all items.

**Commas in Square Brackets**

* **Outputting Nothing:**
    ```perchance
    output
      The fruits are [fruit.selectMany(3).joinItems(', ') , '']
    ```
    * Use `, ''` to hide output.

* **Outputting Specific Text:**
    ```perchance
    output
      The fruits are [fruit.selectMany(3).joinItems(', ') , '... secret']
    ```
    * Use `, 'text'` to output specific text.

* **Executing Multiple Actions:**
    ```perchance
    output
      [x = fruit.selectOne, y = item.selectOne, 'STORED SELECTIONS: ']The fruit is [x] and the item is [y].
    ```
    * Use commas to separate actions within square brackets.

**Execution Orders**

* **Action Execution Order:**
    ```perchance
    output
      My favorite fruit is [f = fruit.selectOne]. [f] is delicious!
    ```
    * Actions are executed from left to right, top to bottom.

* **Math Execution Order:**
    ```perchance
    output
      [5 + (5 * 10) / 6**2 - 1]
    ```
    * Follow the order of operations (BIDMAS/PEMDAS).

**HTML and CSS**

* Use HTML tags and CSS styles to design your generator.
* Refer to MDN resources for HTML and CSS documentation.

**Logical Operators**

* **OR Operator (||):**
    ```perchance
    output
      x: [x = item.selectOne], y: [y = fruit.selectOne], \[x || y\]: [x || y]
    ```
    * Returns the first value that is not empty.

* **AND Operator (&&):**
    ```perchance
    output
      x: [x = item.selectOne], y: [y = fruit.selectOne], \[x && y\]: [x && y]
    ```
    * Returns the first `false` value, or the last `true` value.

**Consumable List**

* **For Unique Items:**
    ```perchance
    output
      Here are the fruits in the basket: [basket = fruit.consumableList] [basket] [basket] [basket] [basket]
    ```
    * Use `.consumableList` to select items that cannot be selected again.

* **For Non-Unique Items:**
    * `.consumableList` works with non-unique items as well.

* **Infinite Consumable List:**
    ```perchance
    consumableListLoop = {import:consumable-list-loop-plugin}
    
    output
      Here are the fruits in the basket: [basket = consumableListLoop(fruit)] [basket] [basket] [basket] [basket]
    ```
    * Use the `consumable-list-loop-plugin` to refresh the consumable list. 

**Hierarchical Lists**

* **Simple Hierarchical List:**
    ```perchance
    animal
      mammal
        kangaroo
        pig
        human
      reptile
        lizard
        crocodile
        turtle
      insect
        spider
        beetle
        ant
    
    output
      A: [animal] // Category
      B: [animal.selectOne] // Random item from selected category
      C: [animal.mammal] // Random mammal
    ```
    * Use indentation to create sub-lists.
    * Access sub-lists using `.` notation.

* **Three Plus Deep Hierarchy:**
    ```perchance
    list
      a
        aa
          aaa
            aaaa
            aaab
            aaac
          aab
        ab
        ac
      b
      c
    
    output
      1: [list]
      2: [list.selectOne]
      3: [list.selectOne.selectOne]
      4: [list.selectOne.selectOne.selectOne]
    ```
    * Chain `.selectOne` to access deeper levels.
    * Selection ends at the deepest level without children.

**Importing and Exporting**

* **Default Exports/Imports:**
    ```perchance
    // importable-generator
    animal
      mammal
        kangaroo
        pig
        human
      // ...
    
    // main-generator
    imported = {import:importable-generator}
    
    output
      A: [imported.animal]
    ```
    * Import entire generators using `{import:generator-url}`.
    * Access imported lists using `.` notation.

* **Specific Exports/Imports:**
    ```perchance
    // importable-generator
    $output = [mammal]
    mammal
      kangaroo
      pig
      human
    // ...
    
    // main-generator
    imported = {import:importable-generator}
    
    output
      A: [imported]
    ```
    * Use `$output` to specify exported lists.
    * Imported lists are accessible as a single list.

**If/Else Statements**

* **Simple If/Else:**
    ```perchance
    number = {1-6}
    
    output
      You rolled a [n = number.selectOne]. [if (n < 4) {sad} else {happy}].
    ```
    * Use `if (condition) {true} else {false}` for simple branching.
    * Avoid using square brackets inside square brackets.

* **Comparison Operators:**
    * `==` (equal to)
    * `===` (equal value and type)
    * `!=` (not equal to)
    * `!==` (not equal value or type)
    * `>` (greater than)
    * `<` (less than)
    * `>=` (greater than or equal to)
    * `<=` (less than or equal to)

* **Logical Operators:**
    * `&&` (and)
    * `||` (or)
    * `!` (not)

* **Comparing Different Data Types:**
    * Be careful when comparing numbers and strings.
    * Use `===` for strict type comparison.

* **Else If Statements:**
    ```perchance
    number = {1-6}
    
    output
      [n = number.selectOne] Today was ... [if (n > 4) { good } else if (n <= 4 && n >= 3) { neutral } else { bad }]
    ```
    * Use `else if` for multiple conditions.

* **If Else Output Specific:**
    ```perchance
    number = {1-6}
    
    output
      [n = number.selectOne] Today was ... [if (n == 6) { "Cool" } else if (n == 5) { "Nice" } else { "" }]
    ```
    * Output specific text using `{}` within `if/else`.
    * Use `, ''` to output nothing.

* **Other If/Else Formats:**
    * Without curly brackets: `[if (n > 4) good; else if (n <= 4 && n >= 3) neutral; else bad].`
    * Using ternary operator: `[(n > 4) ? good : (n <= 4 && n >= 3) ? neutral : bad].`

**Dynamic Odds**

* **If Else in Odds:**
    ```perchance
    fruit
      an apple
      some blueberries ^[if (c != "Jamie") { 1 } else { 0 }]
    ```
    * Use `^` followed by an `if/else` expression to dynamically adjust odds.

* **Using Comparisons Only:**
    ```perchance
    fruit
      an apple
      some blueberries ^[c != "Jamie"]
    ```
    * Use comparisons directly within odds.

* **Converting If Elses to Dynamic Odds:**
    ```perchance
    result
      [good]^[n > 4]
      [neutral]^[n <= 4 && n >= 3]
      [bad]^[n < 3]
    ```
    * Convert `if/else` statements to dynamic odds.

* **Changing Odds Based on a Variable:**
    ```perchance
    value
      red^[x == "random" ? 1 : x == "red" ? 1 : 0]
      blue^[x == "random" ? 1 : x == "blue" ? 1 : 0]
      green^[x == "random" ? 1 : x == "green" ? 1 : 0]
    ```
    * Adjust odds based on a variable's value.

* **Odds Modifiers:**
    ```perchance
    modifyOdds
      [thinOdds = 2, normalOdds = 1, athleticOdds = 2, plusSizeOdds = 0, '']^[r == "elf"]
      // ...
    
    bodyType
      thin^[thinOdds]
      normal^[normalOdds]
      athletic^[athleticOdds]
      plus size^[plusSizeOdds]
    ```
    * Use variables to modify odds within a list.

**Hierarchical Sub-listing**

* **Simple Sub-listing:**
    ```perchance
    output
      Animal Group: [x = animal.evaluateItem] <br> Animal: [animal[x]]
    ```
    * Use `.evaluateItem` to get the text of a list item.
    * Use square brackets `[]` to access sub-lists using the text value.

* **Multi-Level Sublisting:**
    ```perchance
    output
      First Level: [x = list.evaluateItem] <br> Second Level: [y = list[x].evaluateItem] <br> Third Level: [list[x][y]]
    ```
    * Chain sub-listing to access deeper levels.

* **Modular List Names:**
    ```perchance
    output
      Your Race: [r = race.evaluateItem] <br> Your Gender: [g = gender.evaluateItem] <br> Your Name: [names[g+"_"+r]]
    ```
    * Combine variables to create dynamic list names.

**Traversing the Hierarchical List**

* **Going Down:**
    ```perchance
    output
      A: [list.evaluateItem] // One Deep Down
      B: [list.selectOne] // Two Deep Down (if possible)
    ```
    * Use `.evaluateItem` to go down one level.
    * Use `.selectOne` to go down multiple levels.

* **Going Up:**
    ```perchance
    output
      A: [item] [item.getName] // One Higher Up
      B: [item] [item.getParent] // Two Higher Up (if possible)
    ```
    * Use `.getName` to get the name of the current list.
    * Use `.getParent` to access the parent list.

**Functions**

* **Defining Functions:**
    ```perchance
    functionName(inputs) =>
      // Code Here ... 
      return returnValue
    ```
    * Use arrow functions to define functions.
    * Return a value to use the function within square brackets.

* **Example with Dynamic Odds:**
    ```perchance
    result() =>
      if (n > 4) {
        return good;
      } else if (n <= 4 && n >= 3) {
        return neutral;
      } else {
        return bad;
      }
    ```
    * Convert dynamic odds logic into a function.

* **Square Brackets as Functions:**
    * Square brackets are essentially functions.

**Custom Properties and Methods**

* **Custom Properties:**
    ```perchance
    output
      Property 1: [list.property1]
      Property 2: [list['property2']]
    ```
    * Define properties within lists using `=` notation.
    * Access properties using `.` or `[]` notation.

* **Built-in Properties:**
    * `.selectOne`, `.titleCase`, `.lowerCase`, etc.

**Custom Properties and Methods (Continued)**

* **Custom Properties:**
    * Follow Perchance list naming conventions:
        * No spaces
        * Letters, numbers, underscores
        * Cannot start with a number
        * Avoid reserved names (listed in the original documentation).

* **Custom Methods:**
    ```perchance
    list
      method1() => return 'returned value of method1'
      method2() => return 'returned value of method2'
    ```
    * Define methods within lists using `()` notation.
    * Access methods using `.` notation followed by `()`.

* **Built-in Methods:**
    * `.selectMany()`, `.joinItems()`, `.selectUnique()`, etc.

**The `$output` Keyword**

* **Changing Output of a List:**
    ```perchance
    list
      $output = The output
      item1
      item2
      item3
    ```
    * Use `$output` to define the output of a list.

* **Joining Items in a List:**
    ```perchance
    list
      $output = [this.selectAll.joinItems(", ")]
      item1
      item2
      item3
    ```
    * Join items using `.selectAll` and `.joinItems()`.

* **Output Nothing:**
    ```perchance
    list
      $output = [this.selectAll.joinItems(", "), '']
      item1
      item2
      item3
    ```
    * Use `, ''` to output nothing.

* **Initializing Variables:**
    ```perchance
    init
      $output = [this.selectAll.joinItems(""), '']
      [x = list.selectOne]
      [y = list2.selectOne]
    ```
    * Initialize variables without displaying them.

* **Changing Output at Each Level:**
    * Use `$output` at each level of a hierarchical list to control output.

**Plugins**

* **Importing Plugins:**
    ```perchance
    dice = {import:dice-plugin}
    ```
    * Use `{import:plugin-name}` to import plugins.
    * Refer to plugin documentation for specific usage.

* **Example with `dice-plugin`:**
    ```perchance
    output
      [dice('2d6')]
    ```
    * Use plugin functions within square brackets.

**Leaves**

* **Selecting a Leaf:**
    ```perchance
    output
      [trunk.selectOne.selectOne.selectOne]
    ```
    * Chain `.selectOne` to select a leaf.

* **Using `select-leaf-plugin`:**
    ```perchance
    selectLeaf = {import:select-leaf-plugin}
    
    output
      [selectLeaf(trunk)]
    ```
    * Use `selectLeaf()` to select a random leaf.

* **Other Leaf Selection Plugins:**
    * `select-leaves-plugin` (multiple selection)
    * `select-all-leaves-plugin` (all leaves)
    * `consumable-leaf-list-plugin` (consumable list of leaves)

**Objects and Instances**

* **Objects:**
    ```perchance
    character_obj
      name = [name]
      age = {10-40}
      mood = {happy|sad}
    ```
    * Objects are hierarchical lists with properties.

* **The `this` Keyword:**
    * `this` refers to the parent of the current item.
    * Use `this` to access properties within the same level.

* **Instances:**
    ```perchance
    createInstance = {import:create-instance-plugin}
    
    output
      [x = createInstance(character_obj), ''] Name: [x.name], Age: [x.age], Mood: [x.mood] <br> [x.about]
    ```
    * Instances are objects with fixed property values.
    * Use `createInstance()` to create an instance.

* **Deep Instances:**
    ```perchance
    output
      [p = createInstance(person, "deep"), p.child.age] [p.child.age] [p.child.age]
    ```
    * Use `createInstance("deep")` to create nested instances.

**Update Individual Parts**

* **Update by Id:**
    ```javascript
    <button onclick="update(maleCon)">Randomize Male Name</button>
    ```
    * Use `update(elementId)` to update elements by ID.

* **Using `tap-plugin`:**
    ```perchance
    tap = {import:tap-plugin}
    
    output
      My name is [tap(names)], and my favorite fruit is [tap(fruit)]
    ```
    * Use `tap()` to make individual items clickable for re-randomization.

**Other Properties/Methods**

* **`.createClone` and `.getSelf`:**
    * Create a clone of a list to avoid modifying the original.

* **`.getChildNames`, `.getPropertyKeys`, `.getFunctionNames`:**
    * Get lists of children, properties, and functions.

* **`.getOdds`, `.getLength`, `.sumItems`:**
    * Access odds, length, and sum of items.

* **`.getRawListText`:**
    * Get the raw text of a list.

* **`.replaceText()`:**
    * Replace text within a list using regular expressions.

* **`.toString()`, `.toLocaleString()`, `.valueOf()`:**
    * Convert lists to strings and access their values.

**Multiple Selection Manipulation**

* **`.pop()`, `.push()`, `.shift()`, `.unshift()`:**
    * Manipulate array elements.

* **`.map()` and `.forEach()`:**
    * Iterate and modify arrays.

**Note:** This guide provides a concise overview of common Perchance syntax. For more detailed information, refer to the official Perchance documentation.
