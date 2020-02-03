import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, createdAt } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      createdAt,
    });
  }

  async update(req, res) {
    console.log(req.userId);

    const { email, oldPassword, password } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (password || oldPassword) {
      if (!password) {
        return res.status(400).json({ error: 'Missing new password.' });
      }
      if (!oldPassword) {
        return res.status(400).json({ error: 'Missing old password.' });
      }
      if (!(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Password does not match.' });
      }
    }

    const { id, name, createdAt, updatedAt } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      createdAt,
      updatedAt,
    });
  }
}

export default new UserController();
