import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: 'Cant get all posts',
            error
        }) 
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        
        PostModel.findOneAndUpdate(
        {
             _id: postId,
        }, 
        {
            $inc: { viewsCount: 1 },
        },
        {
            returnDocument: 'after',
        },
        (err, doc) => {
            if (err) {
                return res.status(500).json({
                    message: 'Cant get post',
                    err
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Post does not find'
                })
            }
            res.json(doc);
        });
    } catch (error) {
        res.status(500).json({
            message: 'Cant get one post',
            error
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.imageUrl,
            user: req.userId
        });

        const post = await doc.save();
        res.json(post)
    } catch (error) {
        res.status(500).json({
            message: 'Cant create post',
            error
        });
    }
}