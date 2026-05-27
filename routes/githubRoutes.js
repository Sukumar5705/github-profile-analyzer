const express = require("express");

const router = express.Router();

const {
    analyzeProfile,
    getAllProfiles,
    getSingleProfile,
    searchProfiles,
    deleteProfile
} = require("../controllers/githubController");

/*
========================================
TEST ROUTE
========================================
*/

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GitHub Routes Working"
  });
});

/*
========================================
ANALYZE GITHUB PROFILE
========================================

POST /api/github/analyze/:username
*/

router.post("/analyze/:username", analyzeProfile);

/*
========================================
GET ALL ANALYZED PROFILES
========================================

GET /api/github/profiles
*/

router.get("/profiles", getAllProfiles);

/*
========================================
GET SINGLE PROFILE
========================================

GET /api/github/profiles/:username
*/
router.get("/search", searchProfiles);
router.get("/profiles/:username", getSingleProfile);

/*
========================================
DELETE PROFILE
========================================

DELETE /api/github/profiles/:username
*/

router.delete("/profiles/:username", deleteProfile);

module.exports = router;