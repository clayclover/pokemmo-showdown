export const Rulesets: {[k: string]: ModdedFormatData} = {
	standard: {
		inherit: true,
		ruleset: [
			'Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
		],
	},
	obtainablemoves: {
		inherit: true,
		banlist: [
			// Sword Dance: Garchomp Gen 5+ level-up
		],
[
			// Draco Meteor: Hydreigon Gen 5+ level-up
		],
	},
	teampreview: {
		inherit: true,
		onTeamPreview() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(', shiny', '')
					.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo|Silvally|Zacian|Zamazenta|Urshifu)(-[a-zA-Z?-]+)?/g, '$1-*');
				const item = pokemon.item.includes('mail') ? 'mail' : pokemon.item ? 'item' : '';
				this.add('poke', pokemon.side.id, details, item);
			}
			this.makeRequest('teampreview');
		},
	},
};
