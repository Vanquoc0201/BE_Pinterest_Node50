const photoSwagger = {
  "/photo/upload-images": {
    post: {
      tags: ["Photo"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                  format: "binary",
                  description: "Tệp ảnh cần upload",
                },
              },
              required: ["file"], // Đảm bảo là file
            },
          },
        },
      },
      responses: {
        200: { description: "OK" },
        401: {
          description: "Chưa xác thực hoặc token không hợp lệ",
      },
      },
    },
  },
  "/photo/pagination": {
    get: {
      tags: ["Photo"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Nếu không truyền thì mặc định là 1",
        },
        {
          name: "pageSize",
          in: "query",
          description: "Nếu không truyền thì mặc định là 3",
        },
        { name: "search", in: "query", description: "Ảnh Hình nền" },
      ],
      responses: {
        200: { description: "oke" },
        401: {
          description: "Chưa xác thực hoặc token không hợp lệ",
      },
      },
    },
  },
  "/photo/{id}": {
    get: {
      tags: ["Photo"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", description: "ID ảnh" }],
      responses: {
        200: { description: "oke" },
        401: {
          description: "Chưa xác thực hoặc token không hợp lệ",
      },
      },
    },
    delete : {
        tags: ["Photo"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", description: "ID ảnh" }],
        responses: {
            200: { description: "oke" },
            401: {
              description: "Chưa xác thực hoặc token không hợp lệ",
          },
        },
    }
  },
  "/photo/{id}/save" : {
    post : {
        tags : ["Photo"],
        security: [{ bearerAuth: [] }],
        parameters : [
            { name: "id", in: "path", description: "ID ảnh" },
        ],
        responses : {
            200: { description: "oke" },
            401: {
              description: "Chưa xác thực hoặc token không hợp lệ",
          },
        },
    },
    delete : {
        tags : ["Photo"],
        security: [{ bearerAuth: [] }],
        parameters : [
            { name: "id", in: "path", description: "ID ảnh" },
        ],
        responses : {
            200: { description: "oke" },
            401: {
              description: "Chưa xác thực hoặc token không hợp lệ",
          },
        },
    }
  }
};
export default photoSwagger;
