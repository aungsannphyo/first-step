const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        image: {
            type: Buffer,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectID,
            required: true,
            ref: "Admin",
        },
    },
    { timestamps: true }
);

//hidden data or customize responser
blogSchema.methods.toJSON = function () {
    const blog = this;
    const blogObject = blog.toObject();

    delete blogObject.slug;
    delete blogObject.image;
    delete blogObject.__v;
    return blogObject;
};

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
