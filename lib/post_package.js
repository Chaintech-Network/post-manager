const postController = require('./controllers/post.controller')

const initializeDatabase = require('./config/db.config')


module.exports = {

  initializeDatabase:initializeDatabase.dbConfig,

  createPost: postController.createPost,
  updatePost: postController.updatePost,
  deletePost: postController.deletePost,
  getSinglePost: postController.getPost,
  getAllPosts: postController.getAllPost,
  addComment: postController.commentPost,
  editComment: postController.commentUpdate,
  deleteComment: postController.commentDeleted,
  addReaction: postController.reactionPost,
  editReaction: postController.updateReaction,
  deleteReaction: postController.deleteReaction,
  allComments: postController.getAllComment,
  allReactions: postController.getAllReactions,
  allPostByProduct:postController.get_product_community,
  

}; 