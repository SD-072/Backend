import {Schema, model} from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            maxLength: 50,
            minLength: 2,
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            maxLength: 16,
            minLength: 6
        },
        posts: {
            type: [Schema.Types.ObjectId],
            ref: "Post"
        }
    },
    {timestamps: true}
)

export default model("User", userSchema);