import prisma from "../common/prisma/init.prisma";
import fs from "fs";
import path from "fs";
import { v2 as cloudinary } from "cloudinary";
import { API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY, CLOUD_NAME_CLOUDINARY } from "../common/constant/app.constant";
export const photoService = {
  create: async function (req) {
    const file = req.file;
    if (!file) {
      throw new Error("No file Upload");
    }
    const user = req.user;
    const userId = user.userId;
    cloudinary.config({
      cloud_name: CLOUD_NAME_CLOUDINARY,
      api_key: API_KEY_CLOUDINARY,
      api_secret: API_SECRET_CLOUDINARY, 
    });
    const uploadResult = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream({ folder: "images" }, (error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(file.buffer);
    });
    // Lấy link và public_id từ Cloudinary
    const imageName = uploadResult.public_id; // Bạn có thể lưu tên theo public_id
    const imageLink = uploadResult.secure_url; // Link để xem ảnh
    const newImage = await prisma.images.create({
      data: {
        imageName: imageName,
        imageLink: imageLink,
        userId: userId,
      },
    });

    return {
      imageId: newImage.imageId,
      filename: newImage.imageName, // Dùng originalname cho đẹp hơn
      imageLink: newImage.imageLink,
      message: "Upload ảnh thành công",
    };
  },

  findAll: async function (req) {
    let { page, pageSize, search } = req.query;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 3;
    search = search || "";
    const skip = (page - 1) * pageSize;
    const where = { imageName: { contains: search } };
    const images = await prisma.images.findMany({
      skip: skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      where: where,
    });
    const totalItem = await prisma.images.count({
      where: where,
    });
    const totalPage = Math.ceil(totalItem / pageSize);
    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: images || [],
    };
  },

  findOne: async function (req) {
    const imageId = +req.params.id;
    if (!imageId || isNaN(imageId)) {
      throw new Error("ID ảnh không hợp lệ");
    }

    const image = await prisma.images.findUnique({
      where: { imageId },
      include: {
        Users: {
          select: {
            userId: true,
            hoTen: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!image) {
      throw new Error("Không tìm thấy ảnh");
    }

    return {
      imageId: image.imageId,
      imageName: image.imageName,
      imageLink: image.imageLink,
      description: image.description,
      createdAt: image.createdAt,
      postedBy: image.Users, // user info
    };
  },

  remove: async function (req) {
    const imageId = +req.params.id;

    if (!imageId || isNaN(imageId)) {
      throw new Error("ID của ảnh không hợp lệ");
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("Không xác định được người dùng");
    }

    // Tìm ảnh trong database
    const image = await prisma.images.findUnique({
      where: { imageId },
    });

    if (!image) {
      throw new Error("Không tìm thấy ảnh");
    }

    if (image.userId !== userId) {
      throw new Error("Bạn không có quyền xóa ảnh này");
    }

    // Cấu hình Cloudinary
    cloudinary.config({
      cloud_name: CLOUD_NAME_CLOUDINARY,
      api_key: API_KEY_CLOUDINARY,
      api_secret: API_SECRET_CLOUDINARY,
    });

    // Xóa ảnh trên Cloudinary
    await cloudinary.uploader.destroy(image.imageName); // imageName lưu public_id

    // Xóa trong database
    await prisma.images.delete({
      where: { imageId },
    });

    return {
      message: "Xóa ảnh thành công",
      imageId: imageId,
    };
  },
  saveImage: async function (req) {
    const userId = req.user?.userId;
    const imageId = +req.params.id;
    if (!userId || !imageId || isNaN(imageId)) {
      throw new Error("Dữ liệu không hợp lệ");
    }
    // Kiểm tra ảnh có tồn tại không
    const image = await prisma.images.findUnique({ where: { imageId } });
    if (!image) {
      throw new Error("Không tìm thấy ảnh");
    }
    // Kiểm tra đã lưu hay chưa
    const alreadySaved = await prisma.saves.findUnique({
      where: {
        userId_imageId: {
          userId: userId,
          imageId: imageId,
        },
      },
    });
    if (alreadySaved) {
      throw new Error("Ảnh đã được lưu trước đó");
    }
    // Lưu ảnh
    await prisma.saves.create({
      data: {
        userId: userId,
        imageId: imageId,
        dateSave: new Date(),
      },
    });
    return { message: "Lưu ảnh thành công" };
  },
  unSaveImage: async function (req) {
    const userId = +req.user?.userId;
    const imageId = +req.params.id;
    if (!userId || !imageId || isNaN(imageId)) {
      throw new Error("Dữ liệu không hợp lệ");
    }
    // Kiểm tra ảnh có tồn tại không
    const image = await prisma.images.findUnique({ where: { imageId } });
    if (!image) {
      throw new Error("Không tìm thấy ảnh");
    }
    // Kiểm tra đã lưu hay chưa
    const alreadySaved = await prisma.saves.findUnique({
      where: {
        userId_imageId: {
          userId: userId,
          imageId: imageId,
        },
      },
    });
    if (!alreadySaved) {
      throw new Error("Ảnh chưa được lưu trước đó");
    }
    // Hủy lưu ảnh
    await prisma.saves.delete({
      where: {
        userId_imageId: {
          userId: userId,
          imageId: imageId,
        },
      },
    });
    return { message: "Hủy lưu ảnh thành công" };
  },
  getLike: async function (req) {
    const imageId = +req.params.id;
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
    const likeCount = await prisma.likes.count({
      where: {
        imageId: imageId,
      },
    });
    return {
      message: `Số lượt like là ${likeCount}`,
      likeCount: likeCount,
    };
  },
};
export default photoService;
