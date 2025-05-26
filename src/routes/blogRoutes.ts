import { CreateBlog } from "../repository/BlogController";

import { authenticateToken, authorize } from "../middleware/authenticateToken";
export const BlogRouter = [ 
    {
        method: "post",
        route: "/createBlog",
        controller: CreateBlog,
        action: "CreateBlog",
        middlewares: [authenticateToken, authorize("admin")], // only admin can create blog
    },
    {
        method: "get",
        route: "/test",
        controller: CreateBlog,
        action: "test",
    },
    ];
