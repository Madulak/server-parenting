const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const AWS = require('aws-sdk');

exports.postNewPost = async (req, res, next) => {
  const { postText } = req.body;
  const userId = req.userId;

  console.log('[BODY UP] ',req.body);
  console.log('[FILE] ', req.file);

  const access_key = process.env.AWS_ACCESS_KEY;
  const secret_key = process.env.AWS_SECRET_KEY;

  try {

    const s3 = new AWS.S3({
        accessKeyId: access_key,
        secretAccessKey: secret_key
    });

    const params = {
        Bucket: 'images1001',
        Key: req.file.filename, // File name you want to save as in S3
        Body: req.file.path
    };
    let ur;
    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        ur = data.Location
    });

    var params2 = {Bucket: 'bucket', Key: 'key'};
    s3.getSignedUrl('putObject', params2, function (err, url) {
      console.log('The URL is', url);
    });

    // var promise = s3.getSignedUrlPromise('putObject', params);
    //   promise.then(function(url) {
    //   console.log('The URL is ', url);
    // }, function(err) { console.log('[Error] ', err)})

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
