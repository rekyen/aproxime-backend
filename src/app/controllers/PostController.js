import Post from '../schemas/post';
import User from '../models/User';

class PostController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const pageSize = 5;

    const posts = await Post.find()
      .sort({ createdAt: 'desc' })
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const totalItens = await Post.count();
    const totalPages = Math.ceil(totalItens / pageSize);
    const pagedList = {
      data: posts,
      total_itens: totalItens,
      total_pages: totalPages,
      current_page: Number(page),
    };

    return res.json(pagedList);
  }

  async store(req, res) {
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const location = {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude],
    };

    const { title, content } = req.body;

    const post = {
      user: req.userId,
      title,
      content,
      location,
    };

    const result = await Post.create(post);

    return res.json(result);
  }

  async update(req, res) {
    let post;

    if (req.query.like === 'true') {
      post = await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
      );
    }
    if (req.query.like === 'false') {
      post = await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: -1 } },
        { new: true }
      );
    }

    if (req.query.dislike === 'true') {
      post = await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: { dislikes: 1 } },
        { new: true }
      );
    }
    if (req.query.dislike === 'false') {
      post = await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: { dislikes: -1 } },
        { new: true }
      );
    }

    if (!post) {
      return res.status(304).json();
    }
    return res.json(post);
  }
}

export default new PostController();
