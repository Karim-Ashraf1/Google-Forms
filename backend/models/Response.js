import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: [String],
  responder: { type: String }
});

const Response = mongoose.model('Response', ResponseSchema);
export default Response; 