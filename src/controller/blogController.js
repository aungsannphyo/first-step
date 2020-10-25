const slugify = require("slugify");

const Blog = require("../models/blog");

exports.getAll = async (req, res) => {
    const item_per_page = 10;
    const page = parseInt(req.query.page);

    try {
        const totalItems = await Blog.find().countDocuments();

        const blogs = await Blog.find()
            .skip((page - 1) * item_per_page)
            .limit(item_per_page)
            //sorting desc
            .sort({ createdAt: -1 });

        //make paginatin meta data
        let meta = {
            total: totalItems,
            has_next_page: item_per_page * page < totalItems,
            has_previous_page: page > 1,
            next_page: page + 1,
            previous_page: page - 1,
            last_page: Math.ceil(totalItems / item_per_page),
        };

        res.status(200).send({ data: blogs, meta: meta });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

//create blog
exports.create = async (req, res) => {
    //if image is empty
    if (!req.file) {
        return res.status(400).send({ error: "Please select a Image!" });
    }
    //make slug url
    const slug = slugify(req.body.title);

    //create a new blog post
    const blog = new Blog({
        ...req.body,
        image: req.file.buffer,
        slug: slug,
        owner: req.admin._id,
    });
    try {
        await blog.save();
        res.status(201).send({ data: blog });
    } catch (err) {
        if (err.code === 11000) {
            res.status(422).send({ error: "Title Name already exists!" });
        }
    }
};

// image serving
exports.servingImage = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog || !blog.image) {
            throw new Error("Image not found");
        }
        res.set("Content-Type", "image/png");
        res.status(200).send(blog.image);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
};

//delete blog
exports.delete = async (req, res) => {
    try {
        //find and delete
        const blog = await Blog.findOneAndDelete({
            _id: req.params.id,
            owner: req.admin.id,
        });
        if (!blog) {
            return res.status(404).send("Cann't find this content");
        }
        res.status(200).send({ data: "Successful Delete" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

//update blog
exports.update = async (req, res) => {
    //if image is empty
    if (!req.file) {
        return res.status(400).send({ error: "Please select a Image!" });
    }

    //validate update field
    const updates = Object.keys(req.body);
    const allowUpdates = ["title", "content"];
    const isValidOperation = updates.every((update) =>
        allowUpdates.includes(update)
    );

    //check if invalid update request
    if (!isValidOperation) {
        res.status(400).send({ erro: "Invalid updates request" });
    }

    try {
        //find and update
        const blog = await Blog.findOneAndUpdate({
            _id: req.params.id,
            owner: req.admin.id,
        });

        updates.forEach((update) => (blog[update] = req.body[update]));
        blog.image = req.file.buffer;
        await blog.save();
        res.status(200).send({ error: "Successful updated" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};
