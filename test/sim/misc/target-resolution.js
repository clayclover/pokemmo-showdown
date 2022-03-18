'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Target Resolution', function () {
	afterEach(function () {
		battle.destroy();
	});

	describe(`Targetted Pokémon fainted in-turn`, function () {
		it(`should redirect 'any' from a fainted foe to a targettable foe`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Wailord', item: 'laggingtail', ability: 'pressure', moves: ['watergun']},
				{species: 'Metapod', ability: 'shedskin', moves: ['harden']},
			], [
				{species: 'Chansey', ability: 'naturalcure', moves: ['curse']},
				{species: 'Latias', ability: 'levitate', moves: ['healingwish']},
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
			]]);
			const defender = battle.p2.active[0];
			assert.hurts(defender, () => battle.makeChoices('move watergun 2, auto', 'auto'));
		});

		it(`should not redirect 'any' from a fainted ally to another Pokémon by default`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Wailord', item: 'laggingtail', ability: 'pressure', moves: ['watergun']},
				{species: 'Latias', ability: 'levitate', moves: ['healingwish']},
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
			], [
				{species: 'Chansey', ability: 'naturalcure', moves: ['curse']},
				{species: 'Metapod', ability: 'shedskin', moves: ['harden']},
			]]);
			const activePokemonList = [battle.p1.active[0], ...battle.p2.active];
			const prevHps = activePokemonList.map(pokemon => pokemon.hp);
			battle.makeChoices('move watergun -2, auto', 'auto');
			const newHps = activePokemonList.map(pokemon => pokemon.hp);

			assert.deepEqual(prevHps, newHps);
			assert(battle.log.includes('|move|p1a: Wailord|Water Gun|p1: Latias|[notarget]'));
			assert(battle.log.includes('|-fail|p1a: Wailord'));
		});

		it(`should support RedirectTarget event for a fainted foe and type 'any' `, function () {
			battle = common.gen(5).createBattle({gameType: 'triples'}, [[
				{species: 'Wailord', item: 'laggingtail', ability: 'pressure', moves: ['waterpulse']}, // Water Pulse over Water Gun due to targeting in triples
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
			], [
				{species: 'Gastrodon', ability: 'stormdrain', moves: ['curse']},
				{species: 'Latias', ability: 'levitate', moves: ['healingwish']},
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
			]]);
			let redirector = battle.p2.active[0];
			battle.makeChoices('move waterpulse 2, auto', 'auto');
			assert.statStage(redirector, 'spa', 1);

			// Do it again with swapped positions
			battle.destroy();
			battle = common.gen(5).createBattle({gameType: 'triples'}, [[
				{species: 'Wailord', item: 'laggingtail', ability: 'pressure', moves: ['watergun']},
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
			], [
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
				{species: 'Latias', ability: 'levitate', moves: ['healingwish']},
				{species: 'Gastrodon', ability: 'stormdrain', moves: ['curse']},
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
			]]);
			redirector = battle.p2.active[2];
			battle.makeChoices('move watergun 2, auto', 'auto');
			assert.statStage(redirector, 'spa', 1);
		});

		it(`should support RedirectTarget event for a fainted ally and type 'any'`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Wailord', item: 'laggingtail', ability: 'pressure', moves: ['watergun']},
				{species: 'Latias', ability: 'levitate', moves: ['healingwish']},
				{species: 'Magikarp', ability: 'rattled', moves: ['splash']},
			], [
				{species: 'Gastrodon', ability: 'stormdrain', moves: ['curse']},
				{species: 'Metapod', ability: 'shedskin', moves: ['harden']},
			]]);
			const redirector = battle.p2.active[0];
			battle.makeChoices('move watergun -2, auto', 'auto');
			assert.statStage(redirector, 'spa', 1);
		});

		it(`should not redirect to another random target if the intended one is fainted in FFA`, function () {
			battle = common.createBattle({gameType: 'freeforall'}, [[
				{species: 'Calyrex', moves: ['sleeptalk']},
			], [
				{species: 'Victini', ability: 'Victory Star', moves: ['vcreate']},
			], [
				{species: 'Chansey', moves: ['sleeptalk']},
			], [
				{species: 'Tyrunt', moves: ['crunch']},
			]]);
			battle.makeChoices('auto', 'move vcreate 1', 'auto', 'move crunch 1');
			assert.fainted(battle.sides[0].active[0]);
			assert.fullHP(battle.sides[1].active[0]);
			assert.fullHP(battle.sides[2].active[0]);
		});
	});

	describe(`Targetted slot is empty`, function () {
		it(`should redirect 'any' from a fainted foe to a targettable foe`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Wailord', ability: 'pressure', moves: ['watergun']},
				{species: 'Shedinja', item: 'flameorb', ability: 'wonderguard', moves: ['agility']},
			], [
				{species: 'Wailord', ability: 'pressure', moves: ['watergun']},
				{species: 'Shedinja', item: 'flameorb', ability: 'wonderguard', moves: ['agility']},
			]]);
			const attackers = battle.sides.map(side => side.active[0]);

			battle.makeChoices('auto', 'auto'); // Shedinjas burned
			battle.makeChoices('auto', 'auto'); // Shedinjas faint

			const prevHps = attackers.map(pokemon => pokemon.hp);
			battle.makeChoices('move watergun 2, pass', 'move watergun 2, pass');
			const newHps = attackers.map(pokemon => pokemon.hp);

			assert(
				newHps[0] < prevHps[0] && newHps[1] < prevHps[1],
				`It should redirect the attacks from their original fainted targets to valid targets`
			);
		});

		it(`should not redirect 'any' from a fainted ally to another Pokémon by default`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Wailord', ability: 'pressure', moves: ['watergun']},
				{species: 'Shedinja', item: 'flameorb', ability: 'wonderguard', moves: ['agility']},
			], [
				{species: 'Wailord', ability: 'pressure', moves: ['watergun']},
				{species: 'Shedinja', item: 'flameorb', ability: 'wonderguard', moves: ['agility']},
			]]);

			const attackers = battle.sides.map(side => side.active[0]);
			const faintTargets = battle.sides.map(side => side.active[1]);

			battle.makeChoices('auto', 'auto'); // Shedinjas burned
			battle.makeChoices('auto', 'auto'); // Shedinjas faint
			assert.fainted(faintTargets[0]);
			assert.fainted(faintTargets[1]);

			const prevHps = attackers.map(pokemon => pokemon.hp);
			battle.makeChoices('move watergun -2, pass', 'move watergun -2, pass');
			const newHps = attackers.map(pokemon => pokemon.hp);

			assert.deepEqual(prevHps, newHps);
			assert(battle.log.includes('|move|p1a: Wailord|Water Gun|p1: Shedinja|[notarget]'));
			assert(battle.log.includes('|-fail|p1a: Wailord'));
			assert(battle.log.includes('|move|p2a: Wailord|Water Gun|p2: Shedinja|[notarget]'));
			assert(battle.log.includes('|-fail|p2a: Wailord'));
		});

		it(`should support RedirectTarget event for a fainted foe and type 'any'`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Aurorus', ability: 'snowwarning', moves: ['watergun']},
				{species: 'Shedinja', ability: 'wonderguard', moves: ['agility']},
			], [
				{species: 'Gastrodon', ability: 'stormdrain', moves: ['curse']},
				{species: 'Shedinja', ability: 'wonderguard', moves: ['agility']},
			]]);
			const redirector = battle.p2.active[0];

			battle.makeChoices('auto', 'auto'); // Shedinjas faint
			battle.makeChoices('move watergun 2, pass', 'auto');
			assert.statStage(redirector, 'spa', 2);
		});

		it(`should support RedirectTarget event for a fainted ally and type 'any'`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Aurorus', ability: 'snowwarning', moves: ['watergun']},
				{species: 'Shedinja', ability: 'wonderguard', moves: ['agility']},
			], [
				{species: 'Gastrodon', ability: 'stormdrain', moves: ['curse']},
				{species: 'Shedinja', ability: 'wonderguard', moves: ['agility']},
			]]);
			const redirector = battle.p2.active[0];

			battle.makeChoices('auto', 'auto'); // Shedinjas faint
			battle.makeChoices('move watergun -2, pass', 'auto');
			assert.statStage(redirector, 'spa', 2);
		});

		it(`should smart-track targets for Stalwart`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Duraludon', ability: 'stalwart', moves: ['watergun']},
				{species: 'Ninjask', ability: 'runaway', moves: ['splash']},
			], [
				{species: 'Gastrodon', ability: 'runaway', moves: ['splash']},
				{species: 'Ninjask', ability: 'runaway', moves: ['allyswitch']},
			]]);

			battle.makeChoices('move watergun 1, move splash', 'auto');
			assert.notEqual(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
		});

		it(`should smart-track targets for Snipe Shot`, function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Duraludon', ability: 'runaway', moves: ['snipeshot']},
				{species: 'Ninjask', ability: 'runaway', moves: ['splash']},
			], [
				{species: 'Gastrodon', ability: 'runaway', moves: ['splash']},
				{species: 'Ninjask', ability: 'runaway', moves: ['allyswitch']},
			]]);

			battle.makeChoices('move snipeshot 1, move splash', 'auto');
			assert.notEqual(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
		});
	});

	it('should not force charge moves called by another move to target an ally after Ally Switch', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'purrloin', ability: 'prankster', moves: ['copycat', 'sleeptalk']},
			{species: 'wynaut', moves: ['allyswitch', 'solarbeam']},
		], [
			{species: 'swablu', moves: ['sleeptalk']},
			{species: 'swablu', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move sleeptalk, move solarbeam 1', 'auto');
		battle.makeChoices();
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
	});

	it(`Ally Switch should cause single-target moves to fail if targeting an ally`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'purrloin', moves: ['thunder', 'ironhead']},
			{species: 'wynaut', moves: ['allyswitch']},
		], [
			{species: 'swablu', moves: ['sleeptalk']},
			{species: 'swablu', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move ironhead -2, move allyswitch', 'auto');
		battle.makeChoices('move allyswitch, move thunder -1', 'auto');
		assert.fullHP(battle.p1.active[0]);
	});

	it.skip(`charge moves like Phantom Force should target slots turn 1 and Pokemon turn 2`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'houndour', level: 1, moves: ['sleeptalk']},
			{species: 'altaria', moves: ['sleeptalk']},
			{species: 'aggron', moves: ['sleeptalk']},
		], [
			{species: 'dragapult', moves: ['phantomforce']},
			{species: 'regieleki', moves: ['sleeptalk', 'sheercold']},
		]]);

		// Phantom Force should still target slot 1, despite Houndour fainting
		battle.makeChoices('auto', 'move phantomforce 1, move sheercold 1');
		battle.makeChoices('switch 3');
		battle.makeChoices();
		assert.fullHP(battle.p1.active[1], 'Altaria should be at full HP, because it was not targeted.');

		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'houndour', level: 1, moves: ['sleeptalk']},
			{species: 'altaria', moves: ['sleeptalk']},
			{species: 'aggron', moves: ['sleeptalk']},
		], [
			{species: 'dragapult', moves: ['phantomforce']},
			{species: 'regieleki', moves: ['sleeptalk', 'sheercold']},
		]]);

		battle.makeChoices('auto', 'move phantomforce 1, move sleeptalk');
		battle.makeChoices('auto', 'move phantomforce 1, move sheercold 1');
		assert.false.fullHP(battle.p1.active[1], 'Altaria should not be at full HP, because Phantom Force was redirected and targeted it.');
	});
});
