import prisma from "../common/prisma/init.prisma";
import bcrypt from "bcrypt";

import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
} from "../common/helpers/exception.helper";

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export const userService = {
  create: async function (req) {
    const { email, password, hoTen, avatar } = req.body;

    if (!email) throw new BadRequestException("Missing required field: email");
    if (!password)
      throw new BadRequestException("Missing required field: password");
    if (!hoTen) throw new BadRequestException("Missing required field: hoTen");
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new BadRequestException("Invalid email format.");
    if (
      typeof password !== "string" ||
      password.length < PASSWORD_MIN_LENGTH ||
      !PASSWORD_REGEX.test(password)
    )
      throw new BadRequestException(
        `Invalid password: Must be at least ${PASSWORD_MIN_LENGTH} characters long and contain at least one letter and one number.`
      );
    if (typeof hoTen !== "string" || hoTen.trim() === "")
      throw new BadRequestException("Invalid hoTen: Cannot be empty.");
    if (
      avatar !== undefined &&
      avatar !== null &&
      (typeof avatar !== "string" || avatar.trim() === "")
    )
      throw new BadRequestException(
        "Invalid avatar: Must be null or a non-empty string if provided."
      );

    try {
      const exist = await prisma.users.findUnique({
        where: { email },
        select: { userId: true },
      });
      if (exist) throw new ConflictException("Email already exists");

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);

      const newUser = await prisma.users.create({
        data: {
          email,
          password: hashPassword,
          hoTen: hoTen.trim(),
          avatar: avatar === null ? null : avatar ? avatar.trim() : null,
        },
        select: {
          userId: true,
          email: true,
          hoTen: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return newUser;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error("[UserService - Create] Error:", error);
      throw new UnprocessableEntityException(
        "Could not create user due to a server error."
      );
    }
  },

  findAll: async function (req) {
    try {
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
    } catch (error) {
      console.error("[UserService - FindAll] Error:", error);
      throw new UnprocessableEntityException(
        "Could not retrieve users due to a server error."
      );
    }
  },

  findOne: async function (req) {
    const { id } = req.params;
    const userId = +id;
    if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId))
      throw new BadRequestException(
        "Invalid user ID: Must be a positive integer."
      );

    try {
      const user = await prisma.users.findFirst({
        where: { userId: userId, isDeleted: false },
        select: {
          userId: true,
          email: true,
          hoTen: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user)
        throw new NotFoundException(
          `User with ID ${userId} not found or has been deleted`
        );
      return user;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error("[UserService - FindOne] Error:", error);
      throw new UnprocessableEntityException(
        "Could not retrieve user due to a server error."
      );
    }
  },

  update: async function (req) {
    const { id } = req.params;
    const { hoTen, avatar, password } = req.body;
    const requesterUserId = req.user.userId;
    const userIdToUpdate = +id;

    if (
      isNaN(userIdToUpdate) ||
      userIdToUpdate <= 0 ||
      !Number.isInteger(userIdToUpdate)
    )
      throw new BadRequestException(
        "Invalid user ID: Must be a positive integer."
      );
    if (hoTen === undefined && avatar === undefined && password === undefined)
      throw new BadRequestException(
        "No update data provided. Provide at least hoTen, avatar, or password."
      );
    if (
      hoTen !== undefined &&
      (typeof hoTen !== "string" || hoTen.trim() === "")
    )
      throw new BadRequestException(
        "Invalid hoTen: Cannot be empty if provided."
      );
    if (
      avatar !== undefined &&
      avatar !== null &&
      (typeof avatar !== "string" || avatar.trim() === "")
    )
      throw new BadRequestException(
        "Invalid avatar: Must be null or a non-empty string if provided."
      );
    if (password !== undefined) {
      if (
        typeof password !== "string" ||
        password.length < PASSWORD_MIN_LENGTH ||
        !PASSWORD_REGEX.test(password)
      )
        throw new BadRequestException(
          `Invalid password: Must be at least ${PASSWORD_MIN_LENGTH} characters long and contain at least one letter and one number if provided.`
        );
    }

    try {
      if (requesterUserId !== userIdToUpdate)
        throw new ForbiddenException(
          "Forbidden: You are not allowed to update this user"
        );

      const existingUser = await prisma.users.findFirst({
        where: { userId: userIdToUpdate, isDeleted: false },
        select: { userId: true },
      });
      if (!existingUser)
        throw new NotFoundException(
          `User with ID ${userIdToUpdate} not found or has been deleted`
        );

      const data = { updatedAt: new Date() };
      if (hoTen !== undefined) data.hoTen = hoTen.trim();
      if (avatar !== undefined)
        data.avatar = avatar === null ? null : avatar.trim();
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(password, salt);
      }

      const updated = await prisma.users.update({
        where: { userId: userIdToUpdate },
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
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error("[UserService - Update] Error:", error);
      throw new UnprocessableEntityException(
        "Could not update user due to a server error."
      );
    }
  },

  remove: async function (req) {
    const { id } = req.params;
    const requesterUserId = req.user.userId;
    const userIdToDelete = +id;

    if (
      isNaN(userIdToDelete) ||
      userIdToDelete <= 0 ||
      !Number.isInteger(userIdToDelete)
    )
      throw new BadRequestException(
        "Invalid user ID: Must be a positive integer."
      );

    try {
      if (requesterUserId !== userIdToDelete)
        throw new ForbiddenException(
          "Forbidden: You are not allowed to delete this user"
        );

      const existingUser = await prisma.users.findFirst({
        where: { userId: userIdToDelete, isDeleted: false },
        select: { userId: true },
      });
      if (!existingUser)
        throw new NotFoundException(
          `User with ID ${userIdToDelete} not found or already deleted`
        );

      await prisma.users.update({
        where: { userId: userIdToDelete },
        data: {
          isDeleted: true,
          deletedBy: requesterUserId,
          deletedAt: new Date(),
        },
      });
      return { userId: userIdToDelete };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error("[UserService - Remove] Error:", error);
      throw new UnprocessableEntityException(
        "Could not delete user due to a server error."
      );
    }
  },

  saveImage: async function (req) {
    const userId = req.user.userId;
    try {
      const savePhotos = await prisma.saves.findMany({
        where: { userId: userId },
        include: {
          Images: {
            select: {
              imageId: true,
              imageName: true,
              imageLink: true,
              description: true,
              userId: true,
            },
          },
        },
        orderBy: { dateSave: "desc" },
      });
      return savePhotos;
    } catch (error) {
      console.error("[UserService - SaveImage] Error:", error);
      throw new UnprocessableEntityException(
        "Could not retrieve saved images due to a server error."
      );
    }
  },

  getLike: async function (req) {
    const { id } = req.params;
    const requesterUserId = req.user.userId;
    const userId = +id;

    // Validation Input
    if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId))
      throw new BadRequestException(
        "Invalid user ID: Must be a positive integer."
      );

    try {
      if (requesterUserId !== userId)
        throw new ForbiddenException(
          "Bạn không có quyền truy cập vào danh sách like này"
        );

      const likePhotos = await prisma.likes.findMany({
        where: { userId: userId },
        include: {
          Images: {
            select: {
              imageId: true,
              imageName: true,
              imageLink: true,
              description: true,
              userId: true,
            },
          },
        },
        orderBy: { dateLike: "desc" },
      });
      return likePhotos;
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error("[UserService - GetLike] Error:", error);
      throw new UnprocessableEntityException(
        "Could not retrieve liked images due to a server error."
      );
    }
  },
};
