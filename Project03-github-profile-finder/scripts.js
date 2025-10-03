const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const profileContainer = document.getElementById("profile-container");
const errorContainer = document.getElementById("error-container");
const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const usernameElement = document.getElementById("username");
const bioElement = document.getElementById("bio");
const locationElement = document.getElementById("location");
const joinedDateElement = document.getElementById("joined-date");
const profileLink = document.getElementById("profile-link");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("repos");
const companyElement = document.getElementById("company");
const blogElement = document.getElementById("blog");
const twitterElement = document.getElementById("twitter");
const companyContainer = document.getElementById("company-container");
const blogContainer = document.getElementById("blog-container");
const twitterContainer = document.getElementById("twitter-container"); 
const reposContainer = document.getElementById("repos-container");

searchBtn.addEventListener('click', searchUser);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === "Enter") searchUser();
});

async function searchUser() {
  const username = searchInput.value.trim();

  if (!username) {
    alert("Enter a username");
    return;
  }

  try {
    // Reset the UI
    profileContainer.classList.add("hidden");
    errorContainer.classList.add("hidden");
    
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found. Please try a differnt name");
      } else if (response.status === 403) {
        throw new Error("Server Clouded. Please try again later.");
      } else {
        throw new Error(`GitHub API error: ${response.status}`);
      }
    }

    const userData = await response.json();
    console.log("API Response:", userData);
    
    displayUserData(userData);

    await fetchRepositories(userData.repos_url) 
  } catch (error) {
    console.error("Error:", error);
    showError(error.message);    
  }
}

async function fetchRepositories(reposUrl) {
  reposContainer.innerHTML = `<div class="loading-repos">Loading repositories...</div>` 
  
  try {
    const response = await fetch(reposUrl + "?per_page=8")
    const repos = await response.json()
    displayRepos(repos)
  } catch (error) {
    reposContainer.innerHTML = `<div class="no-repos">${error.message}</div>`

  }
}

function displayRepos(repos) {
  if (repos.length === 0) {
    reposContainer.innerHTML = `<div class="no-repos">No repositories found</div>`
  }
  reposContainer.innerHTML = ""

  repos.forEach(repo => {
    const repoCard = document.createElement("div")
    repoCard.className = "repo-cards"

    const updatedAt = formatDate(repo.updated_at) 

     repoCard.innerHTML = `
      <a href="${repo.html_url}" target="_blank" class="repo-name">
        <i class="fas fa-code-branch"></i> ${repo.name}
      </a>
      <p class="repo-description">${repo.description || "No description available"}</p>
      <div class="repo-meta">
        ${
          repo.language
            ? `
          <div class="repo-meta-item">
            <i class="fas fa-circle"></i> ${repo.language}
          </div>
        `
            : ""
        }
        <div class="repo-meta-item">
          <i class="fas fa-star"></i> ${repo.stargazers_count}
        </div>
        <div class="repo-meta-item">
          <i class="fas fa-code-fork"></i> ${repo.forks_count}
        </div>
        <div class="repo-meta-item">
          <i class="fas fa-history"></i> ${updatedAt}
        </div>
      </div>
    `;

    reposContainer.appendChild(repoCard);
  })
}


function displayUserData(user) {
  // Basic user info
  avatar.src = user.avatar_url;
  nameElement.textContent = user.name || user.login;
  usernameElement.textContent = `@${user.login}`;
  bioElement.textContent = user.bio || "No bio available";
  locationElement.textContent = user.location || "Not specified";

  // Format date properly
  joinedDateElement.textContent = formatDate(user.created_at);

  // Profile link
  profileLink.href = user.html_url;
  profileLink.textContent = "View profile on GitHub";

  // Stats
  followers.textContent = user.followers;
  following.textContent = user.following;
  repos.textContent = user.public_repos;

  // Company
  if (user.company) {
    companyElement.textContent = user.company;
    companyContainer.style.display = "flex";
  } else {
    companyContainer.style.display = "none";
  }

  // Blog/Website
  if (user.blog) {
    blogElement.textContent = user.blog;
    blogElement.href = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
    blogContainer.style.display = "flex";
  } else {
    blogContainer.style.display = "none";
  }

  // Twitter
  if (user.twitter_username) {
    twitterElement.textContent = `@${user.twitter_username}`;
    twitterElement.href = `https://twitter.com/${user.twitter_username}`;
    twitterContainer.style.display = "flex";
  } else {
    twitterContainer.style.display = "none";
  }

  // Show the profile
  profileContainer.classList.remove("hidden");
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function showError(message = "User not found. Please try a different username.") {
  errorContainer.textContent = message;
  errorContainer.classList.remove("hidden");
  profileContainer.classList.add("hidden");
}