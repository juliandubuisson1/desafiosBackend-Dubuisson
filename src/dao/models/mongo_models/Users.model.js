import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    profile: String,
    cart:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    role: { type: String, default: "user" },
    resetToken: String,
    resetTokenExpires: Date,
    documents: [
        {
            name: { type: String, required: true },
            reference: { type: String, required: true }
        }
    ],
    last_connection: Date,
});

const User = mongoose.model("User", userSchema);

export default User;
