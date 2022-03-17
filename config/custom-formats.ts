export const Formats: FormatList = [
	// Sw/Sh Singles
	///////////////////////////////////////////////////////////////////
{
		section: "MMO Tiers",
	}
	{
		name: "[MMO] OU"
		desc: `MMO OU. I don't know what kind of fancy description you were expecting here`,
		threads: [
			`don't expect anything here`,
		],
		mod: 'mmo',
		ruleset: ['Standard', 'Dynamax Clause'],
		banlist: [
			'Uber', 'AG', 'Arena Trap', 'Moody', 'Power Construct', 'Sand Veil', 'Shadow Tag', 'Snow Cloak',
			'Bright Powder', 'Lax Incense', 'Baton Pass',
		],
	},
	{
		name: "[MMO] UU",
		desc: `MMO UU. For real though why are you reading this?`,
		threads: [
			`don't expect anything here`,
		],
		mod: 'mmo',
		ruleset: ['[MMO] OU'],
		banlist: ['OU', 'UUBL'],
	},
	{
		name: "[MMO] NU",
		desc: `MMO NU. Nope, still nothing useful here.`,
		threads: [
			`don't expect anything here`,
		],
		mod: 'mmo',
		ruleset: ['[MMO] UU'],
		banlist: ['UU', 'NUBL'],
	},
	{
		name: "[MMO] UT",
		desc: `MMO UT. I'm starting to run out of things to put here`,
		threads: [
			`don't expect anything here`,
		],
		mod: 'mmo',
		ruleset: ['[MMO] UU'],
		banlist: ['UU', 'NUBL'],
	},
	{
		name: "[MMO] LC",
		desc: `MMO LC. Same lame jokes here, nothing helpful.`,
		threads: [
			`don't expect anything here`,
		],
		mod: 'mmo',
		ruleset: ['Little Cup', 'Standard', 'Dynamax Clause'],
		banlist: ['UU', 'NUBL'],
	},
	{
		name: "[MMO] Doubles OU",
		desc: `MMO DOU. It might be doubles, but I'm not doubling the lame jokes.`,
		threads: [
			`For real though`,
		],

		mod: 'mmo',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', 'Dynamax Clause', 'Swagger Clause'],
		banlist: ['DUber', 'Power Construct', 'Shadow Tag'],
	}
