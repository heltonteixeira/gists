## Perchance Examples

* **Example 1**
```
output
	I can never remember what [w = word.selectOne] means. Do you know what [w] means?

word
  benighted
	emeritus
	vole
	ex gratia
	bissextile
	
// See explanation here: https://perchance.org/examples

---

<h1>Storing Selections Example</h1>
<p>[output]</p>
<button onclick="update()">randomize</button>

```

* **Example 2**
```
output
	The word "[w = word.selectOne]" means "[w.definition]".

word
  benighted
		definition = Overtaken by night or darkness.
	emeritus
		definition = Retired but retaining an honorary title.
	vole
		definition = Any of various rodents of the genus Microtus and related genera.
	ex gratia
		definition = As a favor or gesture of goodwill, rather than from any legal requirement.
	bissextile
	  definition = Of or pertaining to the leap year or the extra day in the leap year.
		
// See explanation here: https://perchance.org/examples

---

<h1>Storing Selections Example 2</h1>
<p>[output]</p>
<button onclick="update()">randomize</button>

```

* **Example 3**
```
// This is an example made for the    perchance.org/examples    page.

name = {import:common-first-name}

output
  [n = name.selectOne] said "[say]" and then {ran away|just stood there}.

say
  My name is [n]

 ---

 <h1>Execution Order Example</h1>
<p>[output]</p>
<button onclick="update()">randomize</button>
```

* **Example 4**
```
output
  [sentence]

sentence
	Don't worry, I'll just {import:verb} the [noun.pluralForm] ... {import:ascii-face}
	
noun = {import:noun}

// Explanation here: https://perchance.org/examples

---

<h1>Importing Example</h1>
<p>[output]</p>
<button onclick="update()">randomize</button>

```

* **Example 5**
```
number = {1-6}

output
  You rolled a [n = number.selectOne]. [if (n < 4) {sad} else {happy}].

sad
  Too bad
  Oh well

happy
  Cool
  Nice

 ---

<h1>Simple if/else Example</h1>
<p style="margin:1em auto; padding:0 1em; max-width:700px;">[output]</p>
<button onclick="update()">randomize</button>
<br>

```

* **Example 6**
```
output
  Your calculated damage is [calculateDamage()].
  
dice = {1-6}

calculateDamage() =>
  d = dice.selectOne
  if(d >= 5) {
    d = d*2
  }
  return d

---

<h1>Simple Critical Hit Function Example</h1>
<p style="margin:1em auto; padding:0 1em; max-width:700px;">[output]</p>
<button onclick="update()">randomize</button>
<br>
<p style="margin:3rem auto; max-width:400px; font-size:80%;">This simple example was made for the if/else section of the <a href="https://perchance.org/examples" target="_blank">perchance.org/examples</a> page. Have a look at the <a href="https://perchance.org/simple-critical-hit-example#edit" target="_blank">non-function</a> version of this example.</p>

```

* **Example 7**
```
output
	<b>Character</b>
	Name: <i>[name]</i>
	Eye color: <i>[eyeColor]</i>
	Height: <i>[height]</i>
	$output = [this.joinItems("<br>")]

name = {import:chocobo-name}
eyeColor = {green|brown|red|black|blue|purple}
height = {100-300}cm

---

<h1>Multi-Line Pro Example</h1>
<p>[output]</p>
<button onclick="update()">randomize</button>

```

* **Example 8**
```
output
	Your name is [name].
	
name = Default Name

// See explanation here: https://perchance.org/examples

---

<h1>Minimal Input Example</h1>
<input oninput="name = this.value; update()" placeholder="your name"/>
<p>[output]</p>

```

* **Example 9**
```
animal = {import:animal}
plant = {import:plant-species}

output
  [animal] (animal)          ^[animalBox.checked]
  [plant.lowerCase] (plant)  ^[plantBox.checked] 

---

<h1>Checkbox Example</h1>

<p>This will pick a colour only from the selected boxes:</p>

Animals: <input type="checkbox" id="animalBox" checked/>
<br>
Plants: <input type="checkbox" id="plantBox" checked/>

<p>Output: [output]</p>

<button onclick="update()">randomize</button>

```

* **Example 10**
```
output
	{A} [r = race.selectOne, r.name] passed through here earlier. Probably {a} [r.type].

race
	elf
		name = Elf
		type
			Drow
			High Elf
			Wood Elf
			
	orc
		name = Orc
		type
			Uruk-hai
			Half-orc
			
	goblin
		name = Goblin
		type
			Hobgoblin
			Kobold

---

<h1>Hierarchy Example 2</h1>
<p>[output]</p>
<button onclick="update()">randomize</button>

```

* **Example 11**
```
output
  Here are 3 animals joined with hyphens: [getAnimals(3, "-")], and here are 2 more joined with dollar signs: [getAnimals(2, "$")].

animal = {import:animal}

getAnimals(num, joiner) =>
  return animal.selectMany(num).joinItems(joiner)

---

<h1>Function With 2 Inputs (Example)</h1>
<p style="margin:1em auto; padding:0 1em; max-width:700px;">[output]</p>
<button onclick="update()">randomize</button>
<br>
<p style="margin:3rem auto; max-width:400px; font-size:80%;">This simple example was made for the "Functions" section of the <a href="https://perchance.org/examples" target="_blank">perchance.org/examples</a> page.</p>

```

* **Example 12**
```
output
  [animal.selectOne.selectOne.description]

animal
  mammal
    mouse
      description = a [this.getName] is a type of [this.getParent.getName]  
    kangaroo
      description = a [this.getName] is a type of [this.getParent.getName]
  reptile
    lizard
      description = a [this.getName] is a type of [this.getParent.getName]
    turtle
      description = a [this.getName] is a type of [this.getParent.getName]

---

<h1>.getParent.getName Example</h1>
<p>[output]</p>
<button onclick="update()">randomize</button>

```

* **Example *13*
```
createInstance = {import:create-instance-plugin}

output
	[c = createInstance(character),""][c.name] is [c.age] years old. [c.pronoun.titleCase] is about [c.height]cm in height. [c.pronoun.titleCase]'s [c.mood].

character
	age = {18-60}
	height = {14-20}0
	sex = {female|male}
	pronoun
	  she ^[this.getParent.sex == "female"]
		he  ^[this.getParent.sex == "male"]
	name = [names[this.sex]]   // this uses "dynamic sublist referencing" - explained at perchance.org/examples
	mood = [mood] 

names
	male
		Kalid
		Bob
	female
		Anita
		Jessica
	
mood 
	sleepy
	happy
	a bit sad
---
<h1>Create Instance Plugin Example</h1>
<p style="margin:1em auto; width:95%; max-width:700px;">[output]</p>
<button onclick="update()">randomize</button>
<p>Check out the <a href="create-instance-plugin">create-instance-plugin</a> page for details. Also have a look at <a href="https://perchance.org/create-instance-plugin-example-2#edit">this more complex</a> example.</p>

```

* **Example *14*
```
// To understand what `[pronoun[g]...` means, have a read
// of the "Dynamic Sub-list Referencing" section on the
// perchance.org/examples page.

// See this page more details: https://www.reddit.com/r/perchance/comments/b7vtzq/how_do_i_make_sure_pronouns_match_randomly/

output
	This person is [g = gender.selectOne]. [pronoun[g].she.titleCase] [pronoun[g].is] {a} [race].
	
gender
	a man
	a woman
	non-binary
	
pronoun
	a man
		she = he
		her = his
		is = is
	a woman
		she = she
		her = her
		is = is
	non-binary
		she = they
		her = their
		is = are
		
race
	dwarf
	human
	elf


	

---
<h1>Matching Pronouns with Genders Example</h1>
<p style="margin:1em auto; padding:0 1em; max-width:700px;">[output]</p>
<button onclick="update()">randomize</button>

```

* **Example *15*
```
output
	[character.hp=100,""][battle]

character
  name = {import:female-norwegian-name}
  hp = 100
  mana = 100
  stamina = 100

turn
  [character.hp -= 5, ""]You were hit in the torso with a stone.
	[character.hp += 7, ""]A nearby medic heals your wounds. ^0.3
  [character.stamina += 5, ""]There's a brief lull and you get a chance to catch your breath.
  [character.hp -= 50, ""]A mace strikes you in the back of the head.

status
  You are dead. ^[character.hp <= 0]
  You have [character.hp] hp. ^[character.hp > 0]
	
battle
  [turn]<br>[status]<br>[battle] ^[character.hp > 0]
	It's over. ^[character.hp <= 0]
	
// See explanation here: https://perchance.org/examples
---
<h1>Simple Battle Simulator Example</h1>
<p>[output]</p>
<button onclick="update()">randomize</button>
<br><br>
<p style="opacity:0.7">Want it to take one turn per button click? Check out <a href="https://perchance.org/battle-simulator-one-turn-per-click-example#edit">this example</a>.</p>

```

* **Example *16*
```
die = {1-6}

// for this question: https://www.reddit.com/r/perchance/comments/bcptf5/stable_lists_and_variables/
---
<h1>Dice Game Example</h1>
<p>You've thrown [mine = die.selectOne]</p>
<p>They've thrown [theirs = die.selectOne]</p>
<button onclick="update()">Roll the dice</button>
<p>[mine == theirs ? "It was a draw." : mine > theirs ? "You won!" : "They won."]</p>
```

* **Example *17*
```
output
	You are {a} [r = race.selectOne] working as {a} [j = job.selectOne]. Your rune is [element].

race
	Human
	Elf
	Dwarf
	Troll

job
	Hunter ^[if (r == "Elf") {0} else {1}] // If race is "Elf", then odds is 0, otherwise it's 1
	Herder
	Warrior
	Mage ^[if (r == "Dwarf") {5} else {1}] // If race is "Dwarf", odds is 5 otherwise it's 1
	Thief

element
	Water ^[if (j == "Warrior") {0.2} else {1}] // If job is "Warrior", then odds is 0.2, otherise it's 1
	Fire
	Earth
	Air
	Darkness ^[if (r == "Troll") {99999999999} else {1}] // If race is "Troll", then odds is absurdly high, otherwise it's 1
	

// The `==` means "is equal to". There are also other "operators" for "is greater than", "is less than", "is not equal to", etc.
// Read the "Dynamic Odds" section on the https://perchance.org/examples webpage to learn more.


// You can use this if/else notation in regular text too - not just dynamic odds. For example:
output2
  You are {a} [r = race.selectOne]. You are [if(r == "Dwarf") {"short"} else {"tall"}].
	
// But don't forget the double-quotes around "short" and "tall", otherwise Perchance will look for a
// list or variable called literally `short` or `tall` and will return `undefined` since it won't be
// able to find one. You don't need to put quotes around numbers, which is why in the above example we
// wrote [if (r == "Elf") {0} else {1}] instead of [if (r == "Elf") {"0"} else {"1"}]

// There's also a short-hand version of if/else statements that looks like this:
//     [ifThisIsTrue ? thenOutputThis : otherwiseOutputThis]
// e.g.
//     [r == "Dwarf" ? "short" : "tall"]

// You can also "chain" else/ifs like so:
//     [if (r == "Elf") {0} else if(r == "Dwarf") {3} else {1}]
// And you can use more complex "conditions" as described in the "Dynamic Odds" section of the perchance.org/examples page:
//     [if (r == "Elf" || r == "Human") {3} else if(r == "Dwarf") {3} else {1}]
---
<h1>If/Else In Dynamic Odds Example</h1>
<p>[output]</p>
<button onclick="update()">randomize</button>
```

* **Example *18*
```
output
  That [a = animal.selectOne] is really [adjective].
  
animal
  pig
  ant
  zebra 
	
adjective
  small
  big ^[a != "ant"]
  cute

---
<h1>Exclude Item Based On Previous Selection Example</h1>
<p style="margin:1em auto; padding:0 1em; max-width:700px;">[output]</p>
<button onclick="update()">randomize</button>
<br>

```

* **Example *19*
```
counter = 0

item
  You lost.
  YOU WIN! [counter++, ""]
  You didn't win.
  Lost :(

output
  The results are in... [item]  Your current score: [counter]
---
<h1>Increment Counter When Specific Items Is Selected (Example)</h1>
<p style="margin:1em auto; padding:0 1em; max-width:700px;">[output]</p>
<button onclick="update()">randomize</button>
<br>
<!-- Learn HTML here:   https://www.khanacademy.org/computing/computer-programming/html-css    -->

```

* **Example *20*
```
output
  [t = tree.selectOne]
  
tree
  branch1
    leaf1
    leaf2
  branch2
    leaf3
    leaf4

treeDropDownList
  $output = [this.selectAll.joinItems("")]
  <select oninput\="Tree \= this.value">
  [tree.selectAll.map(a => `<option value="${a.getName}">${a.getName}</option>`).joinItems("")]
  </select>
---
<h1>Generate Drop-Down Input From Hierarchical List (Example)</h1>
<p>[treeDropDownList]</p>
<p style="font-size:80%; max-width:400px; margin:1rem auto;">(Created to help answer <a href="https://www.reddit.com/r/perchance/comments/oc277q/selectone_or_dynamic_dropdowns_selecting_from_the/" target="_blank">this forum question</a> - click that link for an explanation. Also check out <a href="https://perchance.org/dynamic-drop-down-list-example#edit" target="_blank">this example</a> which is explained <a href="https://www.reddit.com/r/perchance/comments/f4fja3/dynamic_dropdown_menu/fia81my/" target="_blank">here</a>.)</p>
```

* **Example **
```
seeder = {import:seeder-plugin} 
animal = {import:animal}
noun = {import:concrete-noun}

seed = blah 

output
  The [seeder(seed, "cache")][animal][seeder()] is on the [noun].

// The seeder(seed, "cache") part includes "cache" because we don't want to "reset" the "blah" seed every time we enable it.
// we instead want to "resume" where we left off.
// That [seeder()] part (after [animal]) removes the seed and returns to normal/"real" randomness.


// Pro tip: Here's a nicer way of doing it:

seededAnimal
  [seeder(seed, "cache")][animal][seeder()]  
  
betterOutput
  The [seededAnimal] is on the [noun].
---
<h1>Use Seeder Plugin For One Import Only (Example)</h1>
<p>[betterOutput]</p>
<button onclick="update()">generate</button>

<p style="font-size:80%; margin:3rem auto; max-width:400px;">Notice that when you refresh the page the animal output always follows the sequence: chameleon, horse, snake, ... but the noun list is always a random order? That's because we're setting the (<b>cached</b>) seed before and after using the animal list. Click the edit button to see the code, and also check out the <a href="https://perchance.org/seeder-plugin" target="_blank">seeder-plugin</a> page for more info. This example was created to help answer <a href="https://www.reddit.com/r/perchance/comments/lxnuyf/importing_a_seeded_generator_with_the_seeder/" target="_blank">this forum question</a>.</p>
```

* **Example **
```
createInstance = {import:create-instance-plugin}
filterList = {import:filter-list-plugin}

characterBlueprint
  name = {import:common-first-name}
  age = {20-40}
  favColor = {blue|yellow|orange|red|green}
  
food
  blueberries
    color = blue
  bananas
    color = yellow
  carrots
    color = orange
  mandarin
    color = orange
  watermelon
    color = red
  apple
    color = green
  cucumber
    color = green
  
output
  [c = createInstance(characterBlueprint), c.name] likes [c.favColor] and so they like [filterList(food, item => item.color==c.favColor)].


// You can also do stuff like this:
//   [f = filterList(food, item => item.color==c.favColor).selectOne] [f.color]
// So you can filter the list, select an item from the filtered list, and then do stuff with it.

---
<h1>Filter a list based on an instance's properties (example)</h1>
<p>[output]</p>
<button onclick="update()">generate</button>

<p style="font-size:80%; margin: 2rem auto; max-width:400px;">Check out the <a href="https://perchance.org/filter-list-plugin" target="_blank">filter-list-plugin</a> to understand how this example works. Also see <a href="https://perchance.org/filter-a-list-of-generated-instances-example#edit" target="_blank">this example</a> where we create a list of instances with <a href="https://perchance.org/create-instances-plugin" target="_blank">create-instances-plugin</a> and then filter them.</p>
```

* **Example **
```
createInstances = {import:create-instances-plugin}
filterList = {import:filter-list-plugin}

character
  name = {Molly|Anita|Murphy}
  age = {18-90}
  
output
  [chars = createInstances(character, 10), ""] [filteredChars = filterList(chars, item => item.age < 30), ""] [chosenCharDescription]

chosenCharDescription
  There are no matches. ^[filteredChars.getLength == 0]
  [c = filteredChars.selectOne, ""] The chosen character is [c.name] and their age is [c.age] ... ^[filteredChars.getLength > 0]
---
<h1>Filter a list of generated instances based on instance properties (example)</h1>
<p>[output]</p>
<button onclick="update()">generate</button>

<p style="font-size:80%; margin: 2rem auto; max-width:400px;">In this example we generate a list of instances and then filter them based on a property. Check out the <a href="https://perchance.org/filter-list-plugin" target="_blank">filter-list-plugin</a> and the <a href="https://perchance.org/create-instances-plugin" target="_blank">create-instances-plugin</a> to understand how this example works.</p>
```

* **Example **
```
dice = {import:dice-plugin}

output
  [above3=0, dmg=0, rollDice(), rollDice(), rollDice(), ""] Number of rolls above three: [above3]<br>Total damage: [dmg]
  
rollDice() =>
  d = dice("1d6")
  if(d > 3) {
    above3++  // <-- this means "add one to the above3 variable"
    dmg += d-3  // <-- this means "add d-3 to the dmg variable"
  }
---
<h1>Damage Roll Function Example</h1>
<p>[output]</p>
<button onclick="update()">generate</button>
<p style="font-size:80%; margin:3rem auto; max-width:400px;">In this example we make a simple function called rollDice which rolls a 1d6 and counts rolls that are above 3. Rolls above 3 also contribute to the damage (4 = 1 damage, 5 = 2 damage, 6 = 3 damage). This example was created to help answer <a href="https://www.reddit.com/r/perchance/comments/m3a1j7/translate_from_inspiration_pad_pro_to_perchance/" target="_blank">this forum question</a>. There's a a more advanced version of this generator <a href="https://perchance.org/damage-roll-function-example-advanced#edit" target="_blank">here</a>.</p>
```

* **Example **
```
output
  [animal]
	
animal
	add animals then click the button
	
	
	
// You could have a default animal list instead of "add animals then click the button", e.g.

// animal
//   goat
//   pig
//   mouse

// That would make it so the default list is used unless they put
// some items in the text input box.

// Or, if you want to combine a "permanent" default list with their input list
// you could add a `defaultAnimals` list and change `output` to:

// output
//   [joinLists(animal, defaultAnimals)]

// See this example for details: https://perchance.org/user-input-list-append-example#edit
---
<h1>User Input List Example</h1>
<p style="margin:1em auto; padding:0 1em; max-width:700px;">[output]</p>
<button onclick="update()">randomize</button>
<br><br>

<!-- Change "animal" in this code to change the the name of the user-made list -->
<textarea oninput="animal=this.value.split('\n');"
					style="height:100px;"
					placeholder="add animals here..." ></textarea>

<p style="margin:1em auto; padding:0 1em; max-width:700px;">Notes: The user can use odds notation too. For example, they can write "^3" after an item to make it three times as likely. You can treat the user-created list just like a normal list - for example, you can use <code>animal.consumableList</code> or join it with another list using the <a target="_blank" href="https://perchance.org/join-lists-plugin">joinLists plugin</a>. <a href="https://perchance.org/user-input-list-append-example#edit">Here's an example</a> that uses joinList so that there's a default list of animals.</p>
```
