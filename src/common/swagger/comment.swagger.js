
const commentSwagger = {
  "/comment": {
    post: {
      tags: ["Comment"],
      description:
        "Requires authentication. Creates a comment on a specific image.",
      security: [{ bearerAuth: [] }], 
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                imageId: {
                  type: "integer",
                  description: "ID of the image to comment on",
                  example: 1,
                },
                content: {
                  type: "string",
                  description: "The content of the comment",
                  example: "This is a great picture!",
                },
              },
              required: ["imageId", "content"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Comment created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  commentId: { type: "integer" },
                  userId: { type: "integer" },
                  imageId: { type: "integer" },
                  content: { type: "string" },
                  dateComment: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        400: { description: "Invalid input data" },
        401: { description: "Unauthorized - Invalid or missing token" },
        404: { description: "Image not found" }, // Hoặc lỗi liên quan khác
      },
    },
    get: {
      tags: ["Comment"],
      description: "Requires authentication. Retrieves a list of comments.",
      security: [{ bearerAuth: [] }], 
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Page number for pagination (default: 1)",
          schema: { type: "integer", default: 1 },
        },
        {
          name: "pageSize",
          in: "query",
          description: "Number of comments per page (default: 5)",
          schema: { type: "integer", default: 5 },
        },
        {
          name: "search",
          in: "query",
          description: "Search term to filter comments by content",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "List of comments retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  pageSize: { type: "integer" },
                  totalItem: { type: "integer" },
                  totalPage: { type: "integer" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        commentId: { type: "integer" },
                        content: { type: "string" },
                        dateComment: { type: "string", format: "date-time" },
                        Users: {
                          type: "object",
                          properties: {
                            userId: { type: "integer" },
                            hoTen: { type: "string" },
                            avatar: { type: "string" },
                          },
                        },
                        Images: {
                          type: "object",
                          properties: {
                            imageName: { type: "string" },
                            imageLink: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized - Invalid or missing token" },
      },
    },
  },
  "/comment/{id}": {
    get: {
      tags: ["Comment"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID of the comment to retrieve",
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: {
          description: "Comment details retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  commentId: { type: "integer" },
                  content: { type: "string" },
                  dateComment: { type: "string", format: "date-time" },
                  Users: {
                    type: "object",
                    properties: {
                      userId: { type: "integer" },
                      hoTen: { type: "string" },
                      avatar: { type: "string" },
                    },
                  },
                  Images: {
                    type: "object",
                    properties: {
                      imageName: { type: "string" },
                      imageLink: { type: "string" },
                    },
                  },
             
                },
              },
            },
          },
        },
        404: { description: "Comment not found" },
      },
    },
    put: {
      tags: ["Comment"],
      description: "Requires authentication. Updates the content of a comment.",
      security: [{ bearerAuth: [] }], 
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID of the comment to update",
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description: "The new content for the comment",
                  example: "Actually, I changed my mind.",
                },
              },
              required: ["content"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Comment updated successfully",
          content: {
            "application/json": {
              schema: {
             
                type: "object",
                properties: {
                  commentId: { type: "integer" },
                  userId: { type: "integer" },
                  imageId: { type: "integer" },
                  content: { type: "string" },
                  updatedAt: { type: "string", format: "date-time" },
               
                },
              },
            },
          },
        },
        400: { description: "Invalid input data" },
        401: { description: "Unauthorized - Invalid or missing token" },
        403: {
          description:
            "Forbidden - User may not have permission to update this comment",
        },
        404: { description: "Comment not found" },
      },
    },
    delete: {
      tags: ["Comment"],
      description: "Requires authentication. Marks a comment as deleted.",
      security: [{ bearerAuth: [] }], 
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID of the comment to delete",
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: {
          description: "Comment deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  commentId: { type: "integer" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized - Invalid or missing token" },
        403: {
          description:
            "Forbidden - User may not have permission to delete this comment",
        }, 
        404: { description: "Comment not found" },
      },
    },
  },
};

export default commentSwagger;
