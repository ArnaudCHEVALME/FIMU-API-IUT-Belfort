const {dbNext} = require("../models");
const Artiste = dbNext.artistes
const Genre = dbNext.genres
const Pays = dbNext.pays
const SousGenre = dbNext.sousGenres

exports.importCSV = async (req, res) => {
	const {artistes, concerts, scenes, stands} = req.body;

	artistes.csv.forEach(a=>{
		a = {
			banner : a["Photographie (libre de droits - 300dpi - 10Mo max)"],
			name : a["Nom_groupe"],
			sousGenres:a["Sous-genre"].split("|"),
			pays : a["Pays repr�sent�"].split("|"),
			genres : a['Style principal'].split("|"),
			bio:a["Biographie"],
		}

		a.genres.forEach(g=>{
			Genre.create({libelle:g}, {ignoreDuplicates : true, returning:true})
		})
	})
	// TODO - finish the parser and fil the database
	// Genres -> SousGenres -> Pays -> Artiste -> Liens
}