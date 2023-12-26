const Community = require('../models/post.model')
const Comment = require('../models/comment.model')
const Reaction = require('../models/reaction.model')
const http = require('../config/httpConstant')
const { ObjectId } = require('mongodb');
const ShortUniqueId = require('short-unique-id');
const Res = require('../../service/general.helper')

// create a new post
const createPost = async (userId, postData, productId) => {
    try {

        const { title, description, media } = postData

        if (!title) {
            return Res(http.forbidden_code, "Description,Title or img are required");
        }

        if (!userId) {
            return Res(http.forbidden_code, "User Id is required");
        }

        const uid = new ShortUniqueId({ length: 5 });
        const slug = title.trim().replace(/ /g, '-') + "-" + uid.rnd()

        await Community.create({ title, description, productId, userId, slug, media, is_owner: false })

        return Res(http.success_code, "Post created successfully");

    } catch (error) {

        console.log(`Error at to post.controller createPost ${error}`)

        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// Update Post
const updatePost = async (postData, postSlug) => {
    try {

        const { title, description, media } = postData

        // Check Community exist or not
        const is_community_exist = await Community.findOne({ slug: postSlug })

        if (!is_community_exist) {
            return Res(http.forbidden_code, "Post Not Found");
        }

        // Update Community
        await Community.findOneAndUpdate({ slug: postSlug }, { title, description, media })

        return Res(http.success_code, "Post Updated successfully");

    } catch (error) {
        console.log(`Error at to community.controller updatePost ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// Delete Post
const deletePost = async (postSlug) => {
    try {
        // Check Community exist or not
        const is_community_exist = await Community.findOne({ slug: postSlug })

        if (!is_community_exist) {
            return Res(http.forbidden_code, "Post Not Found");
        }

        // Delete Community
        await Community.findOneAndDelete({ slug: postSlug })

        return Res(http.success_code, "Post Deleted successfully");

    } catch (error) {
        console.log(`Error at to community.controller deletePost ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// get a single Community details
const getPost = async (collection_info, postSlug) => {
    try {

        if (!postSlug) {
            return Res(http.forbidden_code, "Slug is Required");
        }

        


        const data = await Community.aggregate([
            {
                $match: {
                    slug: postSlug
                },
            },
            {
                $lookup: {
                    from: collection_info.product_collection,
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: collection_info.user_collection,
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $project: { is_owner: 1, title: 1, slug: 1, description: 1, media: 1, commentCount: 1, reactionCount: 1, createdAt: 1, product_name: { $first: `$product.${collection_info.product_name}` }, product_logo: { $first: `$product.${collection_info.product_logo}` }, product_slug: { $first: `$product.${collection_info.product_slug}` }, user_name: { $first: `$user.${collection_info.user_name}` }, user_logo: { $first: `$user.${collection_info.user_avatar}` }, }
            }
        ])

        return Res(http.success_code, "Data fetched successfully", data);
    } catch (error) {
        console.log(`Error at to community.controller getPost ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// get all Community Details
const getAllPost = async (collection_info, filter) => {
    try {
        const { page, pageSize, } = filter || { page: undefined, pageSize: undefined };
        const pageNum = parseInt(page) || 1
        const limit = parseInt(pageSize) || 15
        const skip = (pageNum - 1) * limit

        const data = await Community.aggregate([
            { $skip: skip },
            { $limit: limit },
            {
                $sort: {
                    reactionCount: -1 // 1 for ascending order, -1 for descending order
                }
            },
            {
                $lookup: {
                    from: collection_info.product_collection,
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: collection_info.user_collection,
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $project: { is_owner: 1, title: 1, slug: 1, description: 1, media: 1, commentCount: 1, reactionCount: 1, createdAt: 1, product_name: { $first: `$product.${collection_info.product_name}` }, product_logo: { $first: `$product.${collection_info.product_logo}` }, product_slug: { $first: `$product.${collection_info.product_slug}` }, user_name: { $first: `$user.${collection_info.user_name}` }, user_logo: { $first: `$user.${collection_info.user_avatar}` }, }
            }
        ])

        return Res(http.success_code, "Data fetched successfully", data);
    } catch (error) {
        console.log(`Error at to community.controller getAllPost ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}


// comment Post
const commentPost = async (userId, postId, commentData) => {
    try {
        const { text, parent } = commentData;

        const communityId = postId

        // comment reply
        if (parent) {
            await Comment.create({ text, userId: userId, parent })

            await Community.updateOne({ _id: communityId }, { $inc: { "commentCount": 1 } })

            return Res(http.success_code, "Comment successfully");
        }

        // new comment
        await Comment.create({ text, userId: userId, communityId, parent })

        await Community.updateOne({ _id: communityId }, { $inc: { "commentCount": 1 } })

        return Res(http.success_code, "Comment successfully");

    } catch (error) {
        console.log(`Error at to community.controller commentPost ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// comment Update
const commentUpdate = async (commentId, commentData) => {
    try {

        const { text } = commentData;


        // comment Exists
        const comment_exists = await Comment.findById(commentId)

        if (!comment_exists) {
            return Res(http.forbidden_code, "Comment not found");
        }

        await Comment.findByIdAndUpdate(commentId, { text })
        return Res(http.success_code, "Comment Updated successfully");

    } catch (error) {
        console.log(`Error at to community.controller commentUpdate ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// comment Deleted
const commentDeleted = async (commentId, postId) => {
    try {

        const community_Id = new ObjectId(postId)

        // comment Exists
        const comment_exists = await Comment.findById(commentId)

        if (!comment_exists) {
            return Res(http.forbidden_code, "Comment not found");
        }


        // Find Admin Id
        const product_admin = await Comment.aggregate([
            {
                $match: { _id: new ObjectId(commentId) }
            },
            {
                $graphLookup: {
                    from: 'comments', // Name of the collection
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parent',
                    as: 'nestedComments',
                    maxDepth: 10, // Adjust the depth based on your use case
                },
            },

            {
                $project: {
                    parentId: {
                        $map: {
                            input: '$nestedComments',
                            as: 'item',
                            in: { $toString: '$$item._id' }
                        }
                    }
                }
            }
        ])

        await Comment.findByIdAndDelete(commentId)

        const nestedDelete = await Comment.deleteMany({ _id: { $in: product_admin[0].parentId } })

        await Community.updateOne({ _id: community_Id }, { $inc: { "commentCount": -(nestedDelete.deletedCount + 1) } })

        return Res(http.success_code, "Comment deleted successfully");

    } catch (error) {

        console.log(`Error at to community.controller commentDeleted ${error}`)

        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// Reaction Post
const reactionPost = async (userId, postId, reaction) => {
    try {
        const { text } = reaction

        const communityId = new ObjectId(postId)

        if (!text) {

            return Res(http.forbidden_code, "Reaction are required");

        }
        if (!communityId) {
            return Res(http.forbidden_code, "Community id are required");
        }

        // check reaction Exists
        const reactionExist = await Reaction.findOne({ userId, communityId })

        if (reactionExist) {
            return Res(http.forbidden_code, "You have already reacted");
        }

        await Reaction.create({ text, communityId, userId })

        // Update Reaction Count
        await Community.updateOne({ _id: communityId }, { $inc: { "reactionCount": 1 } })

        return Res(http.success_code, "Reaction successfully");

    } catch (error) {
        console.log(`Error at to community.controller reactionPost ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// Reaction Update
const updateReaction = async (reactionId, reaction) => {

    try {
        const { text } = reaction;

        // reaction Exists
        const reaction_exist = await Reaction.findById(reactionId)

        if (!reaction_exist) {
            return Res(http.forbidden_code, "Reaction not found");
        }

        await Reaction.findByIdAndUpdate(reactionId, { text })
        return Res(http.success_code, "Reaction Updated successfully");

    } catch (error) {
        console.log(`Error at to community.controller updateReaction ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// Delete Reactions
const deleteReaction = async (reactionId) => {
    try {

        // const communityId = new ObjectId(req.params.communityId)

        // check Reaction Exists
        const reaction_exist = await Reaction.findById(reactionId)

        if (!reaction_exist) {
            return Res(http.forbidden_code, "Reaction not found");
        }

        await Reaction.findByIdAndDelete(reactionId)

        await Community.updateOne({ _id: reaction_exist.communityId }, { $inc: { "reactionCount": -1 } })

        return Res(http.success_code, "Reaction deleted successfully");

    } catch (error) {
        console.log(`Error at to community.controller deleteReaction ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// Get all comment
const getAllComment = async (collection_info, postId, filter) => {
    try {

        const { page, pageSize, view } = filter || { page: undefined, pageSize: undefined, view: undefined };

        const pageNum = parseInt(page) || 1
        const limit = parseInt(pageSize) || 3
        const skip = (pageNum - 1) * limit


        const viewMore = parseInt(view) || 3

        const communityId = new ObjectId(postId);



        const data = await Comment.aggregate([
            {
                $match: {
                    communityId: communityId,
                },
            },

            // pagination
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: collection_info.user_collection,
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $graphLookup: {
                    from: 'comments',
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parent',
                    maxDepth: viewMore,
                    depthField: 'depth',
                    as: 'replies',
                },
            },
            {
                $unwind: {
                    path: "$replies",
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: collection_info.user_collection,
                    localField: "replies.userId",
                    foreignField: "_id",
                    as: "replies.userDetails",
                },
            },
            {
                $unwind: {
                    path: "$replies.userDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $sort: { "replies.depth": -1 }, },
            {
                $group: {
                    _id: "$_id",
                    parent: { $first: "$parent" },
                    user_name: { $first: { $arrayElemAt: [`$userDetails.${collection_info.user_name}`, 0] } },
                    user_avatar: { $first: { $arrayElemAt: [`$userDetails.${collection_info.user_avatar}`, 0] } },
                    text: { $first: "$text" },
                    replies: { $push: "$replies" }
                }
            },
            {
                $addFields: {
                    replies: {
                        $reduce: {
                            input: "$replies",
                            initialValue: { depth: -1, presentChild: [], prevChild: [] },
                            in: {
                                $let: {
                                    vars: {
                                        prev: {
                                            $cond: [
                                                { $eq: ["$$value.depth", "$$this.depth"] },
                                                "$$value.prevChild",
                                                "$$value.presentChild"
                                            ]
                                        },
                                        current: {
                                            $cond: [{ $eq: ["$$value.depth", "$$this.depth"] }, "$$value.presentChild", []]
                                        }
                                    },
                                    in: {
                                        depth: "$$this.depth",
                                        prevChild: "$$prev",
                                        presentChild: {
                                            $concatArrays: [
                                                "$$current",
                                                [
                                                    {
                                                        $mergeObjects: [
                                                            "$$this",
                                                            {
                                                                replies: {
                                                                    $filter: {
                                                                        input: "$$prev",
                                                                        as: "e",
                                                                        cond: { $eq: ["$$e.parent", "$$this._id"] }
                                                                    }
                                                                },
                                                                user_name: `$$this.userDetails.${collection_info.user_name}`,
                                                                user_avatar: `$$this.userDetails.${collection_info.user_avatar}`,
                                                            }
                                                        ]
                                                    }
                                                ]
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    // id: "$_id",
                    replies: "$replies.presentChild"
                }
            }



        ])



        return Res(http.success_code, "Data fetched successfull", data);

    } catch (error) {
        console.log(`Error at to community.controller getAllComment ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// Get all Reaction
const getAllReactions = async (collection_info, postId, filter) => {
    try {

        const { page, pageSize } = filter || { page: undefined, pageSize: undefined };

        const pageNum = parseInt(page) || 1
        const limit = parseInt(pageSize) || 15
        const skip = (pageNum - 1) * limit

        const communityId = new ObjectId(postId);

        const data = await Reaction.aggregate([
            {
                $match: {
                    communityId: communityId,
                },
            },
            {
                $lookup: {
                    from: collection_info.user_collection,
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },

            // pagination
            { $skip: skip },
            { $limit: limit },

            {
                $project: { text: 1, createdAt: 1, user_name: { $first: `$user.${collection_info.user_name}` }, user_logo: { $first: `$user.${collection_info.user_avatar}` }, }
            }

        ])

        return Res(http.success_code, "Data fetched successfull", data);

    } catch (error) {
        console.log(`Error at to community.controller getAllComment ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}

// get all Community of single product
const get_product_community = async (collection_info,productId,filter) => {
    try {
        const { page, pageSize, } = filter || {page:undefined, pageSize:undefined}
        const pageNum = parseInt(page) || 1
        const limit = parseInt(pageSize) || 15
        const skip = (pageNum - 1) * limit
        // const viewMore = 5
        const id = new ObjectId(productId)
        
        const data = await Community.aggregate([
            {
                $match: { productId: id }
            },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: collection_info.user_collection,
                    localField: "userId",
                    foreignField: "_id",
                    as: "users"
                }
            },
            {
                $lookup: {
                    from: collection_info.product_collection,
                    localField: "productId",
                    foreignField: "_id",
                    as: "products"
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "communityId",
                    as: "comments"
                }
            },
            {
                $unwind: {
                    path: "$comments",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: collection_info.user_collection,
                    localField: "comments.userId",
                    foreignField: "_id",
                    as: "comments.userDetails"
                }
            },
            {
                $unwind: {
                    path: "$comments.userDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    is_owner: { $first: "$is_owner" },
                    product_name: { $first: { $arrayElemAt: [`$products.${collection_info.product_name}`, 0] } },
                    product_logo: { $first: { $arrayElemAt: [`$products.${collection_info.product_logo}`, 0] } },
                    product_slug: { $first: { $arrayElemAt: [`$products.${collection_info.product_slug}`, 0] } },
                    user_name: { $first: { $arrayElemAt: [`$users.${collection_info.user_name}`, 0] } },
                    user_logo: { $first: { $arrayElemAt: [`$users.${collection_info.user_avatar}`, 0] } },
                    title: { $first: "$title" },
                    description: { $first: "$description" },
                    createdAt: { $first: "$createdAt" },
                    commentCount: { $first: "$commentCount" },
                    reactionCount: { $first: "$reactionCount" },
                    media: { $first: "$media" },
                    comments: {
                        $push: {
                            _id: "$comments._id",
                            username: `$comments.userDetails.${collection_info.user_name}`,
                            avatar: `$comments.userDetails.${collection_info.user_avatar}`,
                            text: "$comments.text",
                            createdAt: "$comments.createdAt",
                        },
                    },
                    slug: { $first: "$slug" },
                },
            },

        ])

        return Res(http.success_code, "Data fetched successfully", data);
    } catch (error) {
        console.log(`Error at to community.controller getAllPost ${error}`)
        return Res(http.forbidden_code, "Internal Server Error");
    }
}


module.exports = { createPost, getAllReactions, commentPost, reactionPost, getAllComment, getPost, getAllPost, updatePost, deletePost, commentUpdate, commentDeleted, updateReaction, deleteReaction, get_product_community }