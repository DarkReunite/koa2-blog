import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  username: String,
  password: String,
  admin: {type: Boolean, default:true}
},
{
  timestamps: true
})

const account = mongoose.model('account', accountSchema);

export default account;