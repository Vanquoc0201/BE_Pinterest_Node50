import prisma from "../common/prisma/init.prisma";

export const likeService = {
  like: async function (req) {
    const userId = +req.user.userId;
    const imageId = +req.body.imageId;
    // Kiểm tra xem ảnh có tồn tại không
    const imageExists = await prisma.images.findUnique({
      where: {
        imageId: imageId,
      },
    });

    // Nếu ảnh không tồn tại, trả về lỗi
    if (!imageExists) {
      throw new Error("Ảnh không tồn tại");
    }
    const existingLike = await prisma.likes.findUnique({
      where: {
        userId_imageId: {
          userId: userId,
          imageId: imageId,
        },
      },
    });
    if (existingLike) {
      throw new Error("Bạn đã thích ảnh này rồi");
    }
    const result = await prisma.likes.create({
      data: {
        userId: userId,
        imageId: imageId,
      },
    });
    return { message: "Like ảnh thành công", result };
  },

  unLike: async function (req) {
    const userId = +req.user.userId;
    const imageId = +req.body.imageId;
    // Kiểm tra xem ảnh có tồn tại không
    const imageExists = await prisma.images.findUnique({
      where: {
        imageId: imageId,
      },
    });

    // Nếu ảnh không tồn tại, trả về lỗi
    if (!imageExists) {
      throw new Error("Ảnh không tồn tại");
    }
    // Kiểm tra xem người dùng đã thích ảnh này chưa
    const existingLike = await prisma.likes.findUnique({
      where: {
        userId_imageId: {
          userId: userId,
          imageId: imageId,
        },
      },
    });

    // Nếu chưa like, trả về thông báo
    if (!existingLike) {
      throw new Error("Bạn chưa thích ảnh này.");
    }

    // Nếu đã like, tiến hành xóa (soft delete nếu cần)
    const result = await prisma.likes.delete({
      where: {
        userId_imageId: {
          userId: userId,
          imageId: imageId,
        },
      },
    });

    return { message: "Bỏ like ảnh thành công", result };
  },
};
export default likeService;
