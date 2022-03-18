Custom Rules
============

Pokémon Showdown supports custom rules in three ways:

- Challenging another user, using the command `/challenge USERNAME, FORMAT @@@ RULES`

- Tournaments, using the command `/tour rules RULES` (see the [Tournament command help][tour-help])

- Custom formats on your side server, by editing `config/formats.js`

  [tour-help]: https://www.smogon.com/forums/threads/pok%C3%A9mon-showdown-forum-rules-resources-read-here-first.3570628/#post-6777489


Bans
----

Bans are just a `-` followed by the thing you want to ban.

### Individual bans

`- Arceus` - ban a Pokémon (including all formes)

`- Arceus-Flying` or `- Giratina-Altered` - ban a specific Pokémon forme

`- Giratina-Base` - ban only the base forme of a Pokémon (this always works, in case you forget it's called `- Giratina-Altered`)

`- Baton Pass` - ban a move

`- move: Metronome` - ban a move with an ambiguous name

`- Bright Powder` - ban an item

`- item: Metronome` - ban an item with an ambiguous name

### Group bans

`- OU` or `- DUU` - ban a tier

`- CAP` or `- Mega` - ban a pokemon category

`- LGPE` - ban things only available Let's Ge Pikachu/Eevee

`- Past` - ban things that only appear in a past generation (such as Berserk Gene in Gen 5, spiky-eared Pichu in Gen 5, or Unown in Gen 8)

`- Future` - ban things that only appears in a future generation (such as Arceus in Gen 1)

`- Custom` - ban made-up things other than CAP (such as Magikarp's Revenge, or Staff Bros moves)

`- Nonexistent` - catch-all to ban all nonexistent Pokémon, items, etc. Includes: `- CAP, - Past, - Future, - LGPE`

`- Unobtainable` - ban all things designed never to be released (Pokestars in Gen 5, Eternatus-E, Floette-E)

`- Unreleased` - ban all things that will probably be released eventually (Venusaur in Gen 8)

`- all items` - ban all items

`- all abilities, + No Ability` - ban all abilities (No Ability needs to be specifically allowed to allow Pokemon with no abilities)

### Complex bans

`- Blaziken + Speed Boost` - ban a combination of things in a single Pokemon (you can have a Blaziken, and you can have Speed Boost on the same team, but the Blaziken can't have Speed Boost)

`- Drizzle ++ Swift Swim` - ban a combination of things in a team (if any Pokémon on your team have Drizzle, no Pokémon can have Swift Swim)


Unbans
------

Unbans are just a `+` followed by the thing you want to unban.

Syntax is identical to bans, just replace `-` with `+`, like:

`+ Blaziken` - unban a Pokémon

`+ Past` - unban all past-generation-only things

More specific always trumps less specific:

`- all Pokemon, + Uber, - Giratina, + Giratina-Altered` - allow only Ubers other than Giratina-Origin

`- Nonexistent, + Necturna` - don't allow anything from outside the game, except the CAP Necturna

For equally specific rules, the last rule wins:

`- Pikachu, - Pikachu, + Pikachu` - allow Pikachu

`+ Pikachu, - Pikachu, + Pikachu, - Pikachu` - ban Pikachu


Restrictions
------------

What restrictions achieve depends on the rule or metagame being played. Examples include:

- Cross Evolution: Restricting a species prevents it from being the target of a cross evolution. (Ban a species to prevent it from being the base of a cross evolution.)
- Mix and Mega: Restricting a species prevents that Pokémon from holding a mega stone. (Ban a stone to prevent all Pokémon from holding it.)
- Inheritance: Restricting a species prevents it from being inherited from. (Ban a species to prevent it from inheriting from another species.)
- Trademarked: Restricting a move prevents it from being used as a trademark, but the move can still appear in a moveset.

Restriction rules are used to adjust the behaviour of the above metagames. The syntax is identical to bans, just replace `-` with `*`, like:

`* Blaziken` - restrict a Pokémon

`* Uber` - restrict a group of Pokémon

`* Baton Pass` - restrict a move

An unban will remove a restriction.


Whitelisting
------------

Instead of a banlist, you can have a list of allowed things:

`- all Pokemon, + Charmander, + Squirtle, + Bulbasaur` - allow only Kanto starters

`- all moves, + move: Metronome` - allow only the move Metronome

`- all abilities, + No Ability` - ban all abilities

`- all items, + item: Metronome` - allow only the item Metronome


Legality rules
--------------

Custom rules can have more complicated behavior. They can also include other rules.

### Obtainability rules

`Obtainable` - allow only things you can actually get in the game without glitches or hacks. Includes: `Obtainable Moves, Obtainable Abilities, Obtainable Formes, Obtainable Misc, -Unreleased, -Unobtainable, -Nonexistent`.

`Obtainable Moves` - allow only moves a pokemon can legitimately learn

`Obtainable Abilities` - allow only abilities a pokemon can naturally get (by itself, does not check unreleased abilities! use `-Unreleased` for that)

`Obtainable Formes` - don't allow starting the battle with formes that normally require an in-battle transformation (like megas) (does not check unreleased/nonexistent formes; use `-Nonexistent` etc)

`Obtainable Misc` - allow only legal EVs, IVs, levels, genders, and Hidden Power types

### Pokedex rules

`Hoenn Pokedex` - allow only Pokémon in the Hoenn Pokédex

`Sinnoh Pokedex` - allow only Pokémon in the Sinnoh Pokédex

`Kalos Pokedex` - allow only Pokémon in the Kalos Pokédex

`Alola Pokedex` - allow only Pokémon in the Alola Pokédex

(There is no `Galar Pokedex` rule, `-Nonexistent` covers it in Gen 8.)

### Clauses

`Species Clause` - limit one Pokémon per dex number

`Nickname Clause` - limit one Pokémon per nickname

`Item Clause` - no two Pokémon can have the same item

`2 Ability Clause` - limit two Pokémon with the same ability

`OHKO Clause` - ban one-hit KO moves (Fissure, Sheer Cold, etc)

`Evasion Moves Clause` - ban moves that directly boost evasion (Double Team, Minimize)

`Evasion Abilities Clause` - ban abilities that boost evasion (Sand Veil, Snow Cloak)

`Moody Clause` - ban the ability Moody

`Swagger Clause` - ban the move Swagger

`CFZ Clause` - ban the use of crystal-free Z-Moves (having moves like Devastating Drake hacked directly on the moveset in formats like Hackmons, instead of using Dragon Claw + Dragonium Z)

`Z-Move Clause` - ban Pokémon from holding Z-Crystals

`3 Baton Pass Clause` - prevent more than three Pokémon from having Baton Pass on a team

`Baton Pass Clause` - prevent more than one Pokémon from having Baton Pass, and prevent Pokémon from being capable of passing boosts in Speed and another stat at the same time.

`Accuracy Moves Clause` - ban moves that have a chance to lower the target's accuracy when used

`Same Type Clause` - force all Pokémon on a team to share a type with one another

`NFE Clause` - ban all Pokémon that are not fully evolved (Pokémon can be re-added manually by simply unbanning them)

`Forme Clause` - limit one of each forme of a Pokémon on a team (a team can have Zamazenta + Zamazenta-Crowned, but not Zamazenta + Zamazenta)

### Miscellaneous

`Allow AVs` - allow Pokémon to have their stats boosted by Awakening Values in Let's Go formats

`Allow Tradeback` - allow Pokémon in Gen 1 to have moves from their Gen 2 learnsets

`STABmons Move Legality` - allow Pokémon to have almost any move that matches their typing

`Little Cup` - allow only Pokémon that can evolve and aren't evolved

`Not Fully Evolved` - allow only Pokémon that aren't fully evolved

`Mimic Glitch` - allow Pokémon with access to Assist, Copycat, Metronome, Mimic, or Transform to gain access to almost any other move

In-battle rules
---------------

`Team Preview` - use Team Preview

`Blitz` - use the Blitz timer (30 second Team Preview, 10 seconds per turn)

`VGC Timer` - use the VGC timer (90 second Team Preview, 7 minutes Your Time, 1 minute per turn)

`Mega Rayquaza Clause` - prevent Rayquaza from Mega Evolving

`Sleep Clause Mod` - prevent Pokémon from falling asleep if they have sleeping allies

`Freeze Clause Mod` - prevent Pokémon from getting frozen if they have frozen allies

`Cancel Mod` - show the Cancel button and allow players to cancel their moves

`Inverse Mod` - inverse type effectiveness (like in Gen 6 Inverse Battles)

`Scalemons Mod` - Pokemon will have their base stats, barring HP, adjusted to make their BST as close to 600 as possible (in Gen 1, BSTs will be scaled to 500)

`Gen 8 Camomons` - Pokémon will change their typing to match their first two moveslots

`Gen 7 Tier Shift` - Pokémon will have higher base stats the lower their Gen 7 Smogon tier is

`Dynamax Clause` - prevent Pokémon from Dynamaxing during battle. Cannot be used to allow Dynamaxing in old gens

`Endless Battle Clause` - prevent battles from proceeding endlessly

`HP Percentage Mod` - Show the opposing Pokémon's HP rounded to the nearest percent, as opposed to a range of percentages based upon the health bar's size in-game

`Exact HP Mod` - Show all Pokémon's exact HP and max HP in the battle log

`Switch Priority Clause Mod` - make the fastest Pokémon switch first when more than one Pokémon switches out at once, unlike in Emerald link battles, where Player 1's Pokémon would switch first.


Standard Rulesets
-----------------

Note: Most formats already come with one standard ruleset. Removing and adding multiple standard rulesets in the same tournament is likely to have unintended results.

`Standard` - the standard ruleset for most Smogon singles formats. Includes the Evasion Moves Clause, Sleep Clause Mod, Species Clause, Nickname Clause, OHKO Clause, Endless Battle Clause, HP Percentage Mod, and Cancel Mod.

`Standard NEXT` - the standard ruleset for NEXT. Allows some unreleased Pokémon and includes the Evasion Moves Clause, Nickname Clause, Sleep Clause Mod, Species Clause, OHKO Clause, HP Percentage Mod, and Cancel Mod. Bans Soul Dew.

`Standard GBU` - the standard ruleset for in-game formats, such as Battle Spot. Includes Species Clause, Item Clause, Nickname Clause, Team Preview, and Cancel Mod. Bans mythical Pokémon and restricted legendaries (e.g. Zekrom, Reshiram, Zygarde, Eternatus)

`Minimal GBU` - the standard ruleset for in-game formats but without restricted legendary bans. Still bans mythical Pokémon.

`Standard NatDex` - the standard ruleset for National Dex formats. Allows the National Dex. Includes Nickname Clause, HP Percentage Mod, Cancel Mod, Endless Battle Clause.

`Standard Doubles` - the standard ruleset for most Smogon doubles formats. Includes Species Clause, Nickname Clause, OHKO Clause, Evasion Abilities Clause, Evasion Moves Clause, Endless Battle Clause, HP Percentage Mod, Cancel Mod.


Removing rules
--------------

Put `!` in front of a rule to remove it, like:

`!Team Preview` - do not use Team Preview

You can use this to remove individual parts of rules, like:

`Obtainable, !Obtainable Moves` - require pokemon to be obtained legitimately, except for moves, which they can use whatever


Multiple rules
--------------

In case you haven't figured it out from the rest of this page, you combine rules with a `,` (comma).


Tiers and Formats
-----------------

Any format (starting with `Gen [number]`) can be used as a rule, to add all rules from that format.

For example:

`Gen 8 OU` - add all clauses and bans from Gen 8 OU.

`Gen 8 Almost Any Ability` - add all clauses and bans from Gen 8 Almost Any Ability, allowing Pokémon to use almost any ability in the game.

People often use "tier" to mean "format", but in rulesets, the difference is important. A format is a list of rules for a game you can play, such as "Gen 8 OU". A tier is a list of Pokémon which can be banned or unbanned, such as "OU".

`- OU, + Ubers` - ban all Pokémon currently in OU and unban all Pokémon currently in Ubers
