const userSwagger = {
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
            type: "string",
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
