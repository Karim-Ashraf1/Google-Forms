import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      text: { type: String, required: true },
      type: { type: String, required: true },
      choices: [String]
    }
  ],
  owner: { type: String, required: true },
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }]
});

const Form = mongoose.model('Form', FormSchema);
export default Form;

