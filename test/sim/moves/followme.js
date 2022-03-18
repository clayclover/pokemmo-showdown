'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Follow Me', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should redirect single-target moves towards it if it is a valid target', function () {
		this.timeout(5000);

		battle = common.gen(5).createBattle({gameType: 'triples'});
		battle.setPlayer('p1', {team: [
			{species: 'Clefable', ability: 'unaware', moves: ['followme']},
			{species: 'Clefairy', ability: 'unaware', moves: ['calmmind']},
			{species: 'Cleffa', ability: 'unaware', moves: ['calmmind']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Abra', ability: 'synchronize', moves: ['lowkick']},
			{species: 'Kadabra', ability: 'synchronize', moves: ['lowkick']},
			{species: 'Alakazam', ability: 'synchronize', moves: ['lowkick']},
		]});
		let hitCount = 0;
		battle.onEvent('Damage', battle.format, function (damage, pokemon) {
			if (pokemon.species.id === 'clefable') {
				hitCount++;
			}
		});
		battle.makeChoices('move followme, move calmmind, move calmmind', 'move lowkick 2, move lowkick 2, move lowkick 2');
		assert.equal(hitCount, 2);
	});

	it('should not redirect self-targetting moves', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Clefable', ability: 'unaware', moves: ['followme']},
			{species: 'Clefairy', ability: 'unaware', moves: ['softboiled']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Alakazam', ability: 'synchronize', moves: ['honeclaws']},
			{species: 'Kadabra', ability: 'synchronize', moves: ['honeclaws']},
		]});
		battle.makeChoices('move followme, move softboiled', 'move honeclaws, move honeclaws');
		assert.equal(battle.p1.active[0].boosts['atk'], 0);
		assert.equal(battle.p2.active[0].boosts['atk'], 1);
		assert.equal(battle.p2.active[1].boosts['atk'], 1);
	});

	it(`should allow redirection even if the user is the last slot of a double battle`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Wynaut", moves: ['sleeptalk', 'tackle']},
			{species: "Wynaut", moves: ['sleeptalk', 'tackle']},
		], [
			{species: "Accelgor", moves: ['finalgambit']},
			{species: "Blissey", moves: ['sleeptalk', 'followme']},
		]]);

		battle.makeChoices('auto', 'move final gambit -2, move sleeptalk');
		battle.makeChoices('move tackle -2, move tackle -1', 'move followme');

		// Follow Me should have redirected both attacks, so the Wynaut should be at full HP
		assert.fullHP(battle.p1.active[0]);
		assert.fullHP(battle.p1.active[1]);
	});

	it(`should redirect single-target moves towards it if it is a valid target in FFA`, function () {
		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: "Wynaut", moves: ['tackle']},
		], [
			{species: "Wynaut", moves: ['tackle']},
		], [
			{species: "Accelgor", moves: ['finalgambit']},
			{species: "Mimikyu", moves: ['substitute']},
		], [
			{species: "Blissey", moves: ['followme']},
		]]);
		battle.makeChoices('move tackle 1', 'move tackle 1', 'move final gambit 2', 'move followme');

		// Follow Me should have redirected both attacks, so the Wynaut should be at full HP
		assert.fullHP(battle.p1.active[0]);
		assert.fullHP(battle.p2.active[0]);
	});
});
