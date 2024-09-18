const blogListElement = document.getElementById('blog-list');
const createBlogFormElement = document.getElementById('create-blog-form');

createBlogFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const tag = document.getElementById('tag').value;
    const author = document.getElementById('author').value;

    try {
        const response = await fetch('/api/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, tag, author }),
        });
        const blog = await response.json();
        console.log(blog);
        displayBlogPost(blog);
    } catch (error) {
        console.error(error);
    }
});

async function getBlogPosts() {
    try {
        const response = await fetch('/api/blogs');
        const blogs = await response.json();
        blogs.forEach((blog) => {
            displayBlogPost(blog);
        });
    } catch (error) {
        console.error(error);
    }
}

function displayBlogPost(blog) {
    const blogPostElement = document.createElement('div');
    blogPostElement.className = 'blog-post';
    blogPostElement.innerHTML = `
        <h2>${blog.title}</h2>
        <p>${blog.description}</p>
        <p>Tag: ${blog.tag}</p>
        <p>Author: ${blog.author}</p>
    `;
    blogListElement.appendChild(blogPostElement);
}

getBlogPosts();