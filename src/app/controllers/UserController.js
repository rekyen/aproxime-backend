import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const pageSize = 5;

    const user = await User.findOne({
      where: {
        id: req.userId,
        is_admin: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'User is not allowed to do this action.' });
    }

    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      order: ['id'],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    const totalItens = await User.count();
    const totalPages = Math.ceil(totalItens / pageSize);
    const pagedList = {
      data: users,
      total_itens: totalItens,
      total_pages: totalPages,
      current_page: Number(page),
    };

    return res.json(pagedList);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      is_admin: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error.' });
    }

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
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error.' });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
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
