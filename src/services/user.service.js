import prisma from "../common/prisma/init.prisma";
import bcrypt from "bcrypt";

export const userService = {
  /** CREATE user */
  create: async function (req) {
    const { email, password, hoTen, avatar } = req.body;
    // Kiểm tra email tồn tại
    const exist = await prisma.users.findUnique({ where: { email } });
    if (exist) {
      throw new Error("Email đã tồn tại");
    }
    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = await prisma.users.create({
      data: { email, password: hashPassword, hoTen, avatar },
    });
    delete newUser.password;
    return newUser;
  },

  /** READ ALL users */
  findAll: async function (req) {
    const users = await prisma.users.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      select: {
        userId: true,
        email: true,
        hoTen: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  },

  /** READ ONE user by ID */
  findOne: async function (req) {
    const userId = +req.params.id;
    const user = await prisma.users.findFirst({
      where: { userId, isDeleted: false },
      select: {
        userId: true,
        email: true,
        hoTen: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  /** UPDATE user */
  update: async function (req) {
    const userId = +req.params.id;
    const { hoTen, avatar, password } = req.body;
    const data = { hoTen, avatar, updatedAt: new Date() };
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      data.password = bcrypt.hashSync(password, salt);
    }
    const updated = await prisma.users.update({
      where: { userId },
      data,
      select: {
        userId: true,
        email: true,
        hoTen: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updated;
  },

  /** DELETE (soft delete) user */
  remove: async function (req) {
    const userId = +req.params.id;
    const deletedBy = req.user.userId;
    await prisma.users.update({
      where: { userId },
      data: { isDeleted: true, deletedBy, deletedAt: new Date() },
    });
    return { userId };
  },
  saveImage: async function (req) {
    const userId = +req.user.userId;
    const savePhotos = await prisma.saves.findMany({
      where: {
        userId: userId,
      },
      include: {
        Images: true,
      },
    });
    return savePhotos;
  },
  getLike: async function (req) {
    const userId = +req.params.id;
    if (+req.user.userId !== userId) {
      throw new Error("Bạn không có quyền truy cập vào ảnh này");
    }
    const likePhotos = await prisma.likes.findMany({
      where: {
        userId: userId,
      },
      include: {
        Images: true,
      },
    });
    return likePhotos;
  },
};
export default userService;
