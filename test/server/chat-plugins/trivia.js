'use strict';

const assert = require('assert').strict;

const {makeUser} = require('../../users-utils');
const trivia = require('../../../.server-dist/chat-plugins/trivia');
const Trivia = trivia.Trivia;
const FirstModeTrivia = trivia.FirstModeTrivia;
const TimerModeTrivia = trivia.TimerModeTrivia;
const NumberModeTrivia = trivia.NumberModeTrivia;

function makeTriviaUser(name, ip) {
	const user = makeUser(name, ip);
	assert.equal(Users.users.get(user.id), user);
	user.joinRoom('trivia');
	return user;
}

function destroyUser(user) {
	if (!user || !user.connected) return false;
	user.resetName();
	user.disconnectAll();
	user.destroy();
}

describe('Trivia', function () {
	before(function () {
		Rooms.global.addChatRoom('Trivia');
		this.room = Rooms.get('trivia');
	});

	beforeEach(function () {
		const questions = [{question: '', answers: ['answer'], category: 'ae'}];
		this.user = makeTriviaUser('Morfent', '127.0.0.1');
		this.tarUser = makeTriviaUser('ReallyNotMorfent', '127.0.0.2');
		this.game = this.room.game = new Trivia(this.room, 'first', 'ae', true, 'short', questions);
	});

	afterEach(function () {
		destroyUser(this.user);
		destroyUser(this.tarUser);
		if (this.room.game) {
			clearTimeout(this.room.game.phaseTimeout);
			this.room.game.phaseTimeout = null;
			this.room.game.destroy();
		}
	});

	after(function () {
		this.user = null;
		this.tarUser = null;
		this.room.destroy();
		this.room = null;
	});

	it('should add new players', function () {
		this.game.addTriviaPlayer(this.user);
		assert.equal(this.game.playerCount, 1);
	});

	it('should not add a player if they have already joined', function () {
		this.game.addTriviaPlayer(this.user);
		assert.throws(() => this.game.addTriviaPlayer(this.user));
		assert.equal(this.game.playerCount, 1);
	});

	it('should not add a player if another one on the same IP has joined', function () {
		this.game.addTriviaPlayer(this.user);

		const user2 = makeTriviaUser('Not Morfent', '127.0.0.1');
		assert.throws(() => this.game.addTriviaPlayer(user2));

		assert.equal(this.game.playerCount, 1);
		destroyUser(user2);
	});

	it('should not add a player if another player had their username previously', function () {
		const userid = this.user.id;
		const name = this.user.name;
		this.game.addTriviaPlayer(this.user);
		this.user.forceRename('Not Morfent', true);
		this.user.previousIDs.push(userid);

		const user2 = makeTriviaUser(name, '127.0.0.3');
		assert.throws(() => this.game.addTriviaPlayer(user2));

		assert.equal(this.game.playerCount, 1);
		destroyUser(user2);
	});

	it('should not add a player if they were kicked from the game', function () {
		this.game.kickedUsers.add(this.tarUser.id);
		assert.throws(() => this.game.addTriviaPlayer(this.tarUser));
		assert.equal(this.game.playerCount, 0);
	});

	it('should kick players from the game', function () {
		this.game.addTriviaPlayer(this.tarUser);
		this.game.kick(this.tarUser, this.user);
		assert.equal(this.game.playerCount, 0);
	});

	it('should not kick players already kicked from the game', function () {
		this.game.addTriviaPlayer(this.tarUser);
		this.game.kick(this.tarUser, this.user);
		assert.throws(() => this.game.kick(this.tarUser, this.user));
	});

	it('should not kick users who were kicked under another name', function () {
		this.game.addTriviaPlayer(this.tarUser);
		this.game.kick(this.tarUser, this.user);

		const userid = this.tarUser.id;
		this.tarUser.forceRename('Not Morfent', true);
		this.tarUser.previousIDs.push(userid);
		assert.throws(() => this.game.addTriviaPlayer(this.tarUser));
		assert.equal(this.game.playerCount, 0);
	});

	it('should not add users who were kicked under another IP', function () {
		this.game.addTriviaPlayer(this.tarUser);
		this.game.kick(this.tarUser, this.user);

		const name = this.tarUser.name;
		this.tarUser.resetName();

		const user2 = makeTriviaUser(name, '127.0.0.2');
		assert.throws(() => this.game.addTriviaPlayer(user2));
		assert.equal(this.game.playerCount, 0);
		destroyUser(user2);
	});

	it('should not kick users that aren\'t players in the game', function () {
		assert.throws(() => this.game.kick(this.tarUser, this.user));
		assert.equal(this.game.playerCount, 0);
	});

	it('should make players leave the game', function () {
		this.game.addTriviaPlayer(this.user);
		assert.equal(typeof this.game.playerTable[this.user.id], 'object');
		this.game.leave(this.user);
		assert.equal(typeof this.game.playerTable[this.user.id], 'undefined');
	});

	it('should not make users who are not players leave the game', function () {
		assert.equal(typeof this.game.playerTable[this.user.id], 'undefined');
		assert.throws(() => this.game.leave(this.user));
	});

	it('should verify answers correctly', function () {
		this.game.askQuestion();
		assert.equal(this.game.verifyAnswer('answer'), true);
		assert.equal(this.game.verifyAnswer('anser'), true);
		assert.equal(this.game.verifyAnswer('not the right answer'), false);
	});

	context('marking player absence', function () {
		beforeEach(function () {
			const questions = [null, null].fill({question: '', answers: ['answer'], category: 'ae'});
			const game = new FirstModeTrivia(this.room, 'first', 'ae', true, 'short', questions);

			this.user = makeTriviaUser('Morfent', '127.0.0.1');
			this.user2 = makeTriviaUser('user2', '127.0.0.2');
			this.user3 = makeTriviaUser('user3', '127.0.0.3');

			this.user.joinRoom(this.room);
			game.addTriviaPlayer(this.user);
			this.user2.joinRoom(this.room);
			game.addTriviaPlayer(this.user2);
			this.user3.joinRoom(this.room);
			game.addTriviaPlayer(this.user3);
			game.start();
			game.askQuestion();
			clearTimeout(game.phaseTimeout);
			game.phaseTimeout = null;

			this.game = this.room.game = game;
			this.player = this.room.game.playerTable[this.user.id];
		});

		afterEach(function () {
			destroyUser(this.user);
			destroyUser(this.user2);
			destroyUser(this.user3);
			if (this.room.game) {
				clearTimeout(this.game.phaseTimeout);
				this.game.phaseTimeout = null;
				this.game.destroy();
			}
		});

		it('should mark a player absent on leave and pause the game', function () {
			this.user.leaveRoom(this.room);
			assert.equal(this.player.isAbsent, true);
			assert.equal(this.game.phase, 'limbo');
			assert.equal(this.game.phaseTimeout, null);
		});

		it('should unpause the game once enough players have returned', function () {
			this.user.leaveRoom(this.room);
			this.user.joinRoom(this.room);
			assert.equal(this.player.isAbsent, false);
			assert.equal(this.game.phase, 'question');
			assert(this.game.phaseTimeout);
		});
	});

	context('first mode', function () {
		beforeEach(function () {
			const questions = [{question: '', answers: ['answer'], category: 'ae'}];
			const game = new FirstModeTrivia(this.room, 'first', 'ae', true, 'short', questions);

			this.user = makeTriviaUser('Morfent', '127.0.0.1');
			this.user2 = makeTriviaUser('user2', '127.0.0.2');
			this.user3 = makeTriviaUser('user3', '127.0.0.3');

			game.addTriviaPlayer(this.user);
			game.addTriviaPlayer(this.user2);
			game.addTriviaPlayer(this.user3);
			game.start();
			game.askQuestion();

			this.game = this.room.game = game;
			this.player = game.playerTable[this.user.id];
		});

		afterEach(function () {
			destroyUser(this.user);
			destroyUser(this.user2);
			destroyUser(this.user3);
			if (this.room.game) {
				clearTimeout(this.game.phaseTimeout);
				this.game.phaseTimeout = null;
				this.game.destroy();
			}
		});

		it('should calculate player points correctly', function () {
			const points = this.game.calculatePoints();
			assert.equal(points, 5);
		});

		it('should allow users to answer questions correctly', function () {
			this.game.answerQuestion('answer', this.user);
			assert.equal(this.player.correctAnswers, 1);
		});

		it('should mark players who answer incorrectly', function () {
			this.game.answerQuestion('not the right answer', this.user);
			assert.equal(this.player.correctAnswers, 0);
		});

		it('should only reward a player points once per question', function () {
			this.game.answerQuestion('answer', this.user);
			assert.throws(() => this.game.answerQuestion('answer', this.user));
			assert.equal(this.player.correctAnswers, 1);
		});

		it('should clear player answers if none answer correctly', function () {
			this.game.answerQuestion('not the right answer', this.user);
			this.game.tallyAnswers();
			assert.equal(this.player.answer, '');
		});

		it('should not give NaN points to correct responders', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.tallyAnswers();
			assert(!isNaN(this.player.points));
		});
	});

	context('timer mode', function () {
		beforeEach(function () {
			const questions = [{question: '', answers: ['answer'], category: 'ae'}];
			const game = new TimerModeTrivia(this.room, 'first', 'ae', true, 'short', questions);

			this.user = makeTriviaUser('Morfent', '127.0.0.1');
			this.user2 = makeTriviaUser('user2', '127.0.0.2');
			this.user3 = makeTriviaUser('user3', '127.0.0.3');

			game.addTriviaPlayer(this.user);
			game.addTriviaPlayer(this.user2);
			game.addTriviaPlayer(this.user3);
			game.start();
			game.askQuestion();

			this.game = this.room.game = game;
			this.player = game.playerTable[this.user.id];
		});

		afterEach(function () {
			destroyUser(this.user);
			destroyUser(this.user2);
			destroyUser(this.user3);
			if (this.room.game) {
				clearTimeout(this.game.phaseTimeout);
				this.game.phaseTimeout = null;
				this.game.destroy();
			}
		});

		it('should calculate points correctly', function () {
			const totalDiff = 1e9;
			let diff = -1;
			for (let i = 6; i--;) {
				diff += totalDiff / 5;
				const points = this.game.calculatePoints(diff, totalDiff);
				assert.equal(points, i);
			}
		});

		it('should set players as having answered correctly or incorrectly', function () {
			this.game.answerQuestion('not the right answer', this.user);
			assert.equal(this.player.isCorrect, false);
			this.game.answerQuestion('answer', this.user);
			assert.equal(this.player.isCorrect, true);
		});

		it('should give points for correct answers', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.tallyAnswers();
			assert.equal(this.player.correctAnswers, 1);
		});

		it('should choose the quicker answerer on tie', function (done) {
			this.game.answerQuestion('answer', this.user);
			setImmediate(() => {
				this.game.answerQuestion('answer', this.user2);
				this.game.tallyAnswers();

				const hrtimeToNanoseconds = hrtime => hrtime[0] * 1e9 + hrtime[1];
				const playerNs = hrtimeToNanoseconds(this.player.answeredAt);
				const player2Ns = hrtimeToNanoseconds(this.game.playerTable[this.user2.id].answeredAt);
				assert(playerNs <= player2Ns);

				done();
			});
		});

		it('should not give NaN points to correct responders', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.tallyAnswers();
			assert(!isNaN(this.player.points));
		});
	});

	context('number mode', function () {
		beforeEach(function () {
			const questions = [{question: '', answers: ['answer'], category: 'ae'}];
			const game = new NumberModeTrivia(this.room, 'first', 'ae', true, 'short', questions);

			this.user = makeTriviaUser('Morfent', '127.0.0.1');
			this.user2 = makeTriviaUser('user2', '127.0.0.2');
			this.user3 = makeTriviaUser('user3', '127.0.0.3');

			game.addTriviaPlayer(this.user);
			game.addTriviaPlayer(this.user2);
			game.addTriviaPlayer(this.user3);
			game.start();
			game.askQuestion();

			this.game = this.room.game = game;
			this.player = game.playerTable[this.user.id];
		});

		afterEach(function () {
			destroyUser(this.user);
			destroyUser(this.user2);
			destroyUser(this.user3);
			if (this.room.game) {
				clearTimeout(this.game.phaseTimeout);
				this.game.phaseTimeout = null;
				this.game.destroy();
			}
		});

		it('should calculate points correctly', function () {
			this.game.playerCount = 5;
			for (let i = 1; i <= 5; i++) {
				assert.equal(this.game.calculatePoints(i), 6 - i);
			}
		});

		// Number mode's answerQuestion prototype method is identical
		// to that of timer mode.

		it('should not give points for answering incorrectly', function () {
			this.game.answerQuestion('not the right answer', this.user);
			this.game.tallyAnswers();
			assert.equal(this.player.correctAnswers, 0);
		});

		it('should give points for answering correctly', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.tallyAnswers();
			assert.equal(this.player.correctAnswers, 1);
		});

		it('should not give NaN points to correct responders', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.tallyAnswers();
			assert(!isNaN(this.player.points));
		});
	});

	context('alt merging', () => {
		it('should only allow merging approved alts', () => {
			trivia.triviaData.leaderboard = {
				annika: [0, 0, 0],
				heartofetheria: [0, 0, 0],
				somerandomreg: [0, 0, 0],
			};

			assert.throws(() => trivia.mergeAlts('annika', 'heartofetheria'));

			trivia.requestAltMerge('annika', 'somerandomreg');
			trivia.requestAltMerge('heartofetheria', 'somerandomreg');
			assert.throws(() => trivia.mergeAlts('annika', 'heartofetheria'));

			trivia.requestAltMerge('annika', 'heartofetheria');
			assert.doesNotThrow(() => trivia.mergeAlts('annika', 'heartofetheria'));
		});

		it('should correctly merge alts', () => {
			trivia.triviaData.leaderboard = {
				annika: [3, 2, 1],
				heartofetheria: [1, 2, 3],
			};

			trivia.requestAltMerge('heartofetheria', 'annika');
			trivia.mergeAlts('heartofetheria', 'annika');

			assert.deepEqual(trivia.triviaData.leaderboard.annika, [4, 4, 4]);
			assert.equal(trivia.triviaData.leaderboard.heartofetheria, undefined);
		});
	});
});
