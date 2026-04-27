import React, { useState } from 'react';
import { supabase } from '../client';

const CreatePost = () => {
    const [post, setPost] = useState({ title: "", content: "", image_url: "" });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prev) => ({ ...prev, [name]: value }));
    };

    const createPost = async (event) => {
        event.preventDefault();
        const { error } = await supabase.from('hotTakes').insert({ 
            title: post.title, 
            content: post.content, 
            image_url: post.image_url 
        });

        if (error) { alert("Error: " + error.message); } 
        else { window.location = "/"; }
    };

   return (
    <div className="PostDetails-container">
        <div className="detail-card">
            <h1>Add Your Take 🎬</h1>
            <form onSubmit={createPost}>
                <div className="form-field">
                    <label>Movie/TV Show Title</label>
                    <input name="title" type="text" placeholder="What's the show?" onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label>Your Reasoning</label>
                    <textarea name="content" placeholder="Why is this a hot take?" rows="6" onChange={handleChange} />
                </div>
                <div className="form-field">
                    <label>Image URL (Optional)</label>
                    <input name="image_url" type="text" placeholder="Paste link here..." onChange={handleChange} />
                </div>
                <button type="submit" className="create-submit-btn">Publish Take</button>
            </form>
        </div>
    </div>
);
};

export default CreatePost;