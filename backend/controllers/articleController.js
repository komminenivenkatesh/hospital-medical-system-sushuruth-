const Article = require('../models/Article');
const mongoose = require('mongoose');

/**
 * @desc    Get all health articles with filtering and search
 * @route   GET /api/articles
 * @access  Public
 */
const getArticles = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } },
        { subTags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const articles = await Article.find(filter).sort({ featured: -1, createdAt: -1 });

    // Identify hero/featured article
    let hero = articles.find((a) => a.featured) || articles[0] || null;

    res.json({
      hero,
      articles,
      total: articles.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single article by ID or slug with related recommendations
 * @route   GET /api/articles/:id
 * @access  Public
 */
const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let article = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      article = await Article.findById(id);
    } else {
      article = await Article.findOne({ slug: id });
    }

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment view count
    article.views = (article.views || 0) + 1;
    await article.save();

    // Related articles
    const related = await Article.find({
      _id: { $ne: article._id },
      category: article.category,
    })
      .limit(3)
      .select('title img category readTime desc slug');

    res.json({
      article,
      related,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new article
 * @route   POST /api/articles
 * @access  Private (Admin only)
 */
const createArticle = async (req, res, next) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
};
