const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	image: { type: String },
	password: { type: String, required: true },
	bookmarks: [
		{
			type: { type: String, enum: ['apod', 'mars', 'epic', 'neo', 'library'], required: true },
			data: { type: mongoose.Schema.Types.Mixed, required: true },
		}
	]
});


// compare passwords
userSchema.methods.matchPassword = async function (enterPassword) {
	return await bcrypt.compare(enterPassword, this.password);
}

// hash password
userSchema.pre("save", async function (next) {
	if (!this.isModified('password')) {
		next();
	} else {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
})


module.exports = mongoose.model("User", userSchema);