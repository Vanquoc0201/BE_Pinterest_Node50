

const userSwagger = {

  "/user": {
    post: {
      tags: ["User"],
      security: [{ bearerAuth: [] }], 
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { 
              type: "object",
              properties: {
                email: { type: "string", format: "email", example: "new@example.com" },
                password: { type: "string", format: "password", example: "password123" },
                hoTen: { type: "string", example: "Người Dùng Mới" },
                avatar: { type: "string", example: "https://example.com/avatar.png", nullable: true },
              },
              required: ["email", "password", "hoTen"],
            },
          },
        },
      },
      responses: {
        200: { description: "Tạo thành công" }, 
        400: { description: "Dữ liệu không hợp lệ" },
        401: { description: "Chưa xác thực" },
        409: { description: "Email đã tồn tại" },
      },
    },
    get: {
      tags: ["User"],
      security: [{ bearerAuth: [] }], 
      responses: {
        200: { description: "Lấy danh sách thành công" }, 
        401: { description: "Chưa xác thực" },
      },
    },
  },
  "/user/{id}": { 
    get: {
      tags: ["User"],
       security: [{ bearerAuth: [] }], 
      parameters: [
        { name: "id", in: "path", required: true, description: "ID người dùng", schema: { type: "integer" } },
      ],
      responses: {
        200: { description: "Lấy thông tin thành công" }, 
        404: { description: "Không tìm thấy người dùng" },
      },
    },
    put: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, description: "ID người dùng", schema: { type: "integer" } },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: { 
              type: "object",
              properties: {
                hoTen: { type: "string" },
                avatar: { type: "string", nullable: true },
                password: { type: "string", format: "password" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" }, 
        400: { description: "Dữ liệu không hợp lệ" },
        401: { description: "Chưa xác thực" },
        404: { description: "Không tìm thấy người dùng" },
      },
    },
    delete: {
      tags: ["User"],
      security: [{ bearerAuth: [] }], 
      parameters: [
        { name: "id", in: "path", required: true, description: "ID người dùng", schema: { type: "integer" } },
      ],
      responses: {
        200: { description: "Xóa thành công" }, 
        401: { description: "Chưa xác thực" },
        404: { description: "Không tìm thấy người dùng" },
      },
    },
  },

  "/user/saved-image": {
    get: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "oke" },
        401: {
          description: "Chưa xác thực hoặc token không hợp lệ",
        },
      },
    },
  },
  "/user/{id}/like": { 
    get: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID của người dùng",
          schema: {
             type: "integer", 
          },
        },
      ],
      responses: {
        200: { description: "oke" },
        401: {
          description: "Chưa xác thực hoặc token không hợp lệ",
        },
       
      },
    },
  },

};
export default userSwagger;