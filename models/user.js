import {Schema, model, models} from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required'],
  },
  username: {
    type: String,
    required: [true, 'Username i s required'],
    match: [/^(?=.{8,40}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, 'Username invalid, it should contain 8-20 alphanumeric letters and be unique!']
  },
  image: {
    type: String, 
  }  
})

// mongoose va a cercare se nel DB esiste già una collection con quel nome e se c'è usa quel modello. In alternativa viene usato quello definito da noi.
const User = models.User || model('User', UserSchema);

export default User;