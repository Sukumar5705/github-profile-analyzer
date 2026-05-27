const axios = require("axios");

const githubAPI = axios.create({
  baseURL: "https://api.github.com",

  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  }
});

const fetchGithubProfile = async (username) => {
  const response = await githubAPI.get(
    `/users/${username}`
  );

  return response.data;
};

const fetchGithubRepos = async (username) => {
  const response = await githubAPI.get(
    `/users/${username}/repos`
  );

  return response.data;
};

module.exports = {
  fetchGithubProfile,
  fetchGithubRepos
};
