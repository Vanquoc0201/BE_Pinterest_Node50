import prisma from "../common/prisma/init.prisma";
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnprocessableEntityException,
} from "../common/helpers/exception.helper"; // Điều chỉnh đường dẫn nếu cần

// --- Constants (Nên đưa ra file riêng) ---
const MAX_COMMENT_LENGTH = 500;
const MAX_PAGE_SIZE = 50;
// --- End Constants ---

export const commentService = {
  // CREATE
  create: async function (req) {
    const { imageId, content } = req.body;
    const userId = req.user.userId; // Đảm bảo protect middleware đã chạy

    // --- Validation Input ---
    if (imageId === undefined || imageId === null) {
      throw new BadRequestException("Missing required field: imageId");
    }
    if (content === undefined || content === null) {
      throw new BadRequestException("Missing required field: content");
    }
    const numericImageId = +imageId;
    if (
      isNaN(numericImageId) ||
      numericImageId <= 0 ||
      !Number.isInteger(numericImageId)
    ) {
      throw new BadRequestException(
        "Invalid imageId: Must be a positive integer."
      );
    }
    if (typeof content !== "string" || content.trim() === "") {
      throw new BadRequestException("Invalid content: Cannot be empty.");
    }
    if (content.length > MAX_COMMENT_LENGTH) {
      throw new BadRequestException(
        `Invalid content: Exceeds maximum length of ${MAX_COMMENT_LENGTH} characters.`
      );
    }
    // --- Kết thúc Validation Input ---

    try {
      // --- Kiểm tra tài nguyên liên quan ---
      const image = await prisma.images.findUnique({
        where: { imageId: numericImageId },
        select: { imageId: true },
      });
      if (!image) {
        throw new NotFoundException(
          `Image with ID ${numericImageId} not found`
        );
      }
      // --- Kết thúc kiểm tra tài nguyên ---

      const newComment = await prisma.comments.create({
        data: {
          userId,
          imageId: numericImageId,
          content: content.trim(), // Trim content trước khi lưu
          dateComment: new Date(),
        },
      });
      return newComment;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error("[CommentService - Create] Error:", error);
      throw new UnprocessableEntityException(
        "Could not create comment due to a server error."
      );
    }
  },

  // READ ALL
  findAll: async function (req) {
    let { page = 1, pageSize = 5, search = "" } = req.query;

    // --- Validation Input ---
    const numericPage = +page;
    const numericPageSize = +pageSize;
    if (
      isNaN(numericPage) ||
      numericPage <= 0 ||
      !Number.isInteger(numericPage)
    ) {
      throw new BadRequestException(
        "Invalid page number: Must be a positive integer."
      );
    }
    if (
      isNaN(numericPageSize) ||
      numericPageSize <= 0 ||
      !Number.isInteger(numericPageSize)
    ) {
      throw new BadRequestException(
        "Invalid page size: Must be a positive integer."
      );
    }
    if (numericPageSize > MAX_PAGE_SIZE) {
      // Giới hạn pageSize để tránh quá tải
      console.warn(
        `Requested pageSize ${numericPageSize} exceeds MAX_PAGE_SIZE ${MAX_PAGE_SIZE}. Clamping to max.`
      );
      pageSize = MAX_PAGE_SIZE; // Hoặc throw BadRequestException nếu muốn nghiêm ngặt
      // throw new BadRequestException(`Invalid page size: Cannot exceed ${MAX_PAGE_SIZE}.`);
    }
    if (typeof search !== "string") {
      throw new BadRequestException("Invalid search term: Must be a string.");
    }
    // --- Kết thúc Validation Input ---

    const skip = (numericPage - 1) * numericPageSize;
    const where = {
      isDeleted: false,
      content: { contains: search, mode: "insensitive" }, // Tìm kiếm không phân biệt hoa thường
    };

    try {
      // Sử dụng transaction để đảm bảo count và findMany nhất quán
      const [items, totalItem] = await prisma.$transaction([
        prisma.comments.findMany({
          skip,
          take: numericPageSize,
          where,
          orderBy: { createdAt: "desc" },
          include: {
            Users: { select: { userId: true, hoTen: true, avatar: true } },
            Images: {
              select: { imageId: true, imageName: true, imageLink: true },
            },
          },
        }),
        prisma.comments.count({ where }),
      ]);

      const totalPage = Math.ceil(totalItem / numericPageSize);

      return {
        page: numericPage,
        pageSize: numericPageSize,
        totalItem,
        totalPage,
        items,
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error("[CommentService - FindAll] Error:", error);
      throw new UnprocessableEntityException(
        "Could not retrieve comments due to a server error."
      );
    }
  },

  // READ ONE
  findOne: async function (req) {
    const { id } = req.params;

    // --- Validation Input ---
    const commentId = +id;
    if (isNaN(commentId) || commentId <= 0 || !Number.isInteger(commentId)) {
      throw new BadRequestException(
        "Invalid comment ID: Must be a positive integer."
      );
    }
    // --- Kết thúc Validation Input ---

    try {
      const comment = await prisma.comments.findFirst({
        where: { commentId: commentId, isDeleted: false }, // Kiểm tra isDeleted ngay
        include: {
          Users: { select: { userId: true, hoTen: true, avatar: true } },
          Images: {
            select: { imageId: true, imageName: true, imageLink: true },
          },
        },
      });

      if (!comment) {
        throw new NotFoundException(
          `Comment with ID ${commentId} not found or has been deleted`
        );
      }
      return comment;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error("[CommentService - FindOne] Error:", error);
      throw new UnprocessableEntityException(
        "Could not retrieve comment due to a server error."
      );
    }
  },

  // UPDATE
  update: async function (req) {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.userId; // ID người dùng đang thực hiện

    // --- Validation Input ---
    const commentId = +id;
    if (isNaN(commentId) || commentId <= 0 || !Number.isInteger(commentId)) {
      throw new BadRequestException(
        "Invalid comment ID: Must be a positive integer."
      );
    }
    if (content === undefined || content === null) {
      throw new BadRequestException("Missing required field: content");
    }
    if (typeof content !== "string" || content.trim() === "") {
      throw new BadRequestException("Invalid content: Cannot be empty.");
    }
    if (content.length > MAX_COMMENT_LENGTH) {
      throw new BadRequestException(
        `Invalid content: Exceeds maximum length of ${MAX_COMMENT_LENGTH} characters.`
      );
    }
    // --- Kết thúc Validation Input ---

    try {
      // Lấy comment gốc để kiểm tra quyền và trạng thái
      const existingComment = await prisma.comments.findUnique({
        where: { commentId },
        select: { userId: true, isDeleted: true },
      });

      if (!existingComment) {
        throw new NotFoundException(`Comment with ID ${commentId} not found`);
      }
      if (existingComment.isDeleted) {
        throw new NotFoundException(
          `Comment with ID ${commentId} has been deleted and cannot be updated`
        ); // Hoặc lỗi khác tùy logic
      }

      // Kiểm tra quyền sở hữu
      if (existingComment.userId !== userId) {
        // (Thêm check role admin nếu cần: || req.user.role === 'ADMIN')
        throw new ForbiddenException(
          "Forbidden: You are not allowed to update this comment"
        );
      }

      // Nếu kiểm tra OK, tiến hành cập nhật
      const updated = await prisma.comments.update({
        where: { commentId },
        data: {
          content: content.trim(),
          updatedAt: new Date(),
        },
        // Select lại các trường cần thiết nếu cần trả về thông tin mới nhất
        // select: { ... }
      });

      return updated; // Trả về comment đã cập nhật
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error("[CommentService - Update] Error:", error);
      throw new UnprocessableEntityException(
        "Could not update comment due to a server error."
      );
    }
  },

  // DELETE (soft delete)
  remove: async function (req) {
    const { id } = req.params;
    const userId = req.user.userId; // ID người dùng đang thực hiện

    // --- Validation Input ---
    const commentId = +id;
    if (isNaN(commentId) || commentId <= 0 || !Number.isInteger(commentId)) {
      throw new BadRequestException(
        "Invalid comment ID: Must be a positive integer."
      );
    }
    // --- Kết thúc Validation Input ---

    try {
      // Lấy comment gốc để kiểm tra quyền và trạng thái
      const existingComment = await prisma.comments.findUnique({
        where: { commentId },
        select: { userId: true, isDeleted: true },
      });

      if (!existingComment) {
        throw new NotFoundException(`Comment with ID ${commentId} not found`);
      }
      if (existingComment.isDeleted) {
        // Có thể throw lỗi hoặc trả về thành công vì mục tiêu đã đạt được
        // throw new BadRequestException(`Comment with ID ${commentId} is already deleted.`);
        return { commentId: commentId, message: "Comment already deleted" }; // Hoặc trả về thành công
      }

      // Kiểm tra quyền sở hữu
      if (existingComment.userId !== userId) {
        // (Thêm check role admin nếu cần: || req.user.role === 'ADMIN')
        throw new ForbiddenException(
          "Forbidden: You are not allowed to delete this comment"
        );
      }

      // Nếu kiểm tra OK, tiến hành xóa mềm
      await prisma.comments.update({
        where: { commentId },
        data: {
          isDeleted: true,
          deletedBy: userId, // Ghi lại người xóa
          deletedAt: new Date(),
        },
      });

      return { commentId: commentId }; // Xác nhận thành công
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error("[CommentService - Remove] Error:", error);
      throw new UnprocessableEntityException(
        "Could not delete comment due to a server error."
      );
    }
  },
};
