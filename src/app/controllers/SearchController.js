import Post from '../schemas/post';

class SearchController {
  async index(req, res) {
    const { page = 1, latitude, longitude, distance } = req.query;
    const pageSize = 5;

    const conditions = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: distance,
        },
      },
    };

    const posts = await Post.find(conditions)
      .sort({ createdAt: 'desc' })
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const totalItens = await Post.count(conditions);
    const totalPages = Math.ceil(totalItens / pageSize);
    const pagedList = {
      data: posts,
      total_itens: totalItens,
      total_pages: totalPages,
      current_page: Number(page),
    };

    return res.json(pagedList);
  }
}

export default new SearchController();
