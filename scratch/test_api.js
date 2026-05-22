const BASE_URL = "http://localhost:5000/api";

const runTests = async () => {
  try {
    console.log("1. Testing login with curator...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "curator@pinvault.com",
        password: "curator123"
      })
    });
    
    if (!loginRes.ok) {
      throw new Error(`Login failed with status ${loginRes.status}: ${await loginRes.text()}`);
    }

    const { token, user } = await loginRes.json();
    console.log("Login Success! Username:", user.username);
    console.log("Token:", token.substring(0, 30) + "...");
    
    // Set headers
    const headers = { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    };

    console.log("\n2. Fetching posts...");
    const postsRes = await fetch(`${BASE_URL}/posts`);
    if (!postsRes.ok) {
      throw new Error(`Fetch posts failed with status ${postsRes.status}: ${await postsRes.text()}`);
    }
    const postsData = await postsRes.json();
    const posts = postsData.posts;
    console.log(`Successfully fetched ${posts.length} posts.`);
    const testPost = posts[0];
    console.log(`Selected Test Post: "${testPost.title}" (ID: ${testPost._id})`);

    console.log("\n3. Testing Save Post...");
    const saveRes = await fetch(`${BASE_URL}/posts/${testPost._id}/save`, {
      method: "POST",
      headers
    });
    if (!saveRes.ok) {
      throw new Error(`Save post failed with status ${saveRes.status}: ${await saveRes.text()}`);
    }
    const saveData = await saveRes.json();
    console.log("Save Post response data:", saveData);

    console.log("\n4. Testing Add Comment...");
    const commentRes = await fetch(`${BASE_URL}/posts/${testPost._id}/comment`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        text: "This is a programmatic test comment using native fetch!"
      })
    });
    if (!commentRes.ok) {
      throw new Error(`Add comment failed with status ${commentRes.status}: ${await commentRes.text()}`);
    }
    const commentData = await commentRes.json();
    console.log("Add Comment response comments count:", commentData.length);
    console.log("Latest Comment:", commentData[commentData.length - 1]);

    console.log("\n✅ All API endpoints (Login, Save, Comment) are working perfectly on the backend!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
};

runTests();
