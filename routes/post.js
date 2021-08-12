const express = require('express');
const router = express.Router();

const postController = require('../controllers/posts');
const isAuth = require('../middleware/isAuth');

router.post('/newpost', isAuth, postController.postNewPost);

router.post('/comment', isAuth, postController.postComment);

router.get('/post/:id', postController.getPostById);

router.get('/posts', postController.getAllPosts);

router.delete('/delete/post/:id', postController.deletePost);

module.exports = router;
