const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Neurology', 'Nutrition', 'Wellness', 'Psychiatry', 'Lifestyle', 'Fitness', 'Psychology', 'General Health'],
      default: 'Wellness',
    },
    tag: {
      type: String,
      default: 'Health',
    },
    subTags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: String,
      default: '4 min read',
    },
    author: {
      name: { type: String, default: 'Dr. Sushruth Editorial' },
      role: { type: String, default: 'Medical Content Team' },
      avatar: { type: String, default: '' },
    },
    desc: {
      type: String,
      required: true,
    },
    paragraph1: {
      type: String,
      default: '',
    },
    pullQuote: {
      type: String,
      default: '',
    },
    paragraph2: {
      type: String,
      default: '',
    },
    img: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 120,
    },
    likes: {
      type: Number,
      default: 45,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug before save
articleSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
