import express from 'express';
import { NextFunction,Response,Request,Router,RequestHandler} from 'express';
const router: Router = express.Router();

interface User {
  id: number;
  name: string;
}

// Sample in-memory database
const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// GET /users/search
router.get('/search', ((req: Request, res: Response) => {
  const name = req.query.name as string;
  if (name) {
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(filtered);
  }
  res.json(users);
}) as RequestHandler);

// GET /users/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    const err: Error & { status?: number } = new Error('User not found');
    err.status = 404;
    return next(err);
  }
  
  res.json(user);
});
// POST /users/newuser
// router.post('/newuser', (req: Request, res: Response) => {
//   const newUser = req.body;

//   if (!newUser.id || !newUser.name) {
//     return res.status(400).json({ message: "Invalid user data" });
//   }

//   const existingUser = users.find(u => u.id === newUser.id);
//   if (existingUser) {
//     return res.status(400).json({ message: "User already exists" });
//   }

//   users.push(newUser);
//   return res.status(201).json({ message: "User added", user: newUser });
// });

// PUT /updateUser/:id
// router.put('/updateUser/:id', (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   const user = users.find(u => u.id === parseInt(id));
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   user.name = name;
//   return res.status(200).json({ message: "User updated successfully", user });
// });

// DELETE /deleteUsers/:id
// router.delete('/deleteUsers/:id', (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   const index = users.findIndex(user => user.id === id);

//   if (index === -1) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   const deletedUser = users.splice(index, 1)[0];
//   res.json({ message: 'User deleted', user: deletedUser });
// });
export default router;