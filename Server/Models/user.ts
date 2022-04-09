import mongoose, { PassportLocalSchema } from 'mongoose';
const Schema = mongoose.Schema; // alias
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new Schema
({
    DisplayName: String,
    EmailAddress: String,
    username: String,
    Created:
    {
        type: Date,
        default: Date.now()
    },
    Updated:
    {
        type: Date,
        default: Date.now()
    },
},
{
    collection: "users"
});

UserSchema.plugin(passportLocalMongoose);
//UserSchema.plugin(passportLocalMongoose, { usernameField: "Username"});

const Model = mongoose.model("User", UserSchema as PassportLocalSchema);

declare global
{
    export type UserDocument = mongoose.Document &
    {
        username: String,
        EmailAddress: String,
        DisplayName: String
    }
}

export default Model;