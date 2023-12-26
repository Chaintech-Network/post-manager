# Post Manager Package

This npm package provides functionality for managing posts, including creating posts, fetching posts, and adding comments and adding reaction on post. It is built with Node.js, Express, and MongoDB.

## Installation

To use this package in your project, you can install it via npm:

```bash
npm install post-manager
```
## Usage
Initializing the Database Connection
Before using the package functions, initialize the database connection by providing your MongoDB connection string:

```
const communityPackage = require('post-manager');

const mongoUrl = 'Your mongo URL';

communityPackage.initializeDatabase(mongoUrl);
```

## Functions
### Create a Post
```
const media = [{
        type:'img', // 'img', 'pdf', 'video', 'gif', 'emoji', 'other'
        url:"url"   // Url of Media 
    }]
const postData = {
    title:"Post Title", // Mandatory to pass
    description:"Post Description", // Optional
    media:media // Optional
}

const newPost = communityPackage.createPost(userId,postData);  

console.log('New Post:', newPost);
```

### Update Post
```
const media = [{
        type:'img', // 'img', 'pdf', 'video', 'gif', 'emoji', 'other'
        url:"url"   // Url of Media 
    }]
const postData = {
    title:"Post Title", // Mandatory to pass
    description:"Post Description", // Optional
    media:media // Optional
}

const slug = "your-post-slug" // replace with your actual slug of Post

const updatePost = communityPackage.updatePost(postData,slug);  

console.log('Post Updated:', updatePost);
```

### Get Single Post Details
```
 const collection_info = {
      user_collection: "users", // User Collection name
      user_name: "name", // key name of user name
      user_avatar: "avatar", // key name of user avatar
      product_collection: "products", // product collection name
      product_name: "name",
      product_logo: "imgUrl",
      product_slug: "slug"
    }
    
const slug = "your-post-slug" // replace with your actual slug of Post

const Post = communityPackage.getSinglePost(collection_info,slug);  

console.log('Post:', Post);
```
### Delete Post
```
    
const slug = "your-post-slug" // replace with your actual slug of Post

const deletePost = communityPackage.deletePost(slug);  

console.log('Post:', deletePost);
```

### Get All Posts
```
const allPosts = communityPackage.getAllPosts();

console.log('All Posts:', allPosts);
```

### Add a Comment to a Post
```
const postId = '1234567890'; // Replace with an actual post ID

const commentData = {
    text:"Osm",
    parent:"1234567890"  // if you reply any comment then only pass the parent (comment id) other wise no need.
}

const newComment = communityPackage.addComment(postId,commentData);

console.log('New Comment:', newComment);
```

### Update Comment
```
const commentId = '1234567890'; // Replace with an actual comment ID

const commentData = {
    text:"Osm",
}

const updateComment = communityPackage.editComment(commentId,commentData);

console.log('Update Comment:', updateComment);
```

### Delete Comment
```
const commentId = '1234567890'; // Replace with an actual comment ID
const postId = '1234567890'; // Replace with an actual Post ID

const deleteComment = communityPackage.deleteComment(commentId,postId);

console.log('Delete Comment:', deleteComment);
```

### All Comment
```
const collection_info = {
      user_collection: "users", // User Collection name
      user_name: "name", // key name of user name
      user_avatar: "avatar", // key name of user avatar
    }
const postId = '1234567890'; // Replace with an actual Post ID

const allComment = communityPackage.allComments(collection_info,postId);

console.log('Comment:', allComment);
```

### Add a Reaction to a Post
```
const postId = '1234567890'; // Replace with an actual post ID

const reactionData = {
    text:"👍"
}

const newReaction = communityPackage.addReaction(postId,reactionData);

console.log('New Reaction:', newComment);
```
### Change Reaction 
```
const reactionId = '1234567890'; // Replace with an actual Reaction ID

const reactionData = {
    text:"👎"
}

const changeReaction = communityPackage.editReaction(reactionId,reactionData);

console.log('Change Reaction:', changeReaction);
```

### Remove Reaction 
```
const reactionId = '1234567890'; // Replace with an actual Reaction ID
const postId = '1234567890'; // Replace with an actual Post ID

const removeReaction = communityPackage.deleteReaction(reactionId,postId);

console.log('Remove Reaction:', removeReaction);
```

### All Reaction 
```
 const collection_info = {
      user_collection: "users", // User Collection name
      user_name: "name", // key name of user name
      user_avatar: "avatar", // key name of user avatar
    }
    
const postId = '1234567890'; // Replace with an actual Post ID

const Reactions = communityPackage.allReactions(collection_info,postId);

console.log('Reactions:', Reactions);
```

### All Post of a Product 
```
 const collection_info = {
      user_collection: "users", // User Collection name
      user_name: "name", // key name of user name
      user_avatar: "avatar", // key name of user avatar
      product_collection: "products", // product collection name
      product_name: "name",
      product_logo: "imgUrl",
      product_slug: "slug"
    }
    
const productId = '1234567890'; // Replace with an actual Post ID

const Data = communityPackage.allPostByProduct(collection_info,productId);

console.log('Data:', Data);
```

# License
This package is licensed under the MIT License - see the LICENSE file for details.

# Issues and Contributions
Feel free to open issues for bug reports, feature requests, or any suggestions. Contributions are also welcome. Please follow the contribution guidelines.

#
Make sure to include the appropriate license file (e.g., `LICENSE`) and create a `CONTRIBUTING.md` file if you want to specify how others can contribute to your project. Update the placeholders like `your-database-name` with actual details relevant to your package.
#
