'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pressure', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deduct 1 extra PP from opposing Pokemon moves targetting the user', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: "Giratina", ability: 'pressure', moves: ['rest']}, {species: "Talonflame", ability: 'galewings', moves: ['peck']}],
			[{species: "Giratina", ability: 'defiant', moves: ['rest']}, {species: "Talonflame", ability: 'galewings', moves: ['peck']}],
		]);
		battle.makeChoices('move rest, move peck -1', 'move rest, move peck 1');
		const move = Dex.moves.get('peck');
		assert.equal(battle.p1.active[1].getMoveData(move).pp, 55);
		assert.equal(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP if moves are redirected to the user', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Giratina", ability: 'pressure', moves: ['followme']},
			{species: "Talonflame", ability: 'galewings', moves: ['peck']},
		], [
			{species: "Clefable", ability: 'unaware', moves: ['followme']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['peck']},
		]]);
		battle.makeChoices('move followme, move peck 2', 'move followme, move peck 2');
		const move = Dex.moves.get('peck');
		assert.equal(battle.p1.active[1].getMoveData(move).pp, 55);
		assert.equal(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP even if the move fails or misses', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Giratina", ability: 'pressure', item: 'laggingtail', moves: ['mistyterrain', 'shadowforce']}]});
		battle.setPlayer('p2', {team: [{species: "Smeargle", ability: 'desolateland', moves: ['doubleedge', 'spore', 'moonblast', 'surf']}]});
		battle.makeChoices('auto', 'auto');
		assert.equal(battle.p2.active[0].getMoveData(Dex.moves.get('doubleedge')).pp, 22);
		battle.makeChoices('move shadowforce', 'move spore');
		assert.equal(battle.p2.active[0].getMoveData(Dex.moves.get('spore')).pp, 22);
		battle.makeChoices('auto', 'move moonblast');
		assert.equal(battle.p2.active[0].getMoveData(Dex.moves.get('moonblast')).pp, 22);
		battle.makeChoices('auto', 'move surf');
		assert.equal(battle.p2.active[0].getMoveData(Dex.moves.get('surf')).pp, 22);
	});

	it('should deduct PP for each Pressure Pokemon targetted', function () {
		this.timeout(3000);
		battle = common.gen(5).createBattle({gameType: 'triples'});
		battle.setPlayer('p1', {team: [
			{species: "Giratina", ability: 'pressure', moves: ['rest']},
			{species: "Palkia", ability: 'pressure', moves: ['rest']},
			{species: "Dialga", ability: 'pressure', moves: ['rest']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Kyurem", ability: 'pressure', moves: ['hail']},
			{species: "Zekrom", ability: 'teravolt', moves: ['spikes']},
			{species: "Reshiram", ability: 'turboblaze', moves: ['rockslide']},
		]});
		battle.makeChoices('move rest, move rest, move rest', 'move hail, move spikes, move rockslide');
		assert.equal(battle.p2.active[0].getMoveData(Dex.moves.get('hail')).pp, 12);
		assert.equal(battle.p2.active[1].getMoveData(Dex.moves.get('spikes')).pp, 28);
		assert.equal(battle.p2.active[2].getMoveData(Dex.moves.get('rockslide')).pp, 13);
	});

	it('should deduct PP for each opposing Pressure Pokemon when Snatch of Imprison are used', function () {
		this.timeout(3000);
		battle = common.gen(5).createBattle({gameType: 'triples'});
		battle.setPlayer('p1', {team: [
			{species: "Giratina", ability: 'pressure', moves: ['rest']},
			{species: "Palkia", ability: 'pressure', moves: ['rest']},
			{species: "Dialga", ability: 'pressure', moves: ['rest']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Kyurem", ability: 'pressure', moves: ['snatch']},
			{species: "Zekrom", ability: 'teravolt', moves: ['imprison']},
			{species: "Reshiram", ability: 'turboblaze', moves: ['rest']},
		]});
		battle.makeChoices('move rest, move rest, move rest', 'move snatch, move imprison, move rest');
		assert.equal(battle.p2.active[0].getMoveData(Dex.moves.get('snatch')).pp, 12);
		assert.equal(battle.p2.active[1].getMoveData(Dex.moves.get('imprison')).pp, 12);
	});

	it(`should deduct additional PP from Max Moves`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['darkpulse']},
		], [
			{species: 'absol', ability: 'pressure', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move darkpulse dynamax', 'auto');
		assert.equal(battle.p1.active[0].getMoveData(Dex.moves.get('darkpulse')).pp, 22);
	});

	it(`should deduct additional PP from Z-Moves`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'wynaut', item: 'darkiniumz', moves: ['darkpulse']},
		], [
			{species: 'absol', ability: 'pressure', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move darkpulse zmove', 'auto');
		assert.equal(battle.p1.active[0].getMoveData(Dex.moves.get('darkpulse')).pp, 22);
	});

	it.skip(`should deduct additional PP from submoves that target Pressure`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['assist']},
			{species: 'yveltal', moves: ['darkpulse']},
		], [
			{species: 'absol', ability: 'pressure', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move assist', 'auto');
		assert.equal(battle.p1.active[0].getMoveData(Dex.moves.get('assist')).pp, 30);
	});

	it(`should not deduct additional PP from Sticky Web (only entry hazard to do so)`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['stickyweb', 'stealthrock']},
		], [
			{species: 'absol', ability: 'pressure', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move stickyweb', 'auto');
		battle.makeChoices('move stealthrock', 'auto');
		const wynaut = battle.p1.active[0];
		assert.equal(wynaut.getMoveData(Dex.moves.get('stickyweb')).pp, 31);
		assert.equal(wynaut.getMoveData(Dex.moves.get('stealthrock')).pp, 30);
	});
});

describe('Pressure [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deduct 1 extra PP from any moves targetting the user', function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'}, [
			[{species: "Giratina", ability: 'pressure', moves: ['rest']}, {species: "Aerodactyl", ability: 'quickfeet', moves: ['peck']}],
			[{species: "Giratina", ability: 'pressure', moves: ['rest']}, {species: "Aerodactyl", ability: 'quickfeet', moves: ['peck']}],
		]);
		battle.makeChoices('move rest, move peck -1', 'move rest, move peck 1');
		const move = Dex.moves.get('peck');
		assert.equal(battle.p1.active[1].getMoveData(move).pp, 54);
		assert.equal(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP if moves are redirected to the user', function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'}, [
			[{species: "Giratina", ability: 'pressure', moves: ['followme']}, {species: "Aerodactyl", ability: 'quickfeet', moves: ['peck']}],
			[{species: "Clefable", ability: 'magicguard', moves: ['followme']}, {species: "Ho-Oh", ability: 'pressure', moves: ['peck']}],
		]);
		battle.makeChoices('move followme, move peck 2', 'move followme, move peck 2');
		const move = Dex.moves.get('peck');
		assert.equal(battle.p1.active[1].getMoveData(move).pp, 55);
		assert.equal(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP even if the move fails or misses', function () {
		battle = common.gen(4).createBattle([
			[{species: "Giratina", ability: 'pressure', item: 'laggingtail', moves: ['shadowforce']}],
			[{species: "Smeargle", ability: 'owntempo', moves: ['doubleedge', 'dragonpulse']}],
		]);
		const attacker = battle.p2.active[0];
		battle.makeChoices('move shadowforce', 'move doubleedge');
		assert.equal(attacker.getMoveData(Dex.moves.get('doubleedge')).pp, 22);
		battle.makeChoices('move shadowforce', 'move dragonpulse');
		assert.equal(attacker.getMoveData(Dex.moves.get('dragonpulse')).pp, 14);
	});

	it('should deduct PP for each Pressure Pokemon targetted', function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'}, [
			[{species: "Palkia", ability: 'pressure', moves: ['rest']}, {species: "Dialga", ability: 'pressure', moves: ['rest']}],
			[{species: "Lugia", ability: 'pressure', moves: ['hail']}, {species: "Ho-Oh", ability: 'pressure', moves: ['earthquake']}],
		]);
		battle.makeChoices('move rest, move rest', 'move hail, move earthquake');
		assert.equal(battle.p2.active[0].getMoveData(Dex.moves.get('hail')).pp, 12);
		assert.equal(battle.p2.active[1].getMoveData(Dex.moves.get('earthquake')).pp, 12);
	});

	it('should not deduct PP from self-targeting moves', function () {
		battle = common.gen(4).createBattle([
			[{species: "Palkia", ability: 'pressure', moves: ['calmmind']}],
			[{species: "Dialga", ability: 'pressure', moves: ['calmmind']}],
		]);
		battle.makeChoices('move calmmind', 'move calmmind');
		const move = Dex.moves.get('calmmind');
		assert.equal(battle.p1.active[0].getMoveData(move).pp, 31);
		assert.equal(battle.p1.active[0].getMoveData(move).pp, 31);
	});
});
