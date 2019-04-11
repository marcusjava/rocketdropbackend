const File = require('../models/File');
const Box = require('../models/Box');

class FileController {
	async store(req, res) {
		const url = process.env.URL || 'http://localhost:3000/files';
		const box = await Box.findById(req.params.id);
		const file = await File.create({
			title: req.file.originalname,
			path: req.file.key,
			url: `${url}/files/${req.file.key}`,
		});
		box.files.push(file);
		await box.save();
		req.io.sockets.in(box._id).emit('file', file);
		return res.json(file);
	}
}

module.exports = new FileController();
