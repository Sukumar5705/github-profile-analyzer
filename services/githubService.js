    const axios = require("axios");



    const fetchGithubProfile = async (username) => {
    const response = await axios.get(
        `https://api.github.com/users/${username}`
    );

    return response.data;
    };


    const fetchGithubRepos = async (username) => {
    const response = await axios.get(
        `https://api.github.com/users/${username}/repos`
    );

    return response.data;
    };

    module.exports = {
    fetchGithubProfile,
    fetchGithubRepos
    };