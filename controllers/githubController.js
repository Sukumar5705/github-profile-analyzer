    const db = require("../config/db");

    const {
    fetchGithubProfile,
    fetchGithubRepos
    } = require("../services/githubService");

    const analyzeRepositories = require("../utils/analyzer");

    /*
    ========================================
    ANALYZE GITHUB PROFILE
    ========================================
    */

    const analyzeProfile = async (req, res) => {
    try {
        const { username } = req.params;

        /*
        ========================================
        FETCH GITHUB PROFILE
        ========================================
        */

        const profile = await fetchGithubProfile(username);

        /*
        ========================================
        FETCH REPOSITORIES
        ========================================
        */

        const repos = await fetchGithubRepos(username);

        /*
        ========================================
        ANALYZE REPOSITORIES
        ========================================
        */

        const insights = analyzeRepositories(repos);

        /*
        ========================================
        CALCULATE ACCOUNT AGE
        ========================================
        */

        const createdDate = new Date(profile.created_at);

        const today = new Date();

        const accountAgeDays = Math.floor(
        (today - createdDate) / (1000 * 60 * 60 * 24)
        );

        /*
        ========================================
        CHECK IF USER EXISTS
        ========================================
        */

        const checkQuery =
        "SELECT * FROM profiles WHERE username = ?";

        const [existingProfile] = await db.query(checkQuery, [
        username
        ]);

        /*
        ========================================
        UPDATE EXISTING PROFILE
        ========================================
        */

        if (existingProfile.length > 0) {
        const updateQuery = `
            UPDATE profiles
            SET
            name = ?,
            bio = ?,
            public_repos = ?,
            followers = ?,
            following = ?,
            total_stars = ?,
            total_forks = ?,
            most_used_language = ?,
            account_age_days = ?,
            profile_url = ?,
            avatar_url = ?
            WHERE username = ?
        `;

        await db.query(updateQuery, [
            profile.name,
            profile.bio,
            profile.public_repos,
            profile.followers,
            profile.following,
            insights.totalStars,
            insights.totalForks,
            insights.mostUsedLanguage,
            accountAgeDays,
            profile.html_url,
            profile.avatar_url,
            username
        ]);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
            username: profile.login,
            followers: profile.followers,
            publicRepos: profile.public_repos,
            totalStars: insights.totalStars,
            mostUsedLanguage:
                insights.mostUsedLanguage
            }
        });
        }

        /*
        ========================================
        INSERT NEW PROFILE
        ========================================
        */

        const insertQuery = `
        INSERT INTO profiles
        (
            username,
            name,
            bio,
            public_repos,
            followers,
            following,
            total_stars,
            total_forks,
            most_used_language,
            account_age_days,
            profile_url,
            avatar_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(insertQuery, [
        profile.login,
        profile.name,
        profile.bio,
        profile.public_repos,
        profile.followers,
        profile.following,
        insights.totalStars,
        insights.totalForks,
        insights.mostUsedLanguage,
        accountAgeDays,
        profile.html_url,
        profile.avatar_url
        ]);

        /*
        ========================================
        SUCCESS RESPONSE
        ========================================
        */

        res.status(201).json({
        success: true,
        message: "Profile analyzed successfully",
        data: {
            username: profile.login,
            followers: profile.followers,
            publicRepos: profile.public_repos,
            totalStars: insights.totalStars,
            mostUsedLanguage:
            insights.mostUsedLanguage
        }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        message: error.message
        });
    }
    };

    /*
    ========================================
    GET ALL PROFILES
    ========================================
    */

        const getAllProfiles = async (req, res) => {
    try {
        /*
        ========================================
        PAGINATION
        ========================================
        */

        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 5;

        const offset = (page - 1) * limit;

        /*
        ========================================
        GET TOTAL COUNT
        ========================================
        */

        const [countResult] = await db.query(
        "SELECT COUNT(*) AS total FROM profiles"
        );

        const totalProfiles = countResult[0].total;

        /*
        ========================================
        FETCH PAGINATED DATA
        ========================================
        */

        const query = `
        SELECT *
        FROM profiles
        ORDER BY analyzed_at DESC
        LIMIT ? OFFSET ?
        `;

        const [profiles] = await db.query(query, [
        limit,
        offset
        ]);

        /*
        ========================================
        RESPONSE
        ========================================
        */

        res.status(200).json({
        success: true,

        currentPage: page,

        totalPages: Math.ceil(totalProfiles / limit),

        totalProfiles,

        count: profiles.length,

        data: profiles
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        message: error.message
        });
    }
    };

    /*
    ========================================
    GET SINGLE PROFILE
    ========================================
    */

    const getSingleProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const query =
        "SELECT * FROM profiles WHERE username = ?";

        const [profile] = await db.query(query, [username]);

        if (profile.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Profile not found"
        });
        }

        res.status(200).json({
        success: true,
        data: profile[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        message: error.message
        });
    }
    };


        const searchProfiles = async (req, res) => {
    try {
        const { username } = req.query;

        /*
        ========================================
        VALIDATION
        ========================================
        */

        if (!username) {
        return res.status(400).json({
            success: false,
            message: "Username query is required"
        });
        }

        /*
        ========================================
        SEARCH QUERY
        ========================================
        */

        const query = `
        SELECT *
        FROM profiles
        WHERE username LIKE ?
        ORDER BY analyzed_at DESC
        `;

        const [profiles] = await db.query(query, [
        `%${username}%`
        ]);

        /*
        ========================================
        NO RESULTS
        ========================================
        */

        if (profiles.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No matching profiles found"
        });
        }

        /*
        ========================================
        RESPONSE
        ========================================
        */

        res.status(200).json({
        success: true,
        count: profiles.length,
        data: profiles
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        message: error.message
        });
    }
    };
    /*
    ========================================
    DELETE PROFILE
    ========================================
    */

    const deleteProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const query =
        "DELETE FROM profiles WHERE username = ?";

        await db.query(query, [username]);

        res.status(200).json({
        success: true,
        message: "Profile deleted successfully"
        });

    } 
    catch (error) {
    console.error(error);

    /*
    ========================================
    GITHUB USER NOT FOUND
    ========================================
    */

    if (error.response && error.response.status === 404) {
        return res.status(404).json({
        success: false,
        message: "GitHub user not found"
        });
    }

    /*
    ========================================
    GITHUB API RATE LIMIT
    ========================================
    */

    if (error.response && error.response.status === 403) {
        return res.status(403).json({
        success: false,
        message: "GitHub API rate limit exceeded"
        });
    }

    /*
    ========================================
    DATABASE ERROR
    ========================================
    */

    if (error.code) {
        return res.status(500).json({
        success: false,
        message: "Database error",
        error: error.message
        });
    }

    /*
    ========================================
    GENERAL ERROR
    ========================================
    */

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
    }
    };

module.exports = {
    analyzeProfile,
    getAllProfiles,
    getSingleProfile,
    searchProfiles,
    deleteProfile
};