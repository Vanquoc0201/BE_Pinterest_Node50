import prisma from "../common/prisma/init.prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../common/winston/init.winston";
import { BadRequestException } from "../common/helpers/exception.helper";
import tokenService from "./token.service";
export const authService = {
   register: async function (req) {
      const {email, password, hoTen} = req.body;
      const userExist = await prisma.users.findUnique({
        where : {
            email: email,
        }
      });
      if(userExist) throw new BadRequestException("Tài khoản đã tồn tại vui lòng đăng nhập");
      const salt = bcrypt.genSaltSync(10); // Tạo ra một chuỗi ngẫu nhiên để làm tăng phức tạp mã hóa
      const hashPassword = bcrypt.hashSync(password,salt);
      const userNew = await prisma.users.create({
        data: {
            email: email,
            password: hashPassword,
            hoTen: hoTen,
        }
      });
      delete userNew.password;
      return userNew;

   },

   login: async function (req) {
      const { email, password} = req.body;
      const userExist = await prisma.users.findUnique({
        where : {
            email: email
        }
      });
      if(!userExist) throw new BadRequestException("Tài khoản chưa tồn tại, vui lòng đăng ký");
      if(!userExist.password) throw new BadRequestException("Vui lòng đăng nhập bằng google hoặc facebook, để cập nhật mật khẩu mới");
      const isPassword = bcrypt.compareSync(password, userExist.password);
      if(!isPassword){
        logger.error(`${userExsit.id} đăng nhập quá 3 lần, lưu dấu vết hoặc cho vào blacklist`);
        throw new BadRequestException("Mật khẩu không chính xác")
      }
      const tokens = tokenService.createTokens(userExist.id);
      return tokens;
   },

   findOne: async function (req) {
      return `This action returns a id: ${req.params.id} auth`;
   },

   update: async function (req) {
      return `This action updates a id: ${req.params.id} auth`;
   },

   remove: async function (req) {
      return `This action removes a id: ${req.params.id} auth`;
   },
};
export default authService