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
    
        const updatedPost = await PostModel.findOneAndUpdate(
            {
            _id: postId,
            },
            {
            $inc: { viewsCount: 1 },
            },
            {
            returnDocument: 'after',
            }
        ).populate('user');
    
        if (!updatedPost) {
            return res.status(404).json({
            message: 'Cant find post',
            });
        }
    
        res.json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cant find post',
        });
    }
  };

  export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
    
        const deletedPost = await PostModel.findOneAndDelete({
            _id: postId,
        });
    
        if (!deletedPost) {
            return res.status(404).json({
            message: 'Cant find post',
            });
        }
  
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cant get posts',
        });
    }
  };

  export const update = async (req, res) => {
    try {
        const postId = req.params.id;
    
        const updatedPost = await PostModel.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });
    
        if (!updatedPost ) {
            return res.status(404).json({
            message: 'Cant find post',
            });
        }
  
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cant update posts',
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