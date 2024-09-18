const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const shortid = require('shortid');
const blogSchema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date },
  state: { type: String, default: 'draft' },
  user_id: { type: mongoose.Schema.Types.String, ref: "users" },
  read_count: { type: Number, required: true, default: 0 },
  reading_time: { type: Number },
  body: { type: String, required: false }
});
blogSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
const blogModel = mongoose.model("blogs", blogSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await blogModel.find().exec();
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = new blogModel(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad Request' });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id).exec();
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await blogModel.findByIdAndDelete(req.params.id).exec();
    res.status(204).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});