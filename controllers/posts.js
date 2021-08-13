const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

exports.postNewPost = async (req, res, next) => {
  const { postText } = req.body;
  const userId = req.userId;

  try {

    const newPost = new Post({
      postText: postText,
      postCreator: userId
    });

    const savePost = await newPost.save();
    res.status(201).json({message: 'Post Created', post: savePost})

  } catch (err) {
    console.log('[eRROr 101] ', err);
  }
}

exports.postComment = async (req, res, next) => {
  const { commentText, postId } = req.body;
  const userId = req.userId;

  try {
    const postDoc = await Post.findById(postId);
    if (!postDoc) {
      console.log('[DOCUMENT DOES NOT EXIST] ');
    } else {
      const newComment = new Comment({
        commentText: commentText,
        commentCreator: userId
      })

      const saveComment = await newComment.save();

      postDoc.comment.push(saveComment._id);
      await postDoc.save();

      res.status(201).json({message: 'Comment Created! ', comment: saveComment})

    }

  } catch (err) {
    console.log('[eRROr 101] ', err);
  }
}

exports.getAllPosts = async (req, res, next) => {

  try {
    const postsDoc = await Post.find().populate('postCreator').sort({createdAt: -1});
    res.status(200).json({data: postsDoc})
  } catch (err) {
    console.log('[ERROR 101]');
  }
}

exports.getPostById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      console.log('nO POST fOUND ');
    } else {
      res.status(200).json({data: postDoc});
    }

  } catch (err) {
    console.log('[Error] ', err);
  }
}

exports.deletePost = async (req, res, next) => {

  const { id } = req.params;

  try {
    const postDoc = await Post.findByIdAndRemove(id).exec();
    console.log('[POST DOC]', postDoc)
    res.status(200).json({message: '[Post Deleted] ', post: postDoc});
  } catch (err) {
    console.log('[ERROR 11001] ', err);
  }
}
