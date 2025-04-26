import userService from "../services/user.service";
import { responseSuccess } from "../common/helpers/response.helper";
export const userController = {
  create: async function (req, res, next) {
    try {
      const result = await userService.create(req);
      const response = responseSuccess(result, "Tạo user thành công");
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  findAll: async function (req, res, next) {
    try {
      const result = await userService.findAll(req);
      const response = responseSuccess(
        result,
        "Lấy danh sách users thành công"
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  findOne: async function (req, res, next) {
    try {
      const result = await userService.findOne(req);
      const response = responseSuccess(
        result,
        `Lấy user #${req.params.id} thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  update: async function (req, res, next) {
    try {
      const result = await userService.update(req);
      const response = responseSuccess(
        result,
        `Cập nhật user #${req.params.id} thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  remove: async function (req, res, next) {
    try {
      const result = await userService.remove(req);
      const response = responseSuccess(
        result,
        `Xóa user #${req.params.id} thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },
  
  saveImage: async function (req, res, next) {
    try {
      const result = await userService.saveImage(req);
      const response = responseSuccess(
        result,
        `Lấy danh sách ảnh người dùng lưu thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },
  getLike: async function (req, res, next) {
    try {
      const result = await userService.getLike(req);
      const response = responseSuccess(
        result,
        `Lấy danh sách ảnh người dùng like thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },
};
export default userController;
