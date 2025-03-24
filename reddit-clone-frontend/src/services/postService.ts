export async function createPost(formData: FormData): Promise<any> {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token || ""}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create post.");
    }

    return await res.json();
}
