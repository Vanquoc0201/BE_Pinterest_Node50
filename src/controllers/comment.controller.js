import { responseSuccess } from "../common/helpers/response.helper";
import { commentService } from "../services/comment.service";

export const commentController = {
   create: async function (req, res, next) {
      try {
         const result = await commentService.create(req);
         const response = responseSuccess(result, `Create comment successfully`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

   findAll: async function (req, res, next) {
      try {
         const result = await commentService.findAll(req);
         const response = responseSuccess(result, `Get all comments successfully`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

   findOne: async function (req, res, next) {
      try {
         const result = await commentService.findOne(req);
         const response = responseSuccess(result, `Get comment #${req.params.id} successfully`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

   update: async function (req, res, next) {
      try {
         const result = await commentService.update(req);
         const response = responseSuccess(result, `Update comment #${req.params.id} successfully`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

   remove: async function (req, res, next) {
      try {
         const result = await commentService.remove(req);
         const response = responseSuccess(result, `Remove comment #${req.params.id} successfully`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   }
};