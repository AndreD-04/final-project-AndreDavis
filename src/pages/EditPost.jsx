import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase.from('hotTakes').select().eq('id', id).single();
            setPost(data);
        };
        fetchPost();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prev) => ({ ...prev, [name]: value }));
    };

    const updatePost = async (event) => {
        event.preventDefault();
        const { error } = await supabase
            .from('hotTakes')
            .update({ 
                title: post.title, 
                content: post.content, 
                image_url: post.image_url 
            })
            .eq('id', id);

        if (error) {
            console.error("Update failed:", error);
        } else {
            // Success! Send them back to the post view
            navigate(`/post/${id}`);
        }
    };

    if (!post) return <div className="PostDetails-container"><h1>Loading Post...</h1></div>;

    return (
        <div className="PostDetails-container">
            <div className="detail-card">
                <h1>Update Your Take ✏️</h1>
                <form onSubmit={updatePost}>
                    <label>Title</label>
                    <input name="title" value={post.title} onChange={handleChange} required />
                    
                    <label>Content</label>
                    <textarea name="content" value={post.content} rows="6" onChange={handleChange} />
                    
                    <label>Image URL</label>
                    <input name="image_url" value={post.image_url} onChange={handleChange} />
                    
                    <button type="submit" className="create-submit-btn">Update Post</button>
                </form>
            </div>
        </div>
    );
};

export default EditPost;