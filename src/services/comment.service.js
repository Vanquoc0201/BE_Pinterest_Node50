import prisma from "../common/prisma/init.prisma";

export const commentService = {
  // CREATE
  create: async function (req) {
    const { imageId, content } = req.body;
    const userId = req.user.userId;

    const newComment = await prisma.comments.create({
      data: {
        userId,
        imageId: +imageId,
        content,
        dateComment: new Date(),
        // deletedBy, isDeleted... dùng default từ DB
      },
    });

    return newComment;
  },

  // READ ALL (với phân trang + tìm kiếm)
  findAll: async function (req) {
    let { page, pageSize, search } = req.query;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 5;
    search = search || "";

    const skip = (page - 1) * pageSize;
    const where = {
      isDeleted: false,
      content: { contains: search },
    };

    const items = await prisma.comments.findMany({
      skip,
      take: pageSize,
      where,
      orderBy: { createdAt: "desc" },
      include: {
        Users: {
          select: { userId: true, hoTen: true, avatar: true },
        },
        Images: {
          select: { imageName: true, imageLink: true },
        },
      },
    });

    const totalItem = await prisma.comments.count({ where });
    const totalPage = Math.ceil(totalItem / pageSize);

    return { page, pageSize, totalItem, totalPage, items };
  },

  // READ ONE
  findOne: async function (req) {
    const commentId = +req.params.id;

    const comment = await prisma.comments.findUnique({
      where: { commentId },
      include: {
        Users: { select: { userId: true, hoTen: true, avatar: true } },
        Images: { select: { imageName: true, imageLink: true } },
      },
    });

    if (!comment || comment.isDeleted) {
      throw new Error("Comment not found");
    }
    return comment;
  },

  // UPDATE
  update: async function (req) {
    const commentId = +req.params.id;
    const { content } = req.body;

    const updated = await prisma.comments.update({
      where: { commentId },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    return updated;
  },

  // DELETE (soft delete)
  remove: async function (req) {
    const commentId = +req.params.id;
    const deletedBy = req.user.userId;

    const deleted = await prisma.comments.update({
      where: { commentId },
      data: {
        isDeleted: true,
        deletedBy,
        deletedAt: new Date(),
      },
    });

    return { commentId: deleted.commentId };
  },
};
