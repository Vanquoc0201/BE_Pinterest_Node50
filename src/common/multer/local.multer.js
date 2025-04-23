import multer from "multer";
import fs from "fs";
import path from "path";
// Đảm bảo nếu chưa có folder images sẽ tạo , còn nếu có rồi thì thôi
fs.mkdirSync("images/", {recursive:true});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, "images/");
    },
    filename: function (req, file, cb) {
       const fileExtName = path.extname(file.originalname);
 
       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
       cb(null, `local-${uniqueSuffix}${fileExtName}`);
    },
 });
 
 const uploadLocal = multer({ storage: storage, limits: { fileSize: 1 * 1024 * 1024 } }); // giới hạn file 1 MB
 
 export default uploadLocal;